/*
 *
 * Title: Genres
 * Description: Genres api creation
 * Author: Shah Arafat
 * Date: 19-02-2021
 *
 */
// dependencies
const express = require('express');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));

// demo
const genres = [
  { id: 1, genre: 'Atif Aslam' },
  { id: 2, genre: 'Arijit' },
];

// validate
const validateGenre = (genre) => {
  const schema = Joi.object({
    genre: Joi.string().min(3).required(),
  });
  const { error } = schema.validate(genre);

  return error;
};

// get all genres
app.get('/api/genres', (req, res) => {
  res.send(genres);
});

// get individual genre
app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find((item) => item.id === parseInt(req.params.id, 10));
  if (!genre) return res.status(404).send('Could not found genre');

  res.send(genre);
});

// add new genre
app.post('/api/genres', (req, res) => {
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
    genre: req.body.genre,
  };

  genres.push(genre);
  res.send(genre);
});

// update a genre
app.put('/api/genres/:id', (req, res) => {
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

  genre.genre = req.body.genre;
  res.send(genre);
});

// delete genres
app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find((item) => item.id === parseInt(req.params.id, 10));
  if (!genre) return res.status(404).send('Could not found genre to delete!');

  // find index
  const genreIndex = genres.indexOf(genre);

  // delete genre
  genres.splice(genreIndex, 1);
  res.send(genre);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
