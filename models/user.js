/*
 *
 * Title: user model
 * Description: user model and data validation
 * Author: Shah Arafat
 * Date: 23-02-2021
 *
 */
// dependencies
const jwt = require('jsonwebtoken');
const config = require('config');
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
    minlength: 8,
    maxlength: 1024,
    required: true,
  },
  isAdmin: Boolean,
});

// Information export principles
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};

// user model
const User = mongoose.model('User', userSchema);

// validate user input with joi hello
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }),
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
