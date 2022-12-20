const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.post("/", async (req, res) => {
  let { rId, pId } = req.body;
  if (!rId) {
    return res.json({ message: "All filled must be required" });
  } else {
    try {
      let reviewDelete = Product.findByIdAndUpdate(pId, {
        $pull: { pRatingsReviews: { _id: rId } },
      });
      reviewDelete.exec((err, result) => {
        if (err) {
          console.log(err);
        }
        return res.json({ success: "Your review is deleted" });
      });
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports=router;