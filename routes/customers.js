/*
 *
 * Title: Customer API
 * Description: Customers api and mongoose modeling
 * Author: Shah Arafat
 * Date: 21-02-2021
 *
 */

// dependencies
const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');

const router = express.Router();

// define customer schema
const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  phone: { type: String, required: true },
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

// get all customers
router.get('/', async (req, res) => {
  let customers;
  try {
    customers = await Customer.find().sort('name');
  } catch (ex) {
    return res.status(500).send('Error getting data');
  }

  if (!customers) {
    return res.status(404).send('Not Found any data');
  }
  res.send(customers);
});

// get individual customers
router.get('/:id', async (req, res) => {
  let customer;
  try {
    customer = await Customer.findById(req.params.id);
  } catch (ex) {
    console.log(ex);
    return res.status(404).send('Error getting data...');
  }

  if (!customer) {
    return res.status(404).send('Customer with the given id was not found');
  }
  res.send(customer);
});

// create new customer
router.post('/', async (req, res) => {
  // validate user input with joi
  const error = validateCustomer(req.body);
  if (error) {
    const {
      details: [{ message }],
    } = error;
    // bad request
    res.status(400).send(message);
    return;
  }

  // create new customes
  const customer = await new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });

  try {
    const result = await customer.save();
    res.send(result);
  } catch (ex) {
    for (const prop in ex.errors) {
      res.status(400).send(ex.errors[prop].properties.message);
    }
  }
});

// update customer
router.put('/:id', async (req, res) => {
  // validate user input with joi
  const error = validateCustomer(req.body);
  if (error) {
    const {
      details: [{ message }],
    } = error;
    // bad request
    res.status(400).send(message);
    return;
  }

  const updatedData = {
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  };

  let customer;
  try {
    customer = await Customer.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  } catch (ex) {
    return res.status(404).send('Error updating customer');
  }

  if (!customer) {
    return res.status(404).send('The customer with the given id was not found!');
  }
  res.send(customer);
});

// delete customer
router.delete('/:id', async (req, res) => {
  let customer;
  try {
    customer = await Customer.findByIdAndRemove(req.params.id);
  } catch (ex) {
    return res.status(400).send('Error deleting customer');
  }

  if (!customer) {
    return res.status(404).send('The customer with the given id was not found!');
  }
  res.send(customer);
});

// export module
module.exports = router;
