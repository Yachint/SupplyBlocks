import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0xE0CDb499D2E355B2666e5359E3738222cF4d0e7A'
);

export default instance;