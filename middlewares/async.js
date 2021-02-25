/*
 *
 * Title: async middleware
 * Description: async middlware for error handling
 * Author: Shah Arafat
 * Date: 25-02-2021
 *
 */

function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
}
// export
module.exports = asyncMiddleware;
