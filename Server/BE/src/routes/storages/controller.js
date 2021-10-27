const { wrapper } = require("../../middlewares/wrapper");
const { encrypt, EncryptPassword } = require("../../utils/password");
const genQR = require("../../utils/qr");
const storagesService = require("../../services/storage");
const message = require("../../resouces/message.json");
const responseBase = require("../../models/responseBase");
const notFound = require("../../exceptions/notFound");

module.exports = {
  add: wrapper(async (req) => {
    let { title, description, encoded } = req.body;
    if (!title) {
      throw new responseBase("title_is_required", message.title_is_required);
    }
    if (!description) {
      description = "";
    }
    if (!encoded) {
      encoded = "";
    }
    const userid = req.authenMiddleware.id;
    await storagesService(userid).add({ title, description, encoded });
    return new responseBase("success", "Tạo mục lưu trữ mới thành công");
  }),

  compact: wrapper(async (req) => {
    const userid = req.authenMiddleware.id;
    const storagesReponse = await storagesService(userid).getAll();
    if (storagesReponse.length === 0) {
      throw new notFound("storages_not_found", message.storages_not_found);
    }
    return storagesReponse;
  }),

  checkIdValidationMiddleware: wrapper(async (req, _res, next) => {
    const { id } = req.params;
    if (id) {
      const userid = req.authenMiddleware.id;
      const storage = await storagesService(userid).getById(id);
      if (storage) {
        req.checkIdValidationMiddleware = storage;
        next();
        return;
      }
    }
    throw new notFound("storage_not_found", message.storage_not_found);
  }),

  get: wrapper(async (req) => {
    return req.checkIdValidationMiddleware;
  }),

  put: wrapper(async (req) => {
    let { title, description, encoded } = req.body;
    if (!title) {
      throw new responseBase("title_is_required", message.title_is_required);
    }
    if (!description) {
      description = "";
    }
    if (!encoded) {
      encoded = "";
    }
    const userid = req.authenMiddleware.id;
    const { id } = req.checkIdValidationMiddleware;
    await storagesService(userid).update({ id, title, description, encoded });
    return new responseBase("success", "Chỉnh sửa thông tin của mục lưu trữ thành công");
  }),

  delete: wrapper(async (req) => {
    const userid = req.authenMiddleware.id;
    const storageid = req.checkIdValidationMiddleware.id;
    await storagesService(userid).delete(storageid);
    return new responseBase("success", "Xóa mục lưu trữ thành công");
  }),

  qr: wrapper(async (req) => {
    const payload = req.checkIdValidationMiddleware;
    const obj = JSON.stringify(payload);
    const enc = encrypt(obj, EncryptPassword);
    const image = await genQR(enc);
    return { image };
  })
};