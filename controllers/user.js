import Item from "../models/Item.js";
import User from "../models/User.js";

/**
 * @route POST /addItem
 * @desc Add new item
 * @access Private
 */
export const addItem = async (req, res) => {
  const {
    item_name,
    item_desc,
    item_price,
    item_expiration_date,
    category,
    imageUrls
  } = req.body;
  const item = new Item({
    item_name,
    item_desc,
    item_price,
    category,
    item_expiration_date,
    category,
    owner: req.userId,
    imageUrls
  });

  try {
    const savedItem = await item.save();
    if (!savedItem) {
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "Account does not exist" });
      return;
    }
    user.ads.push(savedItem._id);
    const savedUser = await user.save();
    if (!savedUser) {
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
    res.status(201).json({ savedItem });
  } catch (err) {
    console.error("err");
    console.log(err);
    res.status(500).json({ message: err.message });
    return;
  }
};

/**
 * @route GET /ads
 * @desc Get user ads
 * @access Private
 */
export async function getUserAds(req, res) {
  const userId = req.userId;
  try {
    const userWithAds = await User.findById(userId)
      .populate("ads")
      .select("ads");
    if (!userWithAds) {
      res.status(404).json({ message: "Account does not exist" });
      return;
    }
    res.status(200).json({
      ads: userWithAds.ads
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

/**
 * @route GET /profile
 * @desc Get user profile
 * @access Private
 */
export async function getUserProfile(req, res) {
  const userId = req.userId;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(404).json({ message: "Account does not exist" });
    return;
  }
  res.status(200).json({ user });
}

/**
 * @route PATCH /editProfile
 * @desc Edit user profile
 * @access Private
 */
export async function editUserProfile(req, res) {
  const { first_name, last_name, email, password } = req.body;
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("+password");
    // validate password
    const isPasswordValid = bcrypt.compare(password, user.password);
    // if not valid, return unathorized response
    if (!isPasswordValid) return res.sendStatus(401);

    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    const saveUpdateUser = await user.save({ new: true });

    // remove password from response
    user = user.toObject();
    delete user.password;
    res.status(200).json({ user: saveUpdateUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

/**
 * @route PATCH /editProfileWithPassword
 * @desc Edit user profile and password
 * @access Private
 */
export async function editUserProfileWithPassword(req, res) {
  const { first_name, last_name, email, newPassword } = req.body;
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("+password");
    // validate password
    const isPasswordValid = bcrypt.compare(password, user.password);
    // if not valid, return unathorized response
    if (!isPasswordValid) return res.sendStatus(401);

    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.password = newPassword;

    const saveUpdateUser = await user.save({ new: true });

    // remove password from response
    user = user.toObject();
    delete user.password;
    res.status(200).json({ user: saveUpdateUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}
