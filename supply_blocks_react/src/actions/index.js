import Warehouse from '../ethereum/Warehouse';
import SupplyBlocks from '../ethereum/SupplyBlocks';
import IPFS_Upload from '../apis/IPFS_Upload';
import IPFS_Download from '../apis/IPFS_Download';
import history from '../history';
import ScabApi from '../apis/ScabApi';
import AES_Encrypt from '../apis/AES_Encrypt';
import AES_Decrypt from '../apis/AES_Decrypt';
import rp from 'request-promise';
import KeyGenerator from '../apis/KeyGenerator';
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
            AdditionalInfoHash: await userWarehouse.methods.AddInfoHash().call(),
            managerAddress: await userWarehouse.methods.manager().call(),
            mainContractAddress: await userWarehouse.methods.mainConAdd().call(),
            publicKey: await IPFS_Download(await userWarehouse.methods.publicKey().call()),
            inventoryHash: await userWarehouse.methods.inventoryHash().call()
        }

        
        const keyHash = await userWarehouse.methods.privateKey().call();
        const key = await IPFS_Download(keyHash);

        const AdditionalObj = AES_Decrypt(await IPFS_Download(contractDetails.AdditionalInfoHash),key);

        dispatch({
            type: 'CONTRACT_LOAD',
            payload: {
                contractAddress: conAddress,
                contractDetails: contractDetails,
                AdditionalInfo: AdditionalObj
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

        const keys = KeyGenerator();

        const {pubKey, privKey} = keys;
        console.log(pubKey);

        const AdditionalInfo = {
            name: formValues.name,
            designation: formValues.designation,
            companyAddress: formValues.companyAddress,
            warehouseAddress: formValues.warehouseAddress,
            productCategories: formValues.productCategories
        }

        const data = {
            inventory: [],
            scabLedger: []
        };

        dispatch({
            type: 'ENC'
        });

        console.log("Encryption Start");
        const hash = await IPFS_Upload(AES_Encrypt(AdditionalInfo,privKey));
        const invHash = await IPFS_Upload(AES_Encrypt(data,privKey));
        console.log("Encryption End");

        dispatch({
            type: 'UPLOAD'
        });

        console.log("IPFS Upload Start");
        const pubHash = await IPFS_Upload(pubKey);
        const privHash = await IPFS_Upload(privKey);
        console.log("IPFS Upload End");

        console.log("IPFS HASH : ",hash);
        dispatch({
            type: 'CREATE'
        });
        await SupplyBlocks.methods.createAccount(
            formValues.orgName,
            formValues.description,
            hash,
            pubHash,
            privHash,
            invHash
        ).send({ from: userAddress });
        
        const address = await SupplyBlocks.methods.getContractAddress(userAddress).call();
        
        console.log("New Contract Address :",address);
        
        const userWarehouse = Warehouse(address);
        // await userWarehouse.methods.setInventoryHash(invHash).send({
        //     from: userAddress
        // });

        const contractDetails = {
            orgName: formValues.orgName,
            description: formValues.description,
            AdditionalInfoHash: hash,
            managerAddress: userAddress,
            mainContractAddress: await userWarehouse.methods.mainConAdd().call(),
            publicKey: pubHash,
            inventoryHash: invHash
        }

        dispatch({
            type: 'CONTRACT_LOAD',
            payload: {
                contractAddress: address,
                contractDetails: contractDetails,
                AdditionalInfo: AdditionalInfo
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
        const keyHash = await userWarehouse.methods.privateKey().call();
        const key = await IPFS_Download(keyHash);
        
        const inventoryDetails = AES_Decrypt(await IPFS_Download(getState().contract.contractDetails.inventoryHash),key);

        dispatch({
            type: 'INV_LOAD',
            payload: {
                currentHash: getState().contract.contractDetails.inventoryHash,
                inventory: inventoryDetails.inventory,
                scabLedger: inventoryDetails.scabLedger
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

        const { inventory, scabLedger, changedState } = getState().inventoryStore;
        const { userAddress } = getState().auth;
        const { contractAddress } = getState().contract;

        const iterateState = _.values(changedState);
        const requestPromises = [];
        let response = {};

        iterateState.forEach((item) => {
            const requestOptions = {
                uri: "http://scab-blockchain.herokuapp.com/transaction/store/broadcast",
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
            response = await ScabApi.get('/mine');
            console.log(response.data['block']);

            const data = {
                inventory: inventory,
                scabLedger: _.concat(scabLedger, response.data['block'])
            };
            
            const userWarehouse = Warehouse(contractAddress);
            const keyHash = await userWarehouse.methods.privateKey().call();
            const key = await IPFS_Download(keyHash);
            const invHash = await IPFS_Upload(AES_Encrypt(data,key));

            await userWarehouse.methods.setInventoryHash(invHash).send({
                from: userAddress
            });

            dispatch({
                type: 'INV_UPDATE',
                payload:{
                    currentHash: invHash,
                    ledger: response.data['block']
                }
            });
        });
        
    }
}