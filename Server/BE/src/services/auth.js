const { sign, verify } = require("../utils/jwt");

async function signAccessToken(user, tfa) {
  const { id, secret } = user;
  const body = {
    id, secret
  };
  if (user.isadmin) {
    body.isadmin = true;
  }
  const salt = process.env.AUTH_KEY;
  const expired = process.env.AUTH_TIME_EXPIRED;
  return sign(body, `${salt}.${tfa}.${secret}`, expired);
}

async function verifyAccessToken(token, secret, tfa) {
  const salt = process.env.AUTH_KEY;
  return await verify(token, `${salt}.${tfa}.${secret}`);
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};