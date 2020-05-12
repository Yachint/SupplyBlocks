import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x82D46F367911e6A81952359355606BDd663C0b09'
);

export default instance;