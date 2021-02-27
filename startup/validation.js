/*
 *
 * Title: validation Joi
 * Description: joi validation
 * Author: Shah Arafat
 * Date: 27-02-2021
 *
 */
// dependencies
const Joi = require('joi');

const validation = () => {
  Joi.objectId = require('joi-objectid')(Joi);
};

module.exports = validation;
