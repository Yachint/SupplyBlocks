import Warehouse from '../ethereum/Warehouse';
import SupplyBlocks from '../ethereum/SupplyBlocks';
import IPFS_Upload from '../apis/IPFS_Upload';
import IPFS_Download from '../apis/IPFS_Download';
import history from '../history';
import ScabApi from '../apis/ScabApi';
import ScabJson from '../apis/ScabJson';
import AES_Encrypt from '../apis/AES_Encrypt';
import AES_Decrypt from '../apis/AES_Decrypt';
import rp from 'request-promise';
// import KeyGenerator from '../apis/KeyGenerator';
import axios from 'axios';
import web3 from '../ethereum/web3';
import _ from 'lodash';

export const signIn = (userAdd) => {
    return {
        type: 'SIGN_IN',
        payload: {
            userAdd: userAdd
        }
    }
}

export const signOut = () => {
    return async (dispatch) => {
        dispatch({
            type: 'UNLOAD_WALLET'
        })
        dispatch({
            type: 'UNLOAD_ORDERS'
        })
        dispatch({
            type: 'RESET'
        });
        dispatch({
            type: 'SIGN_OUT'
        });
    }
}

export const loadContract = (conAddress) => {
    return async (dispatch) => {
        const userWarehouse = Warehouse(conAddress);

        const contractDetails = {
            orgName: await userWarehouse.methods.orgName().call(),
            description: await userWarehouse.methods.description().call(),
            IpfsHash: await userWarehouse.methods.IpfsHash().call(),
            managerAddress: await userWarehouse.methods.manager().call(),
            mainContractAddress: await userWarehouse.methods.mainConAdd().call()
        }

        const getBalance = await userWarehouse.methods.checkBalance().call()
        console.log('getBalance :',getBalance);
        const balance = parseFloat(web3.utils.fromWei(getBalance, 'ether'));
        console.log('balance:',balance);
        const keyHash = await userWarehouse.methods.privKey().call();
        const key = await IPFS_Download(keyHash);
        //console.log(typeof(key));
        // const IpfsObj = await IPFS_Download(contractDetails.IpfsHash);
        const IpfsArray = await ScabJson.get('/inventory?prodId='+contractDetails.IpfsHash);
        const IpfsObj = IpfsArray.data[0];
        console.log(IpfsObj);
        const stats = AES_Decrypt(IpfsObj.stats,key);
        const AdditionalInfo = AES_Decrypt(IpfsObj.AdditionalInfo, key);
        const Inventory = AES_Decrypt(IpfsObj.Inventory,key);
        const Orders = AES_Decrypt(IpfsObj.Orders,key);
        console.log(Orders);


        dispatch({
            type: 'LOAD_ORDERS',
            payload: {
                orders: Orders.orders,
                ledger: Orders.orderLedger
            }
        }); 

        dispatch({
            type: 'INV_LOAD',
            payload: {
                currentHash: contractDetails.IpfsHash,
                inventory: Inventory.inventory,
                scabLedger: Inventory.scabLedger
            }
        });

        dispatch({
            type: 'LOAD_WALLET',
            payload: {
                balance: balance,
                stats: stats
            }
        });

        dispatch({
            type: 'CONTRACT_LOAD',
            payload: {
                contractAddress: conAddress,
                contractDetails: contractDetails,
                AdditionalInfo: AdditionalInfo
            }
        });

        history.push('/');

    }
}

export const unloadContract = () => {
    return {
        type: 'CONTRACT_UNLOAD'
    }
}

export const deleteContract = () => {
    return async (dispatch, getState) => {
        const { userAddress } = getState().auth;

        await SupplyBlocks.methods.deactivateAccount(
            userAddress
        ).send({ from: userAddress });

        dispatch({
            type: 'CONTRACT_UNLOAD'
        });

        history.push('/');
    }
}

export const updateContract = (formValues) => {
    return async (dispatch, getState) => {
        const { userAddress } = getState().auth;
        const { contractAddress, contractDetails, AdditionalInfo } = getState().contract;
        const { inventory, scabLedger } = getState().inventoryStore;
        const { orders, orderLedger } = getState().orderStore;
        const { stats } = getState().wallet;

        dispatch({
            type: 'START'
        });

        const NewAdditionalInfo = {
            name: formValues.name,
            designation: formValues.designation,
            companyAddress: formValues.companyAddress,
            warehouseAddress: formValues.warehouseAddress,
            productCategories: formValues.productCategories,
            pubKey: AdditionalInfo.pubKey
        }

        const data = {
            inventory: inventory,        
            scabLedger: scabLedger
        };

        const mimicOrderStore = {
            orders: orders,
            orderLedger: orderLedger
        }

        const userWarehouse = Warehouse(contractAddress);
        const keyHash = await userWarehouse.methods.privKey().call();
        const key = await IPFS_Download(keyHash);

        dispatch({
            type: 'ENC'
        });

        const encryptedAddInfo = AES_Encrypt(NewAdditionalInfo,key);
        const encryptedInvInfo = AES_Encrypt(data,key);    
        const encryptedWalletInfo = AES_Encrypt(stats,key);
        const encryptedOrderInfo = AES_Encrypt(mimicOrderStore,key);        

        const batchIpfsObject = {
                AdditionalInfo: encryptedAddInfo,
                Inventory: encryptedInvInfo,
                stats: encryptedWalletInfo,
                Orders: encryptedOrderInfo
        }

        dispatch({
            type: 'UPLOAD'
        });
        
        const scabObj = {
            prodId: contractDetails.IpfsHash,
            changedState: {...batchIpfsObject}
        }
        // const hash = await IPFS_Upload(batchIpfsObject);
        await ScabApi.post('/transaction/inventory/broadcast',scabObj);
        const response = await ScabApi.get('/mine');
        console.log(response.data['block']);

        dispatch({
            type: 'CREATE'
        });

        await userWarehouse.methods.updateDetails(formValues.description, formValues.orgName).send({
            from: userAddress
        });


        const updatedContractDetails = {
            orgName: formValues.orgName,
            description: formValues.description,
            IpfsHash: contractDetails.IpfsHash,
            managerAddress: contractDetails.managerAddress,
            mainContractAddress: contractDetails.mainContractAddress,
        }

        dispatch({
            type: 'CONTRACT_LOAD',
            payload: {
                contractAddress: contractAddress,
                contractDetails: updatedContractDetails,
                AdditionalInfo: NewAdditionalInfo
            }
        });

        dispatch({
            type: 'FIN'
        });

        history.push('/');
    }
}

export const initializeContract = (formValues) => {
    return async (dispatch, getState) => {
        const { userAddress } = getState().auth;

        dispatch({
            type: 'START'
        });

        console.log("GENERATING KEYS");

        dispatch({
            type: 'GEN'
        });

        const keys = await ScabApi.get('/decrypt/generate');

        const {pubKey, privKey} = keys.data;
        console.log(pubKey);

        const AdditionalInfo = {
            name: formValues.name,
            designation: formValues.designation,
            companyAddress: formValues.companyAddress,
            warehouseAddress: formValues.warehouseAddress,
            productCategories: formValues.productCategories,
            pubKey: pubKey
        }

        const data = {
            inventory: [],
            scabLedger: []
        };

        const mimicOrderStore = {
            orders: [],
            orderLedger: []
        }
      

        const stats = {
            txNumber: 0,
            moneySpent: 0,
            moneyEarned: 0,
            bankHistory: []
        };

        dispatch({
            type: 'ENC'
        });

        console.log("Encryption Start");
        const encryptedAddInfo = AES_Encrypt(AdditionalInfo,privKey);
        const encryptedInvInfo = AES_Encrypt(data,privKey);
        const encryptedWalletInfo = AES_Encrypt(stats,privKey);
        const encryptedOrderInfo = AES_Encrypt(mimicOrderStore,privKey);  
        console.log("Encryption End");

        dispatch({
            type: 'UPLOAD'
        });

        const batchIpfsObject = {
            AdditionalInfo: encryptedAddInfo,
            Inventory: encryptedInvInfo,
            stats: encryptedWalletInfo,
            Orders: encryptedOrderInfo
        }

        const scabObj = {
            changedState: {...batchIpfsObject}
        }

        console.log("IPFS Upload Start");
        // const hash = await IPFS_Upload(batchIpfsObject);
        const dataResult = await ScabApi.post('/transaction/inventory/create',scabObj);
        console.log('------->',dataResult);
        const hash = dataResult.data.id;
        console.log('HASH SCAB :', hash);
        const response = await ScabApi.get('/mine');
        console.log(response.data['block']);

        const privHash = await IPFS_Upload(privKey);
        console.log("IPFS Upload End");

        dispatch({
            type: 'CREATE'
        });
        await SupplyBlocks.methods.createAccount(
            formValues.orgName,
            formValues.description,
            hash,
            privHash
        ).send({ from: userAddress });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        var address = await SupplyBlocks.methods.getContractAddress(userAddress).call();

        if(address === '0x0000000000000000000000000000000000000000'){
            address = await SupplyBlocks.methods.getRecentJoin().call();
        }
        
        console.log("New Contract Address :",address);
        const postBody = {
            typeOfStore: "seller",
            changedState: {
                smartContractAdd: address,
                name: formValues.orgName,
                description: {
                    additionalInfo: formValues.description
                },
                sellerSince: ''+(new Date()),
                pubKey: pubKey

                
            }
        }
        axios.post('https://scab-blockchain.herokuapp.com/transaction/store/broadcast',postBody).then(async () => {
            const response = await ScabApi.get('/mine');
            console.log(response.data['block']);
        })
        
        const userWarehouse = Warehouse(address);
        // await userWarehouse.methods.setInventoryHash(invHash).send({
        //     from: userAddress
        // });

        const contractDetails = {
            orgName: formValues.orgName,
            description: formValues.description,
            IpfsHash: hash,
            managerAddress: userAddress,
            mainContractAddress: await userWarehouse.methods.mainConAdd().call(),
        }

        dispatch({
            type: 'LOAD_WALLET',
            payload: {
                balance: 0,
                stats:{
                    txNumber: 0,
                    moneySpent: 0,
                    moneyEarned: 0,
                    bankHistory: []
                }
            }
        })

        dispatch({
            type: 'CONTRACT_LOAD',
            payload: {
                contractAddress: address,
                contractDetails: contractDetails,
                AdditionalInfo: AdditionalInfo
            }
        });

        dispatch({
            type: 'INV_LOAD',
            payload: {
                currentHash: hash,
                inventory: [],
                scabLedger: []
            }
        });

        dispatch({
            type: 'LOAD_ORDERS',
            payload: {
                orders: [],
                ledger: []
            }
        });

        dispatch({
            type: 'FIN'
        });

        // history.push('/');
    }
}


export const loadInventory = () => {
    return async (dispatch, getState) => {
        const { contractAddress } = getState().contract;
        const userWarehouse = Warehouse(contractAddress);
        const keyHash = await userWarehouse.methods.privKey().call();
        const key = await IPFS_Download(keyHash);

        const IpfsArray = await ScabJson.get('/inventory?prodId='+getState().contract.contractDetails.IpfsHash);
        const IpfsObj = IpfsArray.data[0];
        //const IpfsObj = await IPFS_Download(getState().contract.contractDetails.IpfsHash);
        const Inventory = AES_Decrypt(IpfsObj.Inventory,key);

        dispatch({
            type: 'INV_LOAD',
            payload: {
                currentHash: getState().contract.contractDetails.IpfsHash,
                inventory: Inventory.inventory,
                scabLedger: Inventory.scabLedger
            }
        });
    }
}

export const unloadInventory = () => {
    return {
        type: 'INV_UNLOAD'
    }
}

export const deleteItems = (updates, deleteThese) => {
    // console.log(deleteThese);
    return {
        type: 'LOCAL_DELETE',
        payload: {
            updates: updates,
            deleteThese: [deleteThese]
        }
    }
}

export const updateInventory = (inventoryUpdates) => {

    return async (dispatch, getState) => {
        const existingInv = getState().inventoryStore.inventory;
        const newUpdates = _.differenceWith(inventoryUpdates,existingInv,_.isEqual);
        console.log(newUpdates);
        dispatch({
            type: 'LOCAL_UPDATE',
            payload: {
                updates: inventoryUpdates,
                changed: newUpdates
            }
        });
    }
}

export const initiateInventorySave = () => {
    return async (dispatch, getState) => {

        dispatch({type: 'START'});
        const { inventory, scabLedger, changedState } = getState().inventoryStore;
        // const { userAddress } = getState().auth;
        const { contractAddress, AdditionalInfo } = getState().contract;
        const { stats } = getState().wallet;
        const { orders, orderLedger } = getState().orderStore;
        
        const iterateState = _.values(changedState);
        iterateState.forEach(p => p.seller = contractAddress);
        const requestPromises = [];
        // let response = {};
        dispatch({type: 'GEN'});
        iterateState.forEach((item) => {
            const requestOptions = {
                uri: "https://scab-blockchain.herokuapp.com/transaction/store/broadcast",
                method: 'POST',
                body: {
                    typeOfStore: "item",
                    changedState: item
                },
                json: true
            };

            requestPromises.push(rp(requestOptions));
        });

        Promise.all(requestPromises).then(async () => {
            
            console.log("All transactions posted to SCAB.");
            const response = await ScabApi.get('/mine');
            console.log(response.data['block']);

            const data = {
                inventory: inventory,
                scabLedger: _.concat(scabLedger, response.data['block'])
            };

            const mimicOrderStore = {
                orders: orders,
                orderLedger: orderLedger
            }
            // console.log("MIMIC ORDERS :", mimicOrderStore);

            dispatch({type: 'ENC'});
            const userWarehouse = Warehouse(contractAddress);
            const keyHash = await userWarehouse.methods.privKey().call();
            const key = await IPFS_Download(keyHash);

            const encryptedAddInfo = AES_Encrypt(AdditionalInfo,key);
            const encryptedInvInfo = AES_Encrypt(data,key); 
            const encryptedWalletInfo = AES_Encrypt(stats,key);
            const encryptedOrderInfo = AES_Encrypt(mimicOrderStore,key); 

            dispatch({type: 'UPLOAD'});
            const batchIpfsObject = {
                AdditionalInfo: encryptedAddInfo,
                Inventory: encryptedInvInfo,
                stats: encryptedWalletInfo,
                Orders: encryptedOrderInfo
            }
            
            dispatch({type: 'CREATE'});

            const scabObj = {
                prodId: getState().contract.contractDetails.IpfsHash,
                changedState: {...batchIpfsObject}
            }
    
            console.log("IPFS Upload Start");
            // const hash = await IPFS_Upload(batchIpfsObject);
            await ScabApi.post('/transaction/inventory/broadcast',scabObj);
            const responseSCAB = await ScabApi.get('/mine');
            console.log(responseSCAB.data);

            // const hash = await IPFS_Upload(batchIpfsObject);

            // await userWarehouse.methods.setIpfsHash(hash).send({
            //     from: userAddress
            // });
            dispatch({type: 'FIN'});
    
            dispatch({
                type: 'INV_UPDATE',
                payload:{
                    currentHash: getState().contract.contractDetails.IpfsHash,
                    ledger: response.data['block']
                }
            });
            // dispatch({type: 'RESET'});
        });
        
    }
}