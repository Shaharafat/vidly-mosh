/*
 *
 * Title: Genre model
 * Description: Genre related model defined here
 * Author: Shah Arafat
 * Date: 21-02-2021
 *
 */
// dependencies
const mongoose = require('mongoose');
const Joi = require('joi');

// genre schema
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
  },
});

// genre model
const Genre = mongoose.model('Genre', genreSchema);

// validate
const validateGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  const { error } = schema.validate(genre);

  return error;
};

// export module
module.exports = { Genre, validate: validateGenre };
