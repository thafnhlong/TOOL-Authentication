const { getConnection } = require("../utils/database");

const userModel = {
  add: async function (value) {
    return getConnection().set(`users:${value.id}`, value);
  },
  getAll: async function () {
    const result = []
    const keys = await getConnection().list("users:");
    for (const key of keys) {
      const user = await getConnection().get(key);
      result.push(user);
    }
    return result;
  },
  delete: async function (id) {
    return getConnection().del(`users:${id}`);
  },
  update: async function (value) {
    return getConnection().set(`users:${value.id}`, value);
  }
};

module.exports = userModel;