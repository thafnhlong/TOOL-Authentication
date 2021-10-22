const baseError = require("./baseError");

module.exports = function notFound(code, message) {
  return baseError(code, message, 404);
}