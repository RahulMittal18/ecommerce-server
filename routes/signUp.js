const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const User = require('../models/User');
const Token = require('../models/TokenSchema');
const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
// require('dotenv').config();

// const apiKey = defaultClient.authentications["api-key"];
// apiKey.apiKey = process.env.API_KEY;
//apiKey.apiKey = "xsmtpsib-d5d4b83d7c356b855211b721b778c78fdab74387bf1823ff084305ca83588e17-rLF7qnJ1Rkh9QHCM"
//console.log("hello this is api key",process.env.API_KEY)
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
// 10 is number of salting rounds
router.post('/', (req, res, next) => {
  console.log(req.body.email);
  // 409 means conflict
  // 422 means unprocess about entity
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      // By default, if no user found, user = []
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Mail exists'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              error: err
            });
          } else {

            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
            //   channel_name: req.body.first_name + " " + req.body.last_name,
              password: hash
            });

            user
              .save()
              .then(result => {
                    // console.log("success");
                //another code here 
                // var token = new Token({
                //   _userId: user._id,
                //   token: crypto.randomBytes(16).toString('hex'),
                // });
                // token.save(function (err) {
                //   if (err) {
                //     return res.status(500).send({
                //       msg: err.message,
                //     });
                //   }
                //   // mail configuration for sendinblue
                // //   sendSmtpEmail = {
                // //     to: [{
                // //       email: req.body.email,
                // //     }],
                // //     sender: {
                // //       email: process.env.ACCOUNT,
                // //     },
                // //     subject: 'email verification',
                // //     htmlContent: '<h1>Hello</h1> <a href="https://' +
                // //       req.headers.host +
                // //       '/confirmation/' +
                // //       user.email+
                // //       '/' +
                // //       token.token +
                // //       '">Click here to verify</a><p>If the link does not work then please copy the code given below in the browser</p>' +
                // //       '<p>http://' +
                // //       req.headers.host +
                // //       '/confirmation/' +
                // //       user.email +
                // //       '/' +
                // //       token.token +
                // //       '</p>',
                // //     headers: {
                // //       'api-key': process.env.API_KEY,
                // //       'content-type': 'application/json',
                // //       accept: 'application/json',
                // //     },
                // //   };
                // //   apiInstance.sendTransacEmail(sendSmtpEmail).then(
                // //     function (data) {
                // //       console.log('API called successfully. Returned data: ' + data);
                // //       // res.render('cnf_email')
                // //       res.status(201).json({
                // //         message: 'cnf mail'
                // //       });
                // //     },
                // //     function (error) {
                // //       console.error(error);
                // //     }
                // //   );
                // }
                // );
              
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                });
              }
              
              )
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(422).json({
        error: err
      });
    });
});

module.exports = router;