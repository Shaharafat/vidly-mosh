/*
 *
 * Title: authorization middlewars
 * Description: authorization middleware
 * Author: Shah Arafat
 * Date: 25-02-2021
 *
 */
// dependencies
const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided');

  try {
    //! decoded will give the payload of that token
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid Token!');
  }
};

module.exports = auth;
