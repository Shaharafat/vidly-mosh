/*
 *
 * Title: user model
 * Description: user model and data validation
 * Author: Shah Arafat
 * Date: 23-02-2021
 *
 */
// dependencies
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    maxlength: 1024,
    required: true,
  },
});

// user model
const User = mongoose.model('User', userSchema);

// validate user input with joi
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().minlength(3).max(50).required(),
    emailengthl: Joi.string().email({ tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
  });

  const { error } = schema.validate(user);
  return error;
};

// export module
module.exports = {
  User,
  validate: validateUser,
};
