/*
 *
 * Title: Rental API
 * Description: Rental API and connect to mongo
 * Author: Shah Arafat
 * Date: 22-02-2021
 *
 */

// dependencies
const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

const router = express.Router();

// initialize Fawn
Fawn.init(mongoose);

// get all rentals
router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.find().sort('-dateout');
    res.send(rentals);
  } catch (ex) {
    return res.status(404).send('Rentals not found');
  }
});

// get single rental
router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('Could not found rental');

  res.send(rental);
});

// create new rental
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

  // find customer
  let customer;
  try {
    customer = await Customer.findById(req.body.customerId);
  } catch (ex) {
    return res.status(404).send("Couldn't find the customer");
  }

  // find movie
  let movie;
  try {
    movie = await Movie.findById(req.body.movieId);
  } catch (ex) {
    return res.status(400).send(ex);
  }

  if (movie.numberInStock < 1) return res.status(400).send('Not enough number in stock');
  // rental instance
  const rental = new Rental({
    customer: {
      _id: customer._id,
      isGold: customer.isGold,
      name: customer.name,
      phone: customer.name,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // rental = await rental.save();

  // movie.numberInStock -= 1;
  // movie.save();
  // !using transaction with Fawn here.
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(rental);
  } catch (ex) {
    console.log(ex);
    return res.status(404).send("Couldn't find the movie");
  }
});
// export
module.exports = router;
