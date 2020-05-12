const NodeRSA = require('node-rsa');

const KeyGenerator = () => {
    const key = new NodeRSA({b: 512},{format: 'string'},{browser: 'true'});
    return {
        privKey: key.exportKey(['private']),
        pubKey: key.exportKey(['public'])
    }
}


module.exports = KeyGenerator;
