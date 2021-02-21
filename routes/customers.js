/*
 *
 * Title: Customer API
 * Description: Customers api and mongoose modeling
 * Author: Shah Arafat
 * Date: 21-02-2021
 *
 */

// dependencies
const express = require('express');
const { Customer, validate } = require('../models/customer'); // customer

const router = express.Router();
// get all customers
router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');

  res.send(customers);
});

// get individual customers
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    return res.send(customer);
  } catch (ex) {
    return res.status(404).send('Customer with the given id was not found');
  }
});

// create new customer
router.post('/', async (req, res) => {
  // validate user input with joi
  const error = validate(req.body);
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
    for (const prop of ex.errors) {
      res.status(400).send(ex.errors[prop].properties.message);
    }
  }
});

// update customer
router.put('/:id', async (req, res) => {
  // validate input
  // validate user input with joi
  const error = validate(req.body);
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

  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.send(customer);
  } catch (ex) {
    return res.status(404).send('The customer with the given id was not found!');
  }
});

// delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    res.send(customer);
  } catch (ex) {
    return res.status(400).send('Could not found the customer to delete');
  }
});

// export module
module.exports = router;
