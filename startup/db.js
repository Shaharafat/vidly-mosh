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
const config = require('config');

const initializeDb = () => {
  const db = config.get('db');
  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
      winston.info(`connected to ${db}`); // log with winston
    });
};

// export module
module.exports = initializeDb;
