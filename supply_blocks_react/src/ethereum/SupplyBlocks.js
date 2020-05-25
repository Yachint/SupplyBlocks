import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x02b8D696C1d2F39B8F21B0b491a5dA956fbeF625'
);

export default instance;