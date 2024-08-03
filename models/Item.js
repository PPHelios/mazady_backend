const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  item_name: { type: "string", required: true, minLength: 2, maxLength: 2 },
  item_desc: { type: "string", required: true, minLength: 20, maxLength: 2000 },
  item_price: {
    type: "number",
    required: true,
    minLength: 20,
    maxLength: 2000
  },
  item_expiration_date: { type: Date },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
});
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/category/${this._id}`;
});
export default mongoose.model("Item", ItemSchema);
