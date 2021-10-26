const baseError = require("./baseError")

function generalError() {
  baseError.call(this, "internal_server_error", "Có lỗi xảy ra trong quá trình xử lý, vui lòng thử lại!", 500);
}
generalError.prototype = Object.create(baseError.prototype);

module.exports = generalError;