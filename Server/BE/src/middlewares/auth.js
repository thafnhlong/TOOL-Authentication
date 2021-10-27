const tfaService = require('../services/tfa');
const userService = require('../services/user');
const { verifyAccessToken } = require('../services/auth');
const { decode } = require('../utils/jwt');
const { wrapper } = require('./wrapper');
const baseError = require('../exceptions/baseError');

function throw401() {
  throw new baseError("unauthorized", "Thông tin đăng nhập không hợp lệ", 401);
}

const authenMiddleware = wrapper(async (req, _res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw401();
  }
  // "Bearer " 7th characters
  const accessToken = authorization.substring(7);
  if (!accessToken) {
    throw401();
  }
  const payload = decode(accessToken);
  if (!payload) {
    throw401();
  }
  const originUser = await userService.getById(payload.id);
  if (originUser && payload.id === originUser.id && payload.secret === originUser.secret
    && payload.isadmin === originUser.isadmin) {
    const tfa = await tfaService.get();
    const verifyUser = await verifyAccessToken(accessToken, originUser.secret, tfa);
    if (verifyUser) {
      req.authenMiddleware = originUser;
      next();
      return;
    }
    throw new baseError("session_expired", "Phiên đã hết hạn, vui lòng đăng nhập lại", 401);
  }
  throw401();
});

const authorMiddleware = [
  authenMiddleware,

  wrapper(async (req, _res, next) => {
    // Chỉ có admin role
    if (req.authenMiddleware.isadmin) {
      next();
      return;
    }
    throw new baseError("forbidden", "Chưa được cấp quyền để thực hiện yêu cầu này", 403);
  })
];

module.exports = {
  authenMiddleware,
  authorMiddleware
};