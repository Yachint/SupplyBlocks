import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x557F46622Dfb3c5Ac33C5F0f19Cde7A2928Dcc3e'
);

export default instance;