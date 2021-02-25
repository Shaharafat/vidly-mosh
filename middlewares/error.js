/*
 *
 * Title: error handling middlewars
 * Description: error handling middlware created
 * Author: Shah Arafat
 * Date: 25-02-2021
 *
 */
const error = (err, req, res, next) => {
  // Log the exception
  res.status(500).send('Something failed.');
};

// export
module.exports = error;
