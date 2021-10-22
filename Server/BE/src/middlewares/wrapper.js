const generalerror = require('../exceptions/generalerror');
const notfound = require('../exceptions/notfound');
const logger = require('../utils/logger');
const resHelper = require("../utils/resHelper");
const baseError = require('../exceptions/baseError');

module.exports = {
  wrapper: function (processFunction) {
    return function (req, res, next) {
      var result = processFunction(req, res, next);
      if (result.then) {
        result.then(innerResult => {
          resHelper(res, innerResult);
        }).catch(next);
      } else {
        resHelper(res, result);
      }
    }
  },

  handler: function (router) {
    router.use(function (_req, res, _next) {
      const result = new notfound("not_found", "Không tìm thấy api xử lý");
      resHelper(res, result);
    });
    router.use(function (error, req, res, _next) {
      if (Array.isArray(error)) {
        resHelper(res, error);
      }
      else {
        logger(req.originalUrl)
        logger(error);
        let result;

        if (process.env.NODE_ENV) {
          result = generalerror()
        }
        else {
          result = baseError("internal_server_error", error.toString(), 500);
        }
        resHelper(res, result);
      }
    });
  }
}