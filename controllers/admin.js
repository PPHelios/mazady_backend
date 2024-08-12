import Item from "../models/Item.js";

/**
 * @route GET dashboard/allAds
 * @desc Registers a user
 * @access Private
 */
export async function getAllAds(req, res) {
  const allAds = await Item.find();
  // console.log(allAds)
  if (!allAds) {
    res.status(204);
    return;
  }
  res.status(200).json({ ads: allAds });
}
