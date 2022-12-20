const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    orderItems: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User" },

    totalPrice: { type: Number, required: true },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
    // orderNumber: { type: String, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      mobile: {type:String, required:true},
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
      paymentMethod: { type: String, required: true },
      // paymentResult: {
      //   id: String,
      //   status: String,
      //   update_time: String,
      //   email_address: String,
      // },
    orderDateAndTime: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    // taxPrice: { type: Number, required: true, default: 0 },
    //   seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    //   isPaid: { type: Boolean, default: false },
    //   paidAt: { type: Date },
    //   isDelivered: { type: Boolean, default: false },
    //   deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
