/*
 *
 * Title: authentication router
 * Description: authentication user and data validation
 * Author: Shah Arafat
 * Date: 24-02-2021
 *
 */
// dependencies
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const router = express.Router();

// validate user input with joi hello
const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
  });

  const { error } = schema.validate(req);
  return error;
};

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
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('email or password is not valid');

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send('email or password is not valid');

  const token = user.generateAuthToken();
  res.send(token);
});

// export
module.exports = router;
