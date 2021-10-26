const CryptoJS = require("crypto-js");

module.exports = {
  encrypt: function (password, salt) {
    return CryptoJS.AES.encrypt(password, salt).toString();
  },
  decrypt: function (password, salt) {
    try {
      return CryptoJS.AES.decrypt(password, salt).toString(CryptoJS.enc.Utf8);
    }
    catch { }
    return null;
  },
  EncryptPassword: "@NTLUS"
};