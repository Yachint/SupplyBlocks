import rp  from 'request-promise';

export default (hash) => {
    const requestOptions = {
        uri: 'https://ipfs.infura.io/ipfs/'+hash,
        method: 'GET',
        json: true
    };

    return rp(requestOptions);
}