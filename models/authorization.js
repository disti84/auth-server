const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
// Define collection and schema for User  
let authorizationSchema = new Schema({
    email:
    {
      type: String,
      lowercase: true
    },
    password:
    {
      type: String,
    },
    refreshToken:
    {
      type: String,
    },
}, {
  collection: 'Authorization'
});
authorizationSchema.statics.authenticate = function (email, password, method, callback) {
  if(method != 'local')
  {
    return
  }
  this.findOne({ 'email': email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}
authorizationSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});
// UserSchema.pre('save', function (next) {
//   var user = this;
//   bcrypt.hash(user.local.password, 10, function (err, hash) {
//     if (err) {
//       return next(err);
//     }
//     user.local.password = hash;
//     next();
//   })
// });
module.exports = mongoose.model('authorization', authorizationSchema);  