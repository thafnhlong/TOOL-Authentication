const { wrapper } = require("../../middlewares/wrapper");
const responseBase = require("../../models/responseBase")

module.exports = wrapper(() => {
  return new responseBase("sv_up", "Api is working.");
});