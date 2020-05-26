import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0xCF25881f5dEE9b8B9321E64e8e5ba2819e6b7c49'
);

export default instance;