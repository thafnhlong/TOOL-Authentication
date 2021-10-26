const { getConnection } = require("../utils/database");

function storageModel(userid) {
  return {
    add: async function (value) {
      return getConnection().set(`storages:${userid}:${value.id}`, value);
    },
    getAll: async function () {
      const result = []
      const keys = await getConnection().list(`storages:${userid}:`);
      for (const key of keys) {
        const storage = await getConnection().get(key);
        result.push(storage);
      }
      return result;
    },
    delete: async function (id) {
      return getConnection().del(`storages:${userid}:${id}`);
    },
    update: async function (value) {
      return getConnection().set(`storages:${userid}:${value.id}`, value);
    }
  };
}

module.exports = storageModel;