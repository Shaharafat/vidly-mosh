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
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const helmet = require('helmet');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middlewares/error');

const app = express();

// handle uncaught exception
process.on('uncaughtException', (ex) => {
  console.log('WE GOT AND UNCAUGHT EXCEPTION');
  winston.error(ex.message, ex);
});
// handle unhandled rejection
process.on('unhandledRejection', (ex) => {
  console.log('WE GOT AND UNHANDLED REJECTION');
  winston.error(ex.message, ex);
});

// another way to handle the exception shown above
// winston will handle exception, log it and terminate :D
// winston.handleExceptions(new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

// process.on('unhandledRejection', (ex) => {
//   throw ex;
// });

winston.add(new winston.transports.File({ filename: 'combined.log' }));
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' }));

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
