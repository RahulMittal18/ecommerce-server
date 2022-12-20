const mongoose = require('mongoose');

var forgotPasswordTokenSchema = new mongoose.Schema({
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: {
        expires: 60*10
      },
    },
  });



  module.exports = mongoose.model(
    "ForgotPasswordToken",
    forgotPasswordTokenSchema
  );