const express = require('express');
const authRoutes = express.Router();
const bcrypt = require('bcrypt');
// Require User model in our routes module  
var jwt = require('../jwt');
let authorization = require('../models/authorization');

const createToken = user => {
  return jwt.generateToken(user);
};

authRoutes.route('/login').get(function (req, res) {
  let email = req.query.email;
  let password = req.query.password;
  let method = req.query.method;
  authorization.authenticate(email, password, method, function (error, user) {
    if (error) {
      return res.status(500).end('Error on the server.');
    }
    else if (!user) {
      return res.status(404).end('No user found.')
    }
    var token = createToken(user)
    var refreshToken = createToken(user)
    //update Auth DB
    authorization.findOneAndUpdate({ email: email }, { refreshToken: refreshToken }, function (err, doc, next) {
      if (err)
        return res.status(500).end(err);
    });
    
    user.password = '';
    return res.status(200).send({ auth: true, user: user, token: token, refreshToken: refreshToken });
  });
});

authRoutes.get('/logout', function (req, res, next) {
  var reqRefresToken = req.headers['x-refresh-token'];
  authorization.findOneAndDelete({ refreshToken: reqRefresToken }, function (err, doc, next) {
    if (err) return res.send(500, { error: err });
  });
});

//verify access token
authRoutes.get('/token', jwt.verifyToken, function (req, res) {
  try {
    res.status(200).send("Token valid");
  }
  catch (err) {
    console.log(err);
  }
});

authRoutes.get('/refreshToken', function (req, res) {
  try {
    var reqRefresToken = req.headers['x-refresh-token'];

    authorization.findOne({ refreshToken: reqRefresToken }, function (err, user) {
      if (err)
        return res.status(500).send("error: refresh token not present")
      else {
        var accessToken = createToken(user)
        var refreshToken = createToken(user)

        authorization.findOneAndUpdate({ refreshToken: reqRefresToken }, { refreshToken: refreshToken }, function (err, doc, next) {
          if (err)
            return res.status(500).end(err);
          else
            return res.status(200).send({ refreshToken: refreshToken, accessToken: accessToken })
        });
      }
    })
  }
  catch (err) {
    console.log(err);
  }
});
// Defined edit route  
// userRoutes.route('/edit/:id').get(function (req, res) {
//   let id = req.params.id;
//   Product.findById(id, function (err, product) {
//     res.json(product);
//   });
// });
//  Defined update route  
// userRoutes.route('/update/:id').post(function (req, res) {
//   Product.findById(req.params.id, function (err, product) {
//     if (!product)
//       res.status(404).send("Record not found");
//     else {
//       product.ProductName = req.body.ProductName;
//       product.ProductDescription = req.body.ProductDescription;
//       product.ProductPrice = req.body.ProductPrice;
//       product.save().then(product => {
//         res.json('Update complete');
//       })
//         .catch(err => {
//           res.status(400).send("unable to update the database");
//         });
//     }
//   });
// });
// Defined delete | remove | destroy route  
// userRoutes.route('/delete/:id').get(function (req, res) {
//   Product.findByIdAndRemove({ _id: req.params.id }, function (err, product) {
//     if (err) res.json(err);
//     else res.json('Successfully removed');
//   });
// });
module.exports = authRoutes; 