import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x5De0004AB3E3709A99125e9604dC9E9d01C4a136'
);

export default instance;