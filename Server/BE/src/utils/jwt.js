const util = require("util")
const jwt = require('jsonwebtoken');

const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

module.exports = {
  sign: async (data, secret, exp) => {
    return await sign(data, secret, { expiresIn: exp });
  },
  verify: async (token, secret) => {
    return await verify(token, secret).catch(err => {
      if (err instanceof jwt.TokenExpiredError) {
        return null;
      }
      throw err;
    });
  },
  decode: (token) => {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }
};