const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res, next) => {
  // console.log("hi");
  console.log(req.userData);
  const doc = await User.findOne({ _id: req.userData.userId });
  if (doc != null) {
    const user = await User.updateOne(
      { _id: req.userData.userId },
      { $set: req.body }
    );
    //   console.log(comment)
    return res.json({
        message: 'Signed out successfully'
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
