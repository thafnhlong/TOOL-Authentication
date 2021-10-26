module.exports = function responseBase(code, message, status = 200) {
  this.result = {
    code,
    message
  };
  this.status = status
}