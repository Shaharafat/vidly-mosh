/*
 *
 * Title: Movies models
 * Description: Movies database model created with embedded relationship
 * Author: Shah Arafat
 * Date: 22-02-2021
 *
 */
// dependencies
const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

// movies schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    min: 5,
    max: 255,
    required: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 50,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 50,
    required: true,
  },
});

// movie model
const Movie = mongoose.model('Movie', movieSchema);

// validate user movie data
const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(5).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  const { error } = schema.validate(movie);
  return error;
};

// export module
module.exports = {
  Movie,
  validate: validateMovie,
};
