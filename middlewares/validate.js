/*
 *
 * Title: validate middlewares
 * Description: validate middlewares
 * Author: Shah Arafat
 * Date: 04-03-2021
 *
 */

const validate = (validator) => (req, res, next) => {
  const error = validator(req.body);

  if (error) {
    const {
      details: [{ message }],
    } = error;
    // bad request
    return res.status(400).send(message);
  }
  next();
};

module.exports = validate;