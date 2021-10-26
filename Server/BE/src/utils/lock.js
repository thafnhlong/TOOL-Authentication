const AsyncLock = require('async-lock');
const lock = new AsyncLock();

/**
 * Xin khóa và thực thi hàm
 * @param {string} key Khóa phát lock
 * @param {function} fn Hàm **async**
 * @returns
 */
async function execute(key, fn) {
  return new Promise((res, rej) => {

    lock.acquire(key, function (done) {

      async function worker() {
        await fn().then(() => {
          done();
        }).catch(err => {
          done(err, null);
        })
      }
      worker();

    }, function (err, ret) {
      // lock released
      if (err) {
        rej(err);
      } else {
        res();
      }
    }, {});

  });
}

module.exports = execute;