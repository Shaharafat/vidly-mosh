/*
 *
 * Title: define api routes
 * Description: define api route
 * Author: Shah Arafat
 * Date: 27-02-2021
 *
 */
// dependencies
const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const error = require('../middlewares/error');

const routes = (app) => {
  app.use(express.json());
  // genres router
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/returns', returns);

  // error handling middleware
  app.use(error);
};

//  exports
module.exports = routes;
