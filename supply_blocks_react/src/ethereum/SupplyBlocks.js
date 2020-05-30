import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x4c93C10E99AF80f376166ecF67BfA5C30D7e42c2'
);

export default instance;