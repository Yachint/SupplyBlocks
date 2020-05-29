import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0xC3011D8a86a6Caa2329e336a49fE544766a652B3'
);

export default instance;