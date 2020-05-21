import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x073A4d1960294b78abB79302c2Cd360b7c8aA008'
);

export default instance;