const { getConnection } = require("../utils/database");

const KEY = 'config:tfa'
const tfaModel = {
  get: async function () {
    return getConnection().get(KEY);
  },
  update: async function (value) {
    return getConnection().set(KEY, value);
  }
};

module.exports = tfaModel;