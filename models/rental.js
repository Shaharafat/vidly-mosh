/*
 *
 * Title: Author Model
 * Description: Author model and data validation
 * Author: Shah Arafat
 * Date: 22-02-2021
 *
 */
// dependencies
const mongoose = require('mongoose');
const moment = require('moment');
const Joi = require('joi');

const customCustomerSchema = new mongoose.Schema({
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

const customMovieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    min: 5,
    max: 255,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 50,
    required: true,
  },
});

const rentalSchema = new mongoose.Schema({
  customer: {
    type: customCustomerSchema,
    required: true,
  },
  movie: {
    type: customMovieSchema,
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, 'days');
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

// rental model
const Rental = mongoose.model('Rental', rentalSchema);

const validateRental = (rental) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  const { error } = schema.validate(rental);
  return error;
};

// export module
module.exports = {
  Rental,
  validate: validateRental,
};
