/*
 *
 * Title: Customer model
 * Description: Customer model define
 * Author: Shah Arafat
 * Date: 21-02-2021
 *
 */
// dependencies
const mongoose = require('mongoose');
const Joi = require('joi');

// define customer schema
const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

// customers model
const Customer = mongoose.model('Customer', customerSchema);

// validate customer data with joi
const validateCustomer = (customer) => {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(9).required(),
  });

  const { error } = schema.validate(customer);

  return error;
};

// export module
module.exports = { Customer, validate: validateCustomer };
