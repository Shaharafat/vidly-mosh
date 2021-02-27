/*
 *
 * Title: App
 * Description: App file
 * Author: Shah Arafat
 * Date: 19-02-2021
 *
 */

// dependencies
const winston = require('winston');
const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet());
require('./startup/logging')(); //! logging initializer (put it first)
require('./startup/routes')(app); // get all the routes
require('./startup/db')(); // start db
require('./startup/config')(); // jwt config
// joi validation initialization code
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`listening to port ${port}`);
});
