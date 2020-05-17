const ipfsApi = require('ipfs-api');
const rp = require('request-promise');

const uploadFile = async (obj) =>{
    const ipfs = ipfsApi('ipfs.infura.io', '5001', {protocol: 'https'});

    return new Promise((resolve, reject) => {
        //const reader = new FileReader();
        // reader.onloadend = () => {
        var string = JSON.stringify(obj);
        // }
        const buffer = Buffer.from(string);
            ipfs.add(buffer).then(files => {
                resolve(files);
            }).catch(error => reject(error))
        //reader.readAsArrayBuffer(file)
    });

}

const IPFS_Upload =  async (obj) => {
    const files = await uploadFile(obj);
    return files[0].hash;
}

const IPFS_Download = (hash) => {
    const requestOptions = {
        uri: 'https://ipfs.infura.io/ipfs/'+hash,
        method: 'GET',
        json: true
    };

    return rp(requestOptions);
}

const test = { prodId: "Test", name: "Test"};

const testFunctionality = async () => {
    const hash = await IPFS_Upload(test);
    console.log('Hash returned by IPFS :',hash);
    const downloadedObj = await IPFS_Download(hash);
    console.log('Downloaded Object through hash :', downloadedObj);
}

testFunctionality();