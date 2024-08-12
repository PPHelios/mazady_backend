import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categoryEnum = [
  "cars",
  "electronics",
  "home",
  "fashion",
  "sports",
  "art",
  "other"
];
const ItemSchema = new Schema({
  item_name: { type: "string", required: true, minLength: 10, maxLength: 30 },
  item_desc: { type: "string", required: true, minLength: 20, maxLength: 2000 },
  item_price: {
    type: "number",
    required: true,
    min: 1,
    max: 1000000000
  },
  item_expiration_date: { type: Date, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, enum: categoryEnum, required: true },
  imageUrls: { type: [String], required: true } // Array of images URLS
});
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/${this._id}`;
});
export default mongoose.model("Item", ItemSchema);
