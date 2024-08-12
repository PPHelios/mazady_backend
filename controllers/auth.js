import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../utils/jwt.util.js";
import { cookieOptions } from "../config/cookie.config.js";
import { getBlackList, setBlackList } from "../utils/cache.util.js";

const roles = {
  "0x01": "User",
  "0x88": "Admin"
};
/**
 * @route POST auth/register
 * @desc Registers a user
 * @access Public
 */
export async function Register(req, res) {
  // get required variables from request body
  // using es6 object destructing
  const { first_name, last_name, email, password, rePassword } = req.body;
  if (password !== rePassword) {
    res.status(400).json({
      data: [],
      message: "Passwords do not match"
    });
    return;
  }
  try {
    // create an instance of a user
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: req.body.password
    });
    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        data: [],
        message: "It seems you already have an account, please log in instead."
      });
      return;
    }

    const savedUser = await newUser.save(); // save new user into the database
    savedUser = savedUser.toObject(); // Convert Mongoose document to plain JavaScript object
    delete savedUser.password; // Remove the password field
    savedUser.role = roles[savedUser.role]; // Change user code to readable string
    const accessToken = createAccessToken({ userId: savedUser._id }); // generate session token for user
    res.cookie("AccessToken", accessToken, cookieOptions); // set the token to http-only cookie
    const refreshToken = createRefreshToken({ userId: savedUser._id }); // generate session token for user
    res.cookie("RefreshToken", refreshToken, cookieOptions); // set the token to http-only cookie
    res.status(200).json({
      data: savedUser,
      message:
        "Thank you for registering with us. Your account has been successfully created."
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      data: [],
      message: "Internal server error"
    });
  }
}

/**
 * @route POST auth/login
 * @desc logs in a user
 * @access Public
 */
export async function Login(req, res) {
  // Get variables for the login process
  const { email } = req.body;
  try {
    // Check if user exists
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        data: [],
        message: "Account does not exist"
      });
      return;
    }

    // if user exists
    // validate password
    const isPasswordValid = bcrypt.compare(
      `${req.body.password}`,
      user.password
    );
    // if not valid, return unathorized response
    if (!isPasswordValid) {
      res.status(401).json({
        data: [],
        message:
          "Invalid email or password. Please try again with the correct credentials."
      });
      return;
    }

    const accessToken = createAccessToken({ userId: user._id }); // generate session token for user
    res.cookie("AccessToken", accessToken, cookieOptions); // set the token to http-only cookie
    const refreshToken = createRefreshToken({ userId: user._id }); // generate session token for user
    res.cookie("RefreshToken", refreshToken, cookieOptions); // set the token to http-only cookie
    user = user.toObject(); // Convert Mongoose document to plain JavaScript object
    delete user.password; // Remove the password field
    user.role = roles[user.role]; // Change user code to readable string
    res.status(200).json({
      data: user,
      message: "You have successfully logged in."
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      data: [],
      message: "Internal Server Error"
    });
  }
}

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Public
 */
export async function Logout(req, res) {
  try {
    const refreshToken = req.cookies["RefreshToken"];
    if (!refreshToken) {
      res.sendStatus(204); // No content
      return;
    }
    // Clear tokens from cookies
    res.cookie("AccessToken", "", { maxAge: 0, httpOnly: true });
    res.cookie("RefreshToken", "", { maxAge: 0, httpOnly: true });
    // Also clear request cookie on client side
    const checkIfBlacklisted = await getBlackList(refreshToken);
    // // if true, send a no content response.
    if (!checkIfBlacklisted) await setBlackList(refreshToken); // Blacklist token
    res.status(200).json({ message: "You are logged out!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
}
