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
const Joi = require('joi');

const router = express.Router();

// demo
const genres = [
  { id: 1, name: 'Romance' },
  { id: 2, name: 'Thiller' },
];

// validate
const validateGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  const { error } = schema.validate(genre);

  return error;
};

// get all genres
router.get('/', (req, res) => {
  res.send(genres);
});

// get individual genre
router.get('/:id', (req, res) => {
  const genre = genres.find((item) => item.id === parseInt(req.params.id, 10));
  if (!genre) return res.status(404).send('Could not found genre');

  res.send(genre);
});

// add new genre
router.post('/', (req, res) => {
  const error = validateGenre(req.body);

  if (error) {
    const {
      details: [{ message }],
    } = error;
    // bad request
    res.status(400).send(message);
    return;
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  res.send(genre);
});

// update a genre
router.put('/:id', (req, res) => {
  const genre = genres.find((item) => item.id === parseInt(req.params.id, 10));
  if (!genre) return res.status(404).send('Could not found genre to update!');

  const error = validateGenre(req.body);

  if (error) {
    const {
      details: [{ message }],
    } = error;
    // bad request
    res.status(400).send(message);
    return;
  }

  genre.name = req.body.name;
  res.send(genre);
});

// delete genres
router.delete('/:id', (req, res) => {
  const genre = genres.find((item) => item.id === parseInt(req.params.id, 10));
  if (!genre) return res.status(404).send('Could not found genre to delete!');

  // find index
  const genreIndex = genres.indexOf(genre);

  // delete genre
  genres.splice(genreIndex, 1);
  res.send(genre);
});

module.exports = router;
