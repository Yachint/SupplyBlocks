const crypto = require('crypto');

export default ()=>{
    var prime_length = 200;
    var diffHell = crypto.createDiffieHellman(prime_length);

    diffHell.generateKeys('base64');
    return{
        pubKey: diffHell.getPublicKey('base64'),
        privKey: diffHell.getPrivateKey('base64')
    }
    // console.log("Public Key : " ,);
    // console.log("Private Key : " ,);
}
