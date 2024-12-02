const CryptoJS = require("crypto-js");

// Clave de ejemplo (debe ser de 256 bits para AES)
const SECRET_KEY = CryptoJS.enc.Hex.parse("0123456789ABCDEF0123456789ABCDEF");

// Función para cifrar texto
const encryptText = (plainText) => {
    const encrypted = CryptoJS.AES.encrypt(plainText, SECRET_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
};

// Función para descifrar texto
const decryptText = (cipherText) => {
    const decrypted = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptText, decryptText };