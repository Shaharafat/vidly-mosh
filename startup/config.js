/*
 *
 * Title: startup configuration
 * Description: startup configuration related files
 * Author: Shah Arafat
 * Date: 27-02-2021
 *
 */
// dependencies
const config = require('config');

const configuration = () => {
  // if environment variable is not set. then cancel
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
};

// export
module.exports = configuration;
