const responseBase = require("../models/responseBase");

module.exports = function resHelper(res, result) {
  if (result instanceof responseBase) {
    res.status(result.status).json(result.result);
  } else {
    res.json(result);
  }
}