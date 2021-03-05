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

const app = express();
require('./startup/logging')();  //! logging initializer (put it first)
require('./startup/routes')(app); // get all the routes
require('./startup/db')(); // start db
require('./startup/config')(); // jwt config
// joi validation initialization code
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winston.info(`listening to port ${port}`);
});

// export server
module.exports = server;
