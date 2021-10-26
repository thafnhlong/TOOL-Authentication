const baseError = require("./baseError")

function notFound(code, message) {
  baseError.call(this, code, message, 404);
}
notFound.prototype = Object.create(baseError.prototype);

module.exports = notFound;