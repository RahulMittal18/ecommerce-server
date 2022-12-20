const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    pDescription: {
      type: String,
      required: true,
    },
    pPrice: {
      type: Number,
      required: true,
    },
    pSold: {
      type: Number,
      default: 0,
    },
    pQuantity: {
      type: Number,
      default: 0,
    },
    pType: {
      type: String,
      required: true,
    },
    pCategory: {
      type: ObjectId,
      ref: "Category",
    },
    pImages: {
      type: Array,
      required: true,
    },
    pOffer: {
      type: String,
      default: null,
    },
    pRatingsReviews: [
      {
        review: String,
        user: { type: ObjectId, ref: "User" },
        rating: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    pStars: {
      type: Number,
      default: 15,
    },
    pStarUsers:{
      type: Number,
      default: 4,
    },
    pStatus: {
      type: String,
      required: true,
    },
    pOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
