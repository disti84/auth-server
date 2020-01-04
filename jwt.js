var jwt = require('jsonwebtoken');
require('dotenv').config('/.env')

const secret = process.env.JWT_SECRET_PASSWORD;

module.exports.verify = token => {
  return jwt.verify(token, secret);
};

module.exports.verifyToken = (req, res, next) => {

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  // verifies secret and checks exp
  jwt.verify(token, secret, function (err, decoded) {
    if (err && err.name == 'TokenExpiredError')
      return res.status(401).send({ auth: false, message: err.message });
    if(err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything is good, save to request for use in other routes
    req.userId = decoded.data.id;
    next();
  });

}

module.exports.generateToken = user => {
  return jwt.sign( {data: { id:user._id }}, secret, {
    expiresIn: 86400 // expires in 24 hours
  });
};
