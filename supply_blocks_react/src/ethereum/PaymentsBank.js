import web3 from './web3';
import TPJSON from './build/ThirdParty.json';

export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(TPJSON.interface),
        address
    );
};