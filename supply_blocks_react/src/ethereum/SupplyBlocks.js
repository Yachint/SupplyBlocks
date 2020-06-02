import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x0F350B275A86499Acd1179e557835A687B4F7553'
);

export default instance;