/*
 *
 * Title: error handling middlewars and logger
 * Description: error handling middlware created and logger used
 * Author: Shah Arafat
 * Date: 25-02-2021
 *
 */
// dependencies
const winston = require('winston');
// require('winston-mongodb');

// const logger = winston.createLogger({
//   level: 'error',
//   transports: [
//     new winston.transports.File({ filename: 'combined.log' }),
//     new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' }),
//   ],
// });

const error = (err, req, res, next) => {
  // Log the exception
  winston.error(err.message, err);
  res.status(500).send('Something failed.');
};

// export
module.exports = error;
