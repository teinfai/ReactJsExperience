// // utils/encryptDecrypt.js.js
import CryptoJS from "crypto-js";

class EncryptionUtility {
  constructor() {
    this.passphrase = "wevo0123";
  }

  wss_encrypt(message) {
    let pass = this.randomString(20);
    let pass1 = pass.substring(0, 4);
    let pass2 = pass.substring(4, 8);
    let pass3 = pass.substring(8, 12);
    let pass4 = pass.substring(12, 16);
    let pass5 = pass.substring(16, 20);
    var encrypted = CryptoJS.AES.encrypt(message, pass).toString();
    let encrypted_message = pass1 + pass3 + pass5 + encrypted + pass2 + pass4;
    // console.log('decript2: ', decrypted)
    return encrypted_message;
  }

  wss_decrypt(data) {
    let key1 = data.slice(0, 4);
    let key2 = data.slice(-8).slice(0, 4);
    let key3 = data.slice(4, 8);
    let key4 = data.slice(-8).slice(-4);
    let key5 = data.slice(8, 12);
    let passphrase = key1 + key2 + key3 + key4 + key5;
    let content = data.slice(12, -8);
    let decrypted = CryptoJS.AES.decrypt(content, passphrase);
    let data_arr = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

    return data_arr;
  }

  randomString(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Encrypt or decrypt based on the type parameter
  encrypt_decrypt = (type, string) => {
    if (!type || !string) {
      return "Insufficient argument";
    }
    if (type === "encrypt") {
      return this.wss_encrypt(string);
    } else if (type === "decrypt") {
      return this.wss_decrypt(string);
    } else {
      return "Invalid operation";
    }
  };
}

const instance = new EncryptionUtility();
export default instance;
