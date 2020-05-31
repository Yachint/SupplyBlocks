import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0xc08e37Df77D58Cde752CF7C4174157a53C48FfeF'
);

export default instance;