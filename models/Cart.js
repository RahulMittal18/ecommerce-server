const mongoose = require("mongoose");

let ItemSchema = new mongoose.Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity can not be less then 1."],
      },
      size:{
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  module.exports = mongoose.model("item", ItemSchema);


const cartSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [ItemSchema],
  subTotal: {
    default: 0,
    type: Number,
  },
});

// userSchema.index({ email: "text" });

module.exports = mongoose.model("Cart", cartSchema);
