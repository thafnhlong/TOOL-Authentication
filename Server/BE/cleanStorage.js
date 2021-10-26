require('dotenv').config();

const { getConnection } = require('./src/utils/database');

// Xóa các storage của tài khoản không tồn tại (đã bị xóa)
async function cleanStorage() {
  console.log("Initial...");
  const db = getConnection();
  const users_key = await db.list("users:");
  const storages_key = await db.list("storages:");
  const userIds = users_key.map(x => x.split(":")[1]);

  console.log("Deleting...");
  promises = []
  for (const storage_key of storages_key) {
    const userid = storage_key.split(":")[1];
    if (!userIds.includes(userid)) {
      const removeJob = db.del(storage_key)
      promises.push(removeJob);
    }
  }
  Promise.all(promises).then(() => {
    console.log(`Deleted ${promises.length} items.`);
    console.log("Done.");
  }).catch(console.log)
}
cleanStorage();