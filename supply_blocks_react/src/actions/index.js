import Warehouse from '../ethereum/Warehouse';
import SupplyBlocks from '../ethereum/SupplyBlocks';
import IPFS_Upload from '../apis/IPFS_Upload';
import IPFS_Download from '../apis/IPFS_Download';
import history from '../history';
import ScabApi from '../apis/ScabApi';
import rp from 'request-promise';
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
    return{
        type: 'SIGN_OUT'
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
            publicKey: await userWarehouse.methods.publicKey().call(),
            inventoryHash: await userWarehouse.methods.inventoryHash().call()
        }

        const AdditionalObj = await IPFS_Download(contractDetails.AdditionalInfoHash);

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

export const initializeContract = (formValues, pubKey, privKey) => {
    return async (dispatch, getState) => {
        const { userAddress } = getState().auth;

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

        const hash = await IPFS_Upload(AdditionalInfo);
        const invHash = await IPFS_Upload(data);
        console.log("IPFS HASH : ",hash);
        console.log(formValues);
        await SupplyBlocks.methods.createAccount(
            formValues.orgName,
            formValues.description,
            hash,
            pubKey,
            privKey,
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
            publicKey: pubKey,
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

        history.push('/');
    }
}

export const loadInventory = () => {
    return async (dispatch, getState) => {
        const inventoryDetails = await IPFS_Download(getState().contract.contractDetails.inventoryHash);

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

            const invHash = await IPFS_Upload(data);

            const userWarehouse = Warehouse(contractAddress);
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