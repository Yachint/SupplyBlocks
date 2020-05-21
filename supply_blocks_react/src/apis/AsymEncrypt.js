import crypto from 'crypto';

var encrypt = (toEncrypt,relativeOrAbsolutePathToPublicKey) => {
    return new Promise((resolve, reject) => {
        try{
            var publicKey = relativeOrAbsolutePathToPublicKey
            var buffer = Buffer.from(toEncrypt);
            var encrypted = crypto.publicEncrypt(publicKey, buffer);
            resolve(encrypted.toString("base64"));
        } catch (err) {
            reject(err);
        }
    });
}  

export default encrypt;
// module.exports = encryptStringWithRsaPublicKey;