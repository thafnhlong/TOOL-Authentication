const logger = require('../utils/logger');
const resHelper = require("../utils/resHelper");
const responseBase = require('../models/responseBase');
const baseError = require('../exceptions/baseError');
const generalerror = require('../exceptions/generalerror');
const notfound = require('../exceptions/notfound');

module.exports = {
  wrapper: function (processFunction) {
    return function (req, res, next) {
      var result = processFunction(req, res, next);
      if (result === undefined) {
        return;
      }

      if (result instanceof Promise) {
        result.then(innerResult => {
          if (innerResult === undefined) {
            return;
          }
          resHelper(res, innerResult);
        }).catch(next);
      } else {
        resHelper(res, result);
      }
    }
  },

  handler: function (router) {
    router.use(function (_req, _res, _next) {
      throw new notfound("not_found", "Không tìm thấy api xử lý");
    });
    router.use(function (error, req, res, _next) {
      let result = error;

      if (!(result instanceof responseBase)) {
        logger(req.originalUrl)
        logger(result);
        if (process.env.NODE_ENV) {
          result = new generalerror()
        }
        else {
          result = new baseError("internal_server_error", result.toString(), 500);
        }
      }

      resHelper(res, result);
    });
  }
};