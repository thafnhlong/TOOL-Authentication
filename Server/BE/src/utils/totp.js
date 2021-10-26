const totp = require("totp-generator");
const hibase32 = require("hi-base32")

function generateSecretLogin(tfa, secret) {
  return hibase32.encode(`${tfa}.${secret}`);
}

function verifyOTP(otp, tfa, secret) {
  secretCalculate = generateSecretLogin(tfa, secret);
  return totp(secretCalculate) == otp;
}

module.exports = {
  generateSecretLogin,
  verifyOTP
};