import CryptoJS from 'crypto-js'

export function encrypt(password, salt) {
    return CryptoJS.AES.encrypt(password, salt).toString();
}

export function decrypt(password, salt) {
    try {
        return CryptoJS.AES.decrypt(password, salt).toString(CryptoJS.enc.Utf8);
    }
    catch { }
    return null;
}

export const DecryptPassword = "@NTLUS";