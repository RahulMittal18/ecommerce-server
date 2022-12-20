const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

router.get('/', (req, res, next) => {
  // console.log(req.body);
  Product
    .find({})
    .populate("pCategory","cName")
    .exec()
    .then(docs => {
      // console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


router.get('/:id', (req, res, next) => {
  console.log(`${req.query} this is specific productdetail`);
  Product
    .findById(req.params.id)
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