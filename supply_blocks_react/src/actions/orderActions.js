import Warehouse from '../ethereum/Warehouse';
import SupplyBlocks from '../ethereum/SupplyBlocks';
import ScabApi from '../apis/ScabApi';
import ScabJson from '../apis/ScabJson';
import AES_Encrypt from '../apis/AES_Encrypt';
import AES_Decrypt from '../apis/AES_Decrypt';
import AsymmEncrypt from '../apis/AsymEncrypt';
import web3 from '../ethereum/web3';
import PUBLIC_KEY from '../apis/ServerPubKey';

export const loadOrders = () => {
    return async (dispatch, getState) => {
        const { contractAddress } = getState().contract;
        const userWarehouse = Warehouse(contractAddress);
        const keyHash = await userWarehouse.methods.privKey().call();
        const key = await IPFS_Download(keyHash);

        const IpfsArray = await ScabJson.get('/inventory?prodId='+getState().contract.contractDetails.IpfsHash);
        const IpfsObj = IpfsArray.data[0];
        const Orders = AES_Decrypt(IpfsObj.Orders,key);


        dispatch({
            type: 'LOAD_ORDERS',
            payload: {
                inventory: Orders.orders,
                scabLedger: Orders.orderLedger
            }
        });
    }
}

export const UpdateOrder = (orderUpdates) => {
    return async (dispatch, getState) => {
        const existingOrders = getState().orderStore.orders;
        const newUpdates = _.differenceWith(orderUpdates,existingOrders,_.isEqual);
        console.log(newUpdates);
        dispatch({
            type: 'LOCAL_CHANGE',
            payload: {
                updates: inventoryUpdates,
                changed: newUpdates
            }
        });
    }
}

export const initiateOrderCloudSync = () => {
    return async (dispatch, getState) => {
        
        const { inventory, scabLedger } = getState().inventoryStore;
        // const { userAddress } = getState().auth;
        const { contractAddress, AdditionalInfo } = getState().contract;
        const { stats } = getState().wallet;


    }
}

const giveWalletUpdateObject = async (AdditionalInfo, inventory, scabLedger, stats, updateStash, userWarehouse) => {
    const keyHash = await userWarehouse.methods.privKey().call();
    const key = await IPFS_Download(keyHash);

    let moneyEarned = 0;
    updateStash.forEach(item => {
        moneyEarned += parseFloat(item.amount); 
    })

    const newStats = {...stats, 
        txNumber: parseInt(stats.txNumber)+ parseInt(updateStash.length),
        moneyEarned: moneyEarned,
        bankHistory: _.concat(stats.bankHistory , updateStash)
    }

    const data = {
        inventory: inventory,
        scabLedger: scabLedger
    };

    const encryptedAddInfo = AES_Encrypt(AdditionalInfo,key);
    const encryptedInvInfo = AES_Encrypt(data,key);
    const encryptedWalletInfo = AES_Encrypt(newStats,key);

    const batchIpfsObject = {
        AdditionalInfo: encryptedAddInfo,
        Inventory: encryptedInvInfo,
        stats: encryptedWalletInfo
    }
    console.log('BATCH :',batchIpfsObject);

    return batchIpfsObject;
}