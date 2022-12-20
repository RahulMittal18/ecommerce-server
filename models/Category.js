const mongoose = require("mongoose");
//var textSearch = require('mongoose-text-search');

const categorySchema = mongoose.Schema(
  {
    cName: {
      type: String,
      required: true,
    },
    cDescription: {
      type: String,
      required: true,
    },
    cImage: {
      type: String,
    },
    cStatus: {
      type: String,
      required: true,
    },
    cType: {
      type: String,
      required: true,
    },
    cProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

// userSchema.index({ email: "text" });

module.exports = mongoose.model("Category", categorySchema);
