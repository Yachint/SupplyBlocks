const NodeRSA = require('node-rsa');

function encrypt(info,Privkey) {
    const key = new NodeRSA(Privkey);
    return key.encrypt(info,'base64');
}

module.exports = encrypt;

//    const obj = {name :"hello", prodId: "hi"};
//    keys();
//    var hw = encrypt(JSON.stringify(obj));
//    console.log(hw)
//    const decrypted = decrypt(hw);
//    const toObj = JSON.parse(decrypted);
//    console.log(typeof(toObj));
//    console.log(toObj);