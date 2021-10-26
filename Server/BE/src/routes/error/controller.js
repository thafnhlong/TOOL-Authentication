const { wrapper } = require("../../middlewares/wrapper");
const baseError = require("../../exceptions/baseError");

exports.async1 = wrapper(async () => {
  throw new baseError("async_bug1", "async_bug1");
});
exports.async2 = wrapper(async () => {
  throw new Error("async_bug2")
});

exports.sync1 = wrapper(() => {
  throw new baseError("sync_bug1", "sync_bug1");
});
exports.sync2 = wrapper(() => {
  throw new Error("sync_bug2")
});