import NodeRSA from 'node-rsa';

var generateKeys = () => { 
    return new Promise((resolve, reject) => {
    try{
        const key = new NodeRSA({b: 1400},{format: 'string'},{browser: 'true'});
        const keys ={
            privKey: key.exportKey(['private']),
            pubKey: key.exportKey(['public'])
        }
        resolve(keys);
    }catch(err){
        reject(err);
    }
});

}

export default generateKeys;