import Warehouse from '../ethereum/Warehouse';
import SupplyBlocks from '../ethereum/SupplyBlocks';
import IPFS_Upload from '../apis/IPFS_Upload';
import IPFS_Download from '../apis/IPFS_Download';
import history from '../history';

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
            publicKey: await userWarehouse.methods.publicKey().call()
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

        const hash = await IPFS_Upload(AdditionalInfo);
        console.log("IPFS HASH : ",hash);
        console.log(formValues);
        await SupplyBlocks.methods.createAccount(
            formValues.orgName,
            formValues.description,
            hash,
            pubKey,
            privKey
        ).send({ from: userAddress });
        
        const address = await SupplyBlocks.methods.getContractAddress(userAddress).call();
        
        console.log("New Contract Address :",address);

        const userWarehouse = Warehouse(address);

        const contractDetails = {
            orgName: formValues.orgName,
            description: formValues.description,
            AdditionalInfoHash: hash,
            managerAddress: userAddress,
            mainContractAddress: await userWarehouse.methods.mainConAdd().call(),
            publicKey: pubKey
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