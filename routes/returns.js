/*
 *
 * Title: returns route object
 * Description: returns router object
 * Author: Shah Arafat
 * Date: 04-03-2021
 *
 */
// dependencies
const express = require('express');
const Joi = require('joi');
const validate = require('../middlewares/validate');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middlewares/auth');

const router = express.Router();

// validate
const validateReturn = (returns) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  const { error } = schema.validate(returns);

  return error;
};

// get all genres
router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  if (!req.body.customerId) return res.status(400).send('customer id not provided');
  if (!req.body.movieId) return res.status(400).send('movie id not provided');

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rentals not found');

  if (rental.dateReturned) return res.status(400).send('return already processed');
  rental.return();

  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );
  return res.send(rental);
});

module.exports = router;
