/*
 *
 * Title: Genres API Route
 * Description: Create genres api route
 * Author: Shah Arafat
 * Date: 20-02-2021
 *
 */

// dependencies
const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');

const router = express.Router();

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

// get all genres
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// get individual genre
router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('Could not found genre');

  res.send(genre);
});

// add new genre
router.post('/', async (req, res) => {
  const error = validateGenre(req.body);

  if (error) {
    const {
      details: [{ message }],
    } = error;
    // bad request
    res.status(400).send(message);
    return;
  }

  let genre = new Genre({
    name: req.body.name,
  });
  genre = await genre.save();

  res.send(genre);
});

// update a genre
router.put('/:id', async (req, res) => {
  const error = validateGenre(req.body);

  if (error) {
    const {
      details: [{ message }],
    } = error;
    // bad request
    res.status(400).send(message);
    return;
  }

  let genre;
  try {
    genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  } catch (ex) {
    return res.status(404).send('The genre with the given id was not found!');
  }

  res.send(genre);
});

// delete genres
router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('Could not found genre to delete!');

  res.send(genre);
});

module.exports = router;
