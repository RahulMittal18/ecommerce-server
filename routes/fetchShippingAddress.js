const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res, next) => {
  console.log(req.body.shipping_address);
  console.log(req.userData);
  const doc = await User.findOne({ _id: req.userData.userId });
  if (doc != null) {
    const user = await User.updateOne(
      { _id: req.userData.userId },
      { $push: { "shipping_addresses": req.body.shipping_address } },
      {safe: true, upsert: true}
    );
    return res.json({
      message: "fetched shipping address",
    });
  }

});

module.exports = router;
