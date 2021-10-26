const { wrapper } = require("../../middlewares/wrapper");
const tfaService = require('../../services/tfa');
const responseBase = require("../../models/responseBase");

module.exports = {
  get: wrapper(async () => {
    return await tfaService.get();
  }),

  put: wrapper(async (req) => {
    const { salt } = req.body;
    if (!salt)
      salt = "";
    await tfaService.update(`${salt}`);
    return new responseBase("success", "Thay đổi mã hóa của api thành công");
  })

};