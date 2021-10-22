const baseError = require("./baseError")

module.exports = function generalError() {
  return baseError("internal_server_error", "Có lỗi xảy ra trong quá trình xử lý, vui lòng thử lại!", 500);
}