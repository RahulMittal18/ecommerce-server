const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log(req.body.shipping_address);
  console.log(req.userData);
  const doc = await User.findOne({ _id: req.userData.userId });
  if (doc != null) {
    const user = await User.updateOne(
      { _id: req.userData.userId },
      { $push: { "shipping_addresses": req.body.shipping_address } },
      {safe: true, upsert: true}
    );
    const addresses = await User.findOne({ _id: req.userData.userId })
    console.log(addresses);
    return res.json({
      addresses
    });
  }
  //   User
  //     .find({user:req.userData.userId})
  //     .exec()
  //     .then(docs => {
  //       res.status(200).json(docs);
  //     })
  //     .catch(err => {
  //       res.status(500).json({
  //         error: err
  //       });
  //     });
});

module.exports = router;
