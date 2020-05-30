import PaymentsBank from '../ethereum/PaymentsBank';
import SupplyBlocks from '../ethereum/SupplyBlocks';
import Warehouse from '../ethereum/Warehouse';
// import IPFS_Upload from '../apis/IPFS_Upload';
import IPFS_Download from '../apis/IPFS_Download';
import AES_Encrypt from '../apis/AES_Encrypt';
import AsymmEncrypt from '../apis/AsymEncrypt';
import ScabApi from '../apis/ScabApi';
import _ from 'lodash';
import web3 from '../ethereum/web3';
import PUBLIC_KEY from '../apis/ServerPubKey';
import axios from 'axios';
import rp from 'request-promise';

export const switchAllFalse = () =>{
    return {
        type: 'SWITCH_ALL_FALSE'
    }
}


export const transferOther = (formValues) => {
    return async (dispatch, getState) => {
        dispatch({ type: 'START_TRANSACTION'});

        const { userAddress } = getState().auth;
        const { contractAddress, AdditionalInfo } = getState().contract;
        const { stats, balance } = getState().wallet; 
        const { inventory, scabLedger } = getState().inventoryStore;

        const bankAddress = await SupplyBlocks.methods.PaymentsBankAddress().call();

        const userWarehouse = Warehouse(contractAddress);
        const secret = await userWarehouse.methods.accessSecret().call({
            from: userAddress
        });
        console.log('got secret');

        const newHistory = {
            timestamp: new Date().toGMTString(),
            from: formValues.seller,
            amount: parseInt(formValues.amount),
            action: 'pay'
        }
        console.log('uploading hash');
        const obj = await giveUploadableObject(AdditionalInfo, inventory, scabLedger, stats, newHistory, userWarehouse, formValues);
        console.log('obj recieved :',obj);
        //const hash = await IPFS_Upload(obj);
        const scabObj = {
            prodId: getState().contract.contractDetails.IpfsHash,
            changedState: {...obj}
        }

        await ScabApi.post('/transaction/inventory/broadcast',scabObj);
        const response = await ScabApi.get('/mine');
        console.log(response.data['block']);

        console.log('tx Starting');
        const Bank = PaymentsBank(bankAddress);
        await Bank.methods.initiateTransaction(
            contractAddress, 
            formValues.seller,
            web3.utils.toWei(formValues.amount, 'ether'),
            secret).send({
            from: userAddress
        });
        console.log('tx Complete');
        


        console.log('got secret, posting to scab');
        const responseSCAB = await exportToSCAB(formValues.seller, formValues.amount, contractAddress);
        console.log(responseSCAB);
        dispatch({
            type: 'UPDATE_BALANCE',
            payload: {
                balance: parseFloat(balance) - parseFloat(formValues.amount),
                stats: {...stats, 
                    txNumber: stats.txNumber+1,
                    moneySpent: parseFloat(stats.moneySpent)+parseFloat(formValues.amount),
                    bankHistory: _.concat(stats.bankHistory, newHistory)
                }
            }
        });

        dispatch({ type: 'COMPLETE_TRANSACTION'});

    }
}

export const transferSelf = (formValues) => {
    return async (dispatch, getState) => {
        dispatch({ type: 'START_TRANSACTION'});
        const { userAddress } = getState().auth;
        const { contractAddress, AdditionalInfo } = getState().contract;
        const { stats, balance } = getState().wallet; 
        const { inventory, scabLedger } = getState().inventoryStore;

        const bankAddress = await SupplyBlocks.methods.PaymentsBankAddress().call();
        const Bank = PaymentsBank(bankAddress);

        const newHistory = {
            timestamp: new Date().toGMTString(),
            from: 'Owner',
            amount: formValues.amount,
            action: 'get'
        }
        console.log('New History :',newHistory);
        const userWarehouse = Warehouse(contractAddress);
        const obj = await giveUploadableObject(AdditionalInfo, inventory, scabLedger, stats, newHistory, userWarehouse, formValues);
        
        const scabObj = {
            prodId: getState().contract.contractDetails.IpfsHash,
            changedState: {...obj}
        }

        await ScabApi.post('/transaction/inventory/broadcast',scabObj);
        const response = await ScabApi.get('/mine');
        console.log(response.data['block']);
        
        // const hash = await IPFS_Upload(obj);
        console.log('Scab done ');

        console.log('tx Starting');
        await Bank.methods.transferFunds(contractAddress).send({
            value: web3.utils.toWei(formValues.amount, 'ether'),
            from: userAddress
        });
        console.log('tx Complete');

        dispatch({
            type: 'UPDATE_BALANCE',
            payload: {
                balance: parseFloat(balance) + parseFloat(formValues.amount),
                stats: {...stats, 
                    txNumber: stats.txNumber+1,
                    bankHistory: _.concat(stats.bankHistory, newHistory)
                }
            }
        });

        dispatch({ type: 'COMPLETE_TRANSACTION'});

    }
}


export const fetchUpdatesSCAB = () => {
    return async (dispatch, getState) => {
        dispatch({ type: 'START_TRANSACTION'});
        const { contractAddress, AdditionalInfo } = getState().contract;
        const { stats } = getState().wallet; 
        const { inventory, scabLedger } = getState().inventoryStore;
        const userWarehouse = Warehouse(contractAddress);
        const keyHash = await userWarehouse.methods.privKey().call();
        //const key = await IPFS_Download(keyHash);
        //console.log('got Priv key');
        const response = await axios.get('https://json-server-scab.herokuapp.com/users?smartContractAdd='+contractAddress);
        console.log(response);
        console.log('No. of updates :',response.data.length);

        

        if(response.data.length !== 0){
            const updatesArray = response.data[0].updateHash;
            // const toUpdate = [];
            // updatesArray.forEach(item => {
            //     toUpdate.push(rp(IPFS_Download(item)))
            // })
            console.log('Fetching updates');
            
                console.log(updatesArray);
                const AsymmPromises = [];
                updatesArray.forEach(p => {
                    console.log('Creating async decryption block');
                    const requestOptions = {
                        uri: 'https://scab-blockchain.herokuapp.com/decrypt',
                        method: 'POST',
                        body: {
                            enc: p,
                            key: keyHash
                        },
                        json: true
                    };
                    AsymmPromises.push(rp(requestOptions));
                    // console.log(update);
                    // updateStash.push(JSON.parse(update));
                });
                Promise.all(AsymmPromises).then(async (data) => {

                    const updateStash = data.map(p => p.obj);
                    // console.log(updateStash);
                    // updateStash = _.concat(updateStash,data);
                    
                    console.log('UPDATE STASH', updateStash);

                    console.log('IPFS UPLOAD START');
                    const userWarehouse = Warehouse(contractAddress);
                    const obj = await giveWalletUpdateObject(AdditionalInfo,inventory,scabLedger,stats,updateStash,userWarehouse);
                    
                    const scabObj = {
                        prodId: getState().contract.contractDetails.IpfsHash,
                        changedState: {...obj}
                    }
            
                    await ScabApi.post('/transaction/inventory/broadcast',scabObj);
                    const response = await ScabApi.get('/mine');
                    console.log(response.data['block']);
                    
                    
                    // const hash = await IPFS_Upload(obj);
                    // console.log('IPFS Hash :',hash);

                    console.log('IPFS UPLOAD END');

                    // await userWarehouse.methods.setIpfsHash(hash).send({
                    //     from: userAddress
                    // });

                    let moneyEarned = parseFloat(stats.moneyEarned);
                    updateStash.forEach(item => {
                        moneyEarned += parseFloat(item.amount); 
                    });

                    const deleteUpdates = {
                        typeOfStore: "user",
                        changedState: {
                            smartContractAdd: contractAddress,
                            delete: "true"
                        }
                    }
                    axios.post('https://scab-blockchain.herokuapp.com/transaction/store/broadcast',deleteUpdates).then(() => {
                        ScabApi.get('/mine');
                    });

                    dispatch({
                        type: 'UPDATE_HISTORY',
                        payload: {
                            stats: {...stats, 
                                txNumber: parseInt(stats.txNumber)+parseInt(updateStash.length),
                                moneyEarned: moneyEarned,
                                bankHistory: _.concat(stats.bankHistory, updateStash)
                            }
                        }
                    });

                    dispatch({ type: 'COMPLETE_TRANSACTION'});
                    dispatch({ type: 'SWITCH_ALL_FALSE'});
                }).catch((err) => {
                    console.log(err);
                })
            
            
        } else {

            dispatch({ type: 'COMPLETE_TRANSACTION'});
            dispatch({ type: 'SWITCH_ALL_FALSE'});
        }

        
    }
}

export const deleteUpdatesSCAB = () => {
    return async (dispatch, getState) => {

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

const giveUploadableObject = async (AdditionalInfo, inventory, scabLedger, stats, newHistory, userWarehouse, formValues) => {
        const keyHash = await userWarehouse.methods.privKey().call();
        const key = await IPFS_Download(keyHash);

        let newStats;
        if(newHistory.action === 'get'){
            newStats = {...stats, 
                txNumber: stats.txNumber+1,
                bankHistory: _.concat(stats.bankHistory , newHistory)
            }
        } else {
            newStats = {...stats, 
                txNumber: stats.txNumber+1,
                moneySpent: parseFloat(stats.moneySpent)+ parseFloat(formValues.amount),
                bankHistory: _.concat(stats.bankHistory , newHistory)
            }
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

const exportToSCAB = async (contractAddress, amount, buyerAddress) => {
    const toGiveHistory = {
        timestamp: new Date().toGMTString(),
        from: buyerAddress,
        amount: amount,
        action: 'get'
    }
    console.log(toGiveHistory);
    console.log('encrypting scab info');
    const encryptedGive = await AsymmEncrypt(JSON.stringify(toGiveHistory),PUBLIC_KEY);
    // console.log('uploading scab data to ipfs...');
    // const objHash = await IPFS_Upload(encryptedGive);

    const templatePost = {
        typeOfStore: "user",
        changedState: {
            smartContractAdd: contractAddress,
            info: encryptedGive
        }
    };
    console.log('posting tx to scab');
    await axios.post('https://scab-blockchain.herokuapp.com/transaction/store/broadcast',templatePost);
    console.log('mining tx');
    const response = await ScabApi.get('/mine');
    return response.data;
}