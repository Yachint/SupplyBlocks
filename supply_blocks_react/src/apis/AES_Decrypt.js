const NodeRSA = require('node-rsa');

function decrypt(info,Privkey) {
    //console.log(Privkey);
    const key = new NodeRSA(Privkey);
    return JSON.parse(key.decrypt(info, 'utf8'));
}

module.exports = decrypt;

// Nodejs encryption with CTR
// const crypto = require('crypto');
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);
// console.log(key.toString());

// function encrypt(text) {
//  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
//  let encrypted = cipher.update(text);
//  encrypted = Buffer.concat([encrypted, cipher.final()]);
//  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
// }

// function decrypt(text) {
//  let iv = Buffer.from(text.iv, 'hex');
//  let encryptedText = Buffer.from(text.encryptedData, 'hex');
//  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
//  let decrypted = decipher.update(encryptedText);
//  decrypted = Buffer.concat([decrypted, decipher.final()]);
//  return decrypted.toString();
// }

// var hw = encrypt("Some serious stuff")
// console.log(hw)
// console.log(decrypt(hw))
