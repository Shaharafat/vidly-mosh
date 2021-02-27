/*
 *
 * Title: Genres API Route
 * Description: Create genres api route
 * Author: Shah Arafat
 * Date: 20-02-2021
 *
 */

// dependencies
const express = require('express');
const { Genre, validate } = require('../models/genre');

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();

// get all genres
router.get('/', async (req, res) => {
  throw new Error('Could not get the genre.');
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
router.post('/', auth, async (req, res) => {
  const error = validate(req.body);

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
  const error = validate(req.body);

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
router.delete('/:id', [auth, admin], async (req, res) => {
  console.log(req.params.id);
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('Could not found genre to delete!');

  res.send(genre);
});

module.exports = router;
