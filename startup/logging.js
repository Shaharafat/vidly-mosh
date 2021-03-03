/*
 *
 * Title: logging errors
 * Description: loggin errors initializer
 * Author: Shah Arafat
 * Date: 27-02-2021
 *
 */
// dependencies
const winston = require('winston');
// const { createLogger, transports } = require('winston');
// require('winston-mongodb');
require('express-async-errors');

const logger = () => {
  // handle uncaught exception
  // process.on('uncaughtException', (ex) => {
  //   console.log('WE GOT AND UNCAUGHT EXCEPTION');
  //   winston.error(ex.message, ex);
  // });
  // handle unhandled rejection
  // process.on('unhandledRejection', (ex) => {
  //   console.log('WE GOT AND UNHANDLED REJECTION');
  //   winston.error(ex.message, ex);
  // });

  // another way to handle the exception shown above
  // winston will handle exception, log it and terminate :D
  // winston.handleExceptions(new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

  // new approach
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: 'combined.log' }));
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
  // winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' }));
};

// export module
module.exports = logger;
