/*
 *
 * Title: users API
 * Description: user api to register users
 * Author: Shah Arafat
 * Date: 23-02-2021
 *
 */

// dependencies
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middlewares/auth');
const { User, validate } = require('../models/user');

const router = express.Router();

// get user data
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const error = validate(req.body);

  if (error) {
    const {
      details: [{ message }],
    } = error;
    // bad request
    res.status(400).send(message);
    return;
  }

  // check already registerd with this mail or not
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered. ');

  //! lodash pic representation of above object
  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  // hash password with bcrypt
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

  // get props from user object
});

// export
module.exports = router;
