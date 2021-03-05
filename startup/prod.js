/*
 *
 * Title: production related modules
 * Description:production related modules
 * Author: Shah Arafat
 * Date: 05-03-2021
 *
 */

// dependencies
const helmet = require('helmet');
const compression = require('compression');

module.exports = function (app) {
  app.use(helmet());
  app.use(compression());
}