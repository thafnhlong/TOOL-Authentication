var QRCode = require('qrcode')

async function genQR(str) {
  return QRCode.toDataURL(str)
}

module.exports = genQR;