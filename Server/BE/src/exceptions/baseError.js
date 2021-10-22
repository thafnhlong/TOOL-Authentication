module.exports = function baseError(code, message, status = 400) {
  return [{
    code,
    message
  }, status]
}