const responseBase = require("../models/responseBase");

function baseError(code, message, status = 400) {
  responseBase.call(this, code, message, status);
}
baseError.prototype = Object.create(responseBase.prototype);

module.exports = baseError;