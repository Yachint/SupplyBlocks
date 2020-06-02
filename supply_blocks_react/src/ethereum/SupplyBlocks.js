import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0xc6b036E007a2336eeffbf8158f665154e909a98D'
);

export default instance;