const mongoose = require("mongoose");
//var textSearch = require('mongoose-text-search');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: { type: String, required: true },
  photo_url: { type: String, default: "" },
  role: { type: String, required: true, default: "user" },
  products_uploaded: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  products_liked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cart: { type: Array, default: [] },
  shipping_addresses: { type: Array, default: [] },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

userSchema.index({ email: "text" });

module.exports = mongoose.model("User", userSchema);
