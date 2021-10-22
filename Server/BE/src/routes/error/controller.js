const baseError = require("../../exceptions/baseError");
const { wrapper } = require("../../middlewares/wrapper");

exports.async1 = wrapper(async () => {
  throw baseError("async_bug1", "async_bug1");
});
exports.async2 = wrapper(async () => {
  throw new Error("async_bug2")
});

exports.sync1 = wrapper(() => {
  throw baseError("sync_bug1", "sync_bug1");
});
exports.sync2 = wrapper(() => {
  throw new Error("sync_bug2")
});