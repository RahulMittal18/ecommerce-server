const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/', (req, res, next) => {
//  console.log(req);
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        // 401 means unauthorized
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        if (result) {
          const token = jwt.sign({
            userId: user[0]._id,
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            email: user[0].email,
          }, 
          'my_secret_key',
          {
            expiresIn: "1d"
          });
          console.log(user[0].role);
          return res.status(200).json({
            message: 'Auth successful',
            token: token,
            role:user[0].role,
            cart: user[0].cart,
            firstName: user[0].first_name,
            shippingAddresses: user[0].shipping_addresses
          });
        }
        return res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;