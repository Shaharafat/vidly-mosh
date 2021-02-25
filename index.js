/*
 *
 * Title: App
 * Description: App file
 * Author: Shah Arafat
 * Date: 19-02-2021
 *
 */

// dependencies
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middlewares/error');

const app = express();

// if environment variable is not set. then cancel
if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivate is not defined.');
  process.exit(1);
}

mongoose
  .connect('mongodb://localhost/vidly', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to mongoDB');
  })
  .catch(() => console.error('Could not connect to mongoDB...'));

app.use(express.json());
app.use(helmet());
// genres router
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// error handling middleware
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
