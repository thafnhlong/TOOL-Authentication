const { wrapper } = require("../../middlewares/wrapper");
const { encrypt, EncryptPassword } = require("../../utils/password");
const { generateSecretLogin, verifyOTP } = require('../../utils/totp');
const { signAccessToken } = require("../../services/auth");
const randomstring = require("../../utils/randomstring");
const genQR = require("../../utils/qr");
const userService = require('../../services/user');
const tfaService = require('../../services/tfa');
const message = require("../../resouces/message.json");
const responseBase = require("../../models/responseBase");
const baseError = require("../../exceptions/baseError");
const notFound = require("../../exceptions/notfound");

module.exports = {
  login: wrapper(async (req) => {
    const { otp, username } = req.body;
    if (otp && username) {
      const user = await userService.getByUsername(username);
      if (user) {
        const tfa = await tfaService.get();
        if (verifyOTP(otp, tfa, user.secret)) {
          const access_token = await signAccessToken(user, tfa);
          return { access_token };
        }
      }
    }
    throw new baseError("login_fail", message.login_fail);
  }),

  get: wrapper(async () => {
    const userReponse = await userService.getAll();
    if (userReponse.length === 0) {
      throw new notFound("users_not_found", message.users_not_found);
    }
    return userReponse;
  }),

  add: wrapper(async (req) => {
    const body = req.body;
    const { name, username } = body;
    if (!name) {
      throw new responseBase("name_is_required", message.name_is_required);
    }
    if (!username) {
      throw new responseBase("username_is_required", message.username_is_required);
    }
    if (await userService.getByUsername(username)) {
      throw new responseBase("username_is_duplicated", message.username_is_duplicated);
    }
    body.secret = randomstring();
    await userService.add(body);
    return new responseBase("success", "Tạo tài khoản mới thành công");
  }),

  checkIdValidationMiddleware: wrapper(async (req, _res, next) => {
    const { id } = req.params;
    if (id) {
      const user = await userService.getById(id);
      if (user) {
        req.checkIdValidationMiddleware = user;
        next();
        return;
      }
    }
    throw new notFound("user_not_found", message.user_not_found);
  }),

  delete: wrapper(async (req) => {
    const { id } = req.checkIdValidationMiddleware;
    await userService.delete(id);
    return new responseBase("success", "Xóa tài khoản thành công");
  }),

  patch: wrapper(async (req) => {
    const user = req.checkIdValidationMiddleware;
    const { secret } = req.body;
    if (secret) {
      user.secret = randomstring();
      await userService.update(user)
      return new responseBase("success", "Làm mới tài khoản thành công");
    }
    return new responseBase("success", "Tài khoản không thay đổi");
  }),

  qr: wrapper(async (req) => {
    const { name, username, secret } = req.checkIdValidationMiddleware;
    const tfa = await tfaService.get();
    const url = `${process.env.FE_URL}/${username}`;
    const obj = JSON.stringify({
      name,
      url,
      secretkey: generateSecretLogin(tfa, secret)
    });
    const enc = encrypt(obj, EncryptPassword);
    const image = await genQR(enc);
    return { image };
  })
};