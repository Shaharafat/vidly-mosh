/*
 *
 * Title: Movies API
 * Description: Movies API created
 * Author: Shah Arafat
 * Date: 22-02-2021
 *
 */

// dependencies
const express = require('express');
const { Genre } = require('../models/genre');
const { Movie, validate } = require('../models/movie');

const router = express.Router();

// get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort('name');
    res.send(movies);
  } catch (ex) {
    res.status(404).send('Not Found');
  }
});

// get single movies
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('Movie with given id not found');
  res.send(movie);
});

// create new movie data
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
  let genre;
  try {
    genre = await Genre.findById(req.body.genreId);
  } catch (ex) {
    return res.status(400).send('Invalid genre id..');
  }

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  const result = await movie.save();
  res.send(result);
});

// update movie data
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
    genre = await Genre.findById(req.body.genreId);
  } catch (ex) {
    return res.status(400).send('Invalid genre id..');
  }

  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      { new: true }
    );
    res.send(movie);
  } catch (ex) {
    return res.status(400).send('Error updating movie');
  }
});

// delete movis
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    res.send(movie);
  } catch (ex) {
    return res.status(400).send('Error deleting movie');
  }
});
// export
module.exports = router;
