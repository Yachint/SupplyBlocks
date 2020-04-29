import web3 from './web3';
import WarehouseJSON from './build/Warehouse.json';

export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(WarehouseJSON.interface),
        address
    );
};