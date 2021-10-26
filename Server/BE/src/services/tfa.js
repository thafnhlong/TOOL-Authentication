const tfaModel = require("../models/tfa");
const execute = require("../utils/lock");

const LOCK_CACHE_KEY = "tfaCache";
let cacheTfa = ""

let cached = false;
async function initCache() {
  if (!cached) {

    await execute(LOCK_CACHE_KEY, async () => {
      if (!cached) {
        cacheTfa = await tfaModel.get() || "";
        cached = true;
      }
    });
  }
}
async function refreshCache(type, value) {
  await execute(LOCK_CACHE_KEY, async () => {
    if (type == "update") {
      cacheTfa = value;
    }
    else {
      throw new Error("Invalid type");
    }
  });
}

const tfaService = {
  get: async function () {
    await initCache();
    return cacheTfa;
  },
  update: async function (value) {
    await initCache();
    await tfaModel.update(value);
    await refreshCache("update", value);
  },
  reloadCache: function () { cached = false; }
};

module.exports = tfaService;