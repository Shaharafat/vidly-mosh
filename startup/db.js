/*
 *
 * Title: database initialization
 * Description: database initialization
 * Author: Shah Arafat
 * Date: 27-02-2021
 *
 */
// dependencies
const mongoose = require('mongoose');
const winston = require('winston');

const initializeDb = () => {
  mongoose
    .connect('mongodb://localhost/vidly', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      winston.info('connected to mongoDB'); // log with winston
    });
};

// export module
module.exports = initializeDb;
