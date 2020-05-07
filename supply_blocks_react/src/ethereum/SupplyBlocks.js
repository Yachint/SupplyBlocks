import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0xC50E472E98Ba0f056c90C6a2100093F2Db038E8f'
);

export default instance;