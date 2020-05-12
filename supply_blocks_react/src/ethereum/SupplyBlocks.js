import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x1C195Ba88be3AFA65B4C94153282eF47ed944b5C'
);

export default instance;