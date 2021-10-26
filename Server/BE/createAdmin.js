require('dotenv').config();

const tfaService = require('./src/services/tfa');
const userService = require('./src/services/user');
const { encrypt, EncryptPassword } = require('./src/utils/password');
const genQR = require('./src/utils/qr');
const randomstring = require('./src/utils/randomstring');
const { generateSecretLogin } = require('./src/utils/totp');

async function createAdmin() {
  console.log("Initial...");
  const id = +new Date() + '';
  const name = "Admin created by Tool";
  const username = id;
  const secret = randomstring();
  const isadmin = true;
  const newUser = { id, name, username, secret, isadmin };
  await userService.add(newUser);
  console.log("User created.")
  const tfa = await tfaService.get();
  const url = `${process.env.FE_URL}/${username}`;
  const obj = JSON.stringify({
    name,
    url,
    secretkey: generateSecretLogin(tfa, secret)
  });
  const enc = encrypt(obj, EncryptPassword);
  const image = await genQR(enc);
  console.log("QR created.")
  console.log({ image });
}
createAdmin();