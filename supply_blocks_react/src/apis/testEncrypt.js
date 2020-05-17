const AES_Encrypt = require('./AES_Encrypt');
const AES_Decrypt = require('./AES_Decrypt');
const KeyGenerator = require('./KeyGenerator');

const keys = KeyGenerator();
console.log(keys);

const key = keys.privKey;

const info = {
    name: "YACHINT",
    id: "9988"
}

const encrypted = AES_Encrypt(info,key);
console.log("Encrypted text: ",encrypted);
const decrypted = AES_Decrypt(encrypted,key);
console.log('Decrypted Object :',decrypted);
