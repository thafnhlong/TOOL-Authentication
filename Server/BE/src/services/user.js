const userModel = require("../models/user");
const execute = require("../utils/lock");
const { v4: uuidv4 } = require('uuid');

const LOCK_CACHE_KEY = "userCache";
const cacheUser = {}

let cached = false;
async function initCache() {
  if (!cached) {

    await execute(LOCK_CACHE_KEY, async () => {
      if (!cached) {
        const users = await userModel.getAll();
        for (const user of users) {
          cacheUser[user.id] = user;
        }
        cached = true;
      }
    });
  }
}
async function refreshCache(type, value) {
  await execute(LOCK_CACHE_KEY, async () => {
    if (type == "add") {
      cacheUser[value.id] = value;
    }
    else if (type == "delete") {
      delete cacheUser[value];
    }
    else if (type == "update") {
      cacheUser[value.id] = value;
    }
    else {
      throw new Error("Invalid type");
    }
  });
}

const userService = {
  getByUsername: async function (username) {
    await initCache();
    const result = Object.entries(cacheUser).find(([_id, value]) => value.username === username);
    if (result && result.length === 2) {
      return result[1];
    }
    return null;
  },
  getById: async function (id) {
    await initCache();
    return cacheUser[id];
  },
  add: async function (value) {
    await initCache();
    const newId = uuidv4();
    value.id = newId;
    await userModel.add(value);
    await refreshCache("add", value)
  },
  getAll: async function () {
    await initCache();
    return Object.entries(cacheUser).map(([_id, user]) =>
      ({ id: user.id, username: user.username, name: user.name })
    );
  },
  delete: async function (id) {
    await initCache();
    await userModel.delete(id);
    await refreshCache("delete", id);
  },
  update: async function (value) {
    await initCache();
    await userModel.update(value);
    await refreshCache("update", value);
  },
  reloadCache: function () { cached = false; }
};

module.exports = userService;