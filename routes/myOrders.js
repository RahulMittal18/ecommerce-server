const express = require('express');
const Order = require("../models/Order")
const router = express.Router();


router.get('/', (req, res, next) => {
    // console.log("hi");
//   console.log(req.body);
  Order
    .find({user:req.userData.userId})
    .populate("orderItems.id","pName pDescription pImages pPrice pOffer")
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;