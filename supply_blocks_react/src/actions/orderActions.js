import Warehouse from '../ethereum/Warehouse';
// import SupplyBlocks from '../ethereum/SupplyBlocks';
import ScabApi from '../apis/ScabApi';
// import ScabJson from '../apis/ScabJson';
import IPFS_Upload from '../apis/IPFS_Upload';
import IPFS_Download from '../apis/IPFS_Download';
import AES_Encrypt from '../apis/AES_Encrypt';
// import AES_Decrypt from '../apis/AES_Decrypt';
import AsymmEncrypt from '../apis/AsymEncrypt';
import _ from 'lodash';
// import web3 from '../ethereum/web3';
import PUBLIC_KEY from '../apis/ServerPubKey';
import rp from 'request-promise';

export const resetStat = () => {
    return{
        type: 'RESET_STAT'
    }
}

export const loadOrders = (type) => {
    return async (dispatch, getState) => {
        dispatch({ type: 'STARTED_TX'});

        const { inventory, scabLedger } = getState().inventoryStore;
        const { contractAddress, AdditionalInfo } = getState().contract;
        const { stats } = getState().wallet;
        // const { orders, orderLedger } = getState().orderStore;

        const userWarehouse = Warehouse(contractAddress);
        const keyHash = await userWarehouse.methods.privKey().call();

        const postObject = {
            type: type,
            address: contractAddress
        }

        const response = await ScabApi.post('/query/orders',postObject);
        const ordersArray = response.data.result;

        const statusSet = [];

        ordersArray.forEach(p => statusSet.push(p.status));

        console.log('STATUS ARRAY :',statusSet);

        console.log(ordersArray);

        let typeAnno = 'forSeller';
        if(type === 'buyer') typeAnno = 'forBuyer'

        if(ordersArray.length !== 0){
            const AsymmPromises = [];
            ordersArray.forEach(p => {
                console.log('Creating async decryption block');
                const requestOptions = {
                    uri: 'https://scab-blockchain.herokuapp.com/decrypt/reverseDecrypt',
                    method: 'POST',
                    body: {
                        enc: p.updateHash[typeAnno],
                        key: keyHash
                    },
                    json: true
                };
                console.log(p.updateHash[typeAnno]);
                AsymmPromises.push(rp(requestOptions));
            });

            Promise.all(AsymmPromises).then( async (data) => {
                const properOrders = data.map(p => p.obj);
                properOrders.forEach(p => p.key = p.orderId);

                var i = 0;
                properOrders.forEach(p => p.status = statusSet[i++])
                

                console.log(properOrders);

                // const newlyChanged = _.differenceWith(properOrders,orders,_.isEqual);
                // console.log('---->',newlyChanged);

                dispatch({
                    type: 'LOAD_ORDERS',
                    payload: {
                        orders: properOrders,
                        ledger: []
                    }
                });

                const newOrders = properOrders;
                const newLedger = [];

                const obj = await giveWalletUpdateObject(AdditionalInfo,inventory,scabLedger,stats,newOrders,newLedger,userWarehouse);
                const scabObj = {
                    prodId: getState().contract.contractDetails.IpfsHash,
                    changedState: {...obj}
                }
                console.log('Starting SCAB BROADCAST: INVENTORY...');
                await ScabApi.post('/transaction/inventory/broadcast',scabObj);
                const response2 = await ScabApi.get('/mine');
                console.log(response2.data['block']);

                dispatch({ type: 'FINISHED_TX'});
            });
            
        } else {
            dispatch({ type: 'FINISHED_TX'});
        }

        
    }
}

export const updateOrdersLocal = (orderUpdates) => {
    return async (dispatch, getState) => {
        const existingOrders = getState().orderStore.orders;
        const newUpdates = _.differenceWith(orderUpdates,existingOrders,_.isEqual);
        console.log(newUpdates);
        dispatch({
            type: 'LOCAL_CHANGE',
            payload: {
                updates: orderUpdates,
                changed: newUpdates
            }
        });
    }
}

export const createNewOrder = (formValues) => {
    return async (dispatch, getState) => {
        const { inventory, scabLedger } = getState().inventoryStore;
        const { contractAddress, AdditionalInfo } = getState().contract;
        const { stats } = getState().wallet;
        const { orders, orderLedger } = getState().orderStore;
        const userWarehouse = Warehouse(contractAddress);
        dispatch({ type: 'STARTED_TX'});

        console.log('Starting IPFS UPLOAD..');
        const ipfsHash = await IPFS_Upload(JSON.stringify(formValues));
        console.log('Starting ASYMM ENCRYPT..');
        const encryptedOrder = await AsymmEncrypt(ipfsHash, PUBLIC_KEY);

        const modelPostObject = {
            typeOfStore: "order",
            changedState: {
            orderId: formValues.orderId,
            seller: formValues.seller,
            buyer: formValues.buyer,
            info : encryptedOrder,
            status: formValues.status
	        }
        }

        console.log('Starting SCAB BROADCAST: ORDER...');
        await ScabApi.post('/transaction/store/broadcast',modelPostObject);
        const response = await ScabApi.get('/mine');
        console.log(response.data);

        // const newOrders = _.concat(orders, formValues);
        // const newLedger = _.concat(orderLedger, response.data['block'])
        const obj = await giveWalletUpdateObject(AdditionalInfo,inventory,scabLedger,stats,orders,orderLedger,userWarehouse);
        const scabObj = {
            prodId: getState().contract.contractDetails.IpfsHash,
            changedState: {...obj}
        }
        console.log('Starting SCAB BROADCAST: INVENTORY...');
        await ScabApi.post('/transaction/inventory/broadcast',scabObj);
        const response2 = await ScabApi.get('/mine');
        console.log(response2.data['block']);

        // dispatch({
        //     type: 'REFRESH_ORDERS',
        //     payload: {
        //         orders: formValues,
        //         ledger: response.data['block']
        //     }
        // })
        
        dispatch({ type: 'FINISHED_TX'});
    }
}

export const updateOrdersCloud = () => {
    return async (dispatch, getState) => {
        dispatch({ type: 'STARTED_TX'});

        const { inventory, scabLedger } = getState().inventoryStore;
        const { contractAddress, AdditionalInfo } = getState().contract;
        const { stats } = getState().wallet;
        const { orders, orderLedger } = getState().orderStore;
        const userWarehouse = Warehouse(contractAddress);
        const { changedState } = getState().orderStore;


        const iterateState = _.values(changedState);
        const requestPromises = [];
        
        iterateState.forEach(item => {
            const requestOptions = {
                uri: "https://scab-blockchain.herokuapp.com/transaction/store/broadcast",
                method: 'POST',
                body: {
                    typeOfStore: "order",
                    changedState:{
                        orderId: item.orderId,
                        status: item.status
                    }
                },
                json: true
            };

            requestPromises.push(rp(requestOptions));
        });

        Promise.all(requestPromises).then(async () => {
            console.log("All order status updated with scab...");

            // const newLedger = _.concat(orderLedger, response.data['block'])
            const obj = await giveWalletUpdateObject(AdditionalInfo,inventory,scabLedger,stats,orders,orderLedger,userWarehouse);
            const scabObj = {
                prodId: getState().contract.contractDetails.IpfsHash,
                changedState: {...obj}
            }
            console.log('Starting SCAB BROADCAST: INVENTORY...');
            await ScabApi.post('/transaction/inventory/broadcast',scabObj);
            const response2 = await ScabApi.get('/mine');
            console.log(response2.data['block']);

            dispatch({ type: 'FINISHED_TX'});
        });

        
    }
}

const giveWalletUpdateObject = async (AdditionalInfo, inventory, scabLedger, stats, orders, orderLedger, userWarehouse) => {
    const keyHash = await userWarehouse.methods.privKey().call();
    const key = await IPFS_Download(keyHash);

    const data = {
        inventory: inventory,
        scabLedger: scabLedger
    };

    const mimicOrderStore = {
        orders: orders,
        orderLedger: orderLedger
    }

    const encryptedAddInfo = AES_Encrypt(AdditionalInfo,key);
    const encryptedInvInfo = AES_Encrypt(data,key);
    const encryptedWalletInfo = AES_Encrypt(stats,key);
    const encryptedOrderInfo = AES_Encrypt(mimicOrderStore,key);

    const batchIpfsObject = {
        AdditionalInfo: encryptedAddInfo,
        Inventory: encryptedInvInfo,
        stats: encryptedWalletInfo,
        Orders: encryptedOrderInfo
    }
    console.log('BATCH :',batchIpfsObject);

    return batchIpfsObject;
}