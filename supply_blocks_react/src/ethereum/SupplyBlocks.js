import web3 from './web3';
import accountJSON from './build/SupplyBlocks.json';

const instance = new web3.eth.Contract(
    JSON.parse(accountJSON.interface),
    '0x84708D7eF86A1d6564863d8463F71648ddf4F9a9'
);

export default instance;