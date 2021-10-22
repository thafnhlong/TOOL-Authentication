module.exports = function responseBase(code, message, status = 200) {
  return [{
    code,
    message
  }, status]
}