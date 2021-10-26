const Client = require("@replit/database");

const db = new Client(process.env.REPLIT_DB_URL);
const remap = {
  set: (key, value) => db.set(key, value),
  get: (key) => db.get(key),
  del: (key) => db.delete(key),
  list: (prefix = '') => db.list(prefix),
};
exports.getConnection = () => remap;

// async function unittest(){
//   await remap.set("___foo1","bar1");
//   await remap.set("___foo2","bar2");
//   console.log(await remap.list("___foo"));
//   await remap.del("___foo1");
//   console.log(await remap.list("___foo"));
//   await remap.del("___foo2");
//   console.log(await remap.list("___foo"));
// }

// unittest()