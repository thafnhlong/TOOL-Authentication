const storagesModel = require("../models/storage");
const execute = require("../utils/lock");
const { v4: uuidv4 } = require('uuid');

const cached = {}
const cacheStorages = {}

function storagesService(userid) {
  const storageModel = storagesModel(userid);

  const LOCK_CACHE_KEY = "storageCache:" + userid;
  if (cached[userid] === undefined) {
    cached[userid] = false;
  }
  async function initCache() {
    if (!cached[userid]) {

      await execute(LOCK_CACHE_KEY, async () => {
        if (!cached[userid]) {
          const storages = await storageModel.getAll();
          cacheStorages[userid] = {};
          for (const storage of storages) {
            cacheStorages[userid][storage.id] = storage;
          }
          cached[userid] = true;
        }
      });
    }
  }

  async function refreshCache(type, value) {
    await execute(LOCK_CACHE_KEY, async () => {
      if (type == "add") {
        cacheStorages[userid][value.id] = value;
      }
      else if (type == "delete") {
        delete cacheStorages[userid][value];
      }
      else if (type == "update") {
        cacheStorages[userid][value.id] = value;
      }
      else {
        throw new Error("Invalid type");
      }
    });
  }

  const storageService = {
    add: async function (value) {
      await initCache();
      const newId = uuidv4();
      value.id = newId;
      await storageModel.add(value);
      await refreshCache("add", value)
    },
    getAll: async function () {
      await initCache();
      return Object.entries(cacheStorages[userid]).map(([_id, storage]) =>
        ({ id: storage.id, title: storage.title })
      );
    },
    getById: async function (id) {
      await initCache();
      return cacheStorages[userid][id];
    },
    update: async function (value) {
      await initCache();
      await storageModel.update(value);
      await refreshCache("update", value);
    },
    delete: async function (id) {
      await initCache();
      await storageModel.delete(id);
      await refreshCache("delete", id);
    },
    reloadCache: function () { cached[userid] = false; }
  }

  return storageService;
}

module.exports = storagesService;