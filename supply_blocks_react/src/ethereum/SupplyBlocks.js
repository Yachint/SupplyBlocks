import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x5C98f19A40ebc24166298E41ec5475b7CEf0C414'
);

export default instance;