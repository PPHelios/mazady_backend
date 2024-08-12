import Item from "../models/Item.js";

const findByCategory = async (req, res) => {
  const { category } = req.params;
  if (!category) {
    res.status(400).json({ message: "Category is required" });
    return; // stop the function
  }
  try {
    const ads = await Item.find({ category });
    res.status(200).json({ ads });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Id is required" });
    return; // stop the function
  }
  try {
    const ad = await Item.findById(id);
    res.status(200).json({ ad });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { findByCategory, findById };