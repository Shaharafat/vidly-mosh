/*
 *
 * Title: admin middleware
 * Description: admin middleware checks whether the user admin or not for roled based authorization
 * Author: Shah Arafat
 * Date: 25-02-2021
 *
 */
const admin = (req, res, next) => {
  // 401 unauthorized
  // 403 forbidden

  if (!req.user.isAdmin) return res.status(403).send('Access Denied');

  next();
};

module.exports = admin;
