import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x21C5600480d0F319308F283b6b5Ecb116782378e'
);

export default instance;