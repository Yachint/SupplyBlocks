import React,{ useEffect, useState } from 'react';
import Inventory from './Inventory';
import { Spin, notification} from 'antd';
import { Link } from 'react-router-dom';
import { Empty, Button, PageHeader } from 'antd';
import { connect } from 'react-redux';
import InventoryLogs from './InventoryLogs';
import history from '../../history';
import InventorySteps from './Fixed/InventorySteps';
import _ from 'lodash';
import './InventoryPage.css';
import InventorySideMenu from './Fixed/InventorySideMenu';
import { 
    loadInventory,
    updateInventory,
    initiateInventorySave,
    deleteItems } 
from '../../actions';

const InventoryPage = (props) => {

    const { 
        isLoaded, 
        currentHash, 
        inventory, 
        mainContractAddress, 
        loadInventory,
        changedState } = props;

    const [selectedView, setView] = useState('manage');
    const [submitLoader, setSubmitLoader] = useState({
        isLoading: false,
        loadingAddress: currentHash
    })

    useEffect(() => {
        if(isLoaded === false && mainContractAddress !== null){
            loadInventory();
        }
        if(currentHash !== submitLoader.loadingAddress 
            && submitLoader.isLoading === true && _.isEmpty(changedState)){
            setSubmitLoader({
                isLoading: false,
                loadingAddress: currentHash
            });
            openNotification();
        }
        //console.log(isLoaded);
    },[isLoaded, 
        mainContractAddress, 
        loadInventory, 
        currentHash, 
        submitLoader.loadingAddress, 
        submitLoader.isLoading,
        changedState]);

    const setData = (data) => {
        props.updateInventory(data);
    }

    const onMenuClick = (view) => {
        // console.log(view.key);
        if(view.key === '1') setView('manage');
        else if(view.key === '2') setView('view');
    }

    const deleteData = (updates, deleteThese) => {
        props.deleteItems(updates,deleteThese);
    }

    const saveData = () => {
        setSubmitLoader({
            isLoading: true
        })
        props.initiateInventorySave();
    }

    const openNotification = () => {
        notification.open({
          message: 'Inventory Successfully Synced with Blockchain',
          description:
            'Your Inventory changes have been verified by SCAB_blockchain Framework. Check Log for more details',
          onClick: () => {
            notification.close();
          },
        });
    };
    
    const renderData = () => {
        if(mainContractAddress !== null){
            if(selectedView === 'manage'){
                return(<Spin spinning={!isLoaded} tip="Fetching your inventory details, Just a second...">
                
                    <Inventory 
                    reduxData={inventory}
                    reduxSetData={setData}
                    reduxDelete={deleteData}
                    />
                    <Button type="primary" loading={submitLoader.isLoading} onClick={() => saveData()}>
                    Apply Changes
                    </Button>
                 </Spin>);
            }
            else{
                return(
                    <Spin spinning={!isLoaded} tip="Fetching your inventory details, Just a second...">
                        <InventoryLogs data={props.scabLedger}/>
                    </Spin>
                );
            }
        } else{
            return(
                <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{
                    height: 60,
                    }}
                    description={
                    <span>
                        No Inventory Associated with this Address, Maybe create a Warehouse first?
                    </span>
                    }
                    >
                    <Button type="primary">
                        <Link to="/User/NewContract">Create Now</Link>
                    </Button>
                </Empty>
            );
        }
        
        
    }

    return(
        <div className="space-align-container">
            <InventorySteps />
            <div className="space-align-block">
                <PageHeader
                className="site-Inventory"
                onBack={() => {history.push('/')}}
                title="Inventory"
                />
                <InventorySideMenu onMenuClick={onMenuClick}/>
            </div>
            <div className="space-align-side">
                {renderData()}
            </div>
        </div>
        // renderData()
    );
    
    
}

const mapStateToProps = (state) => {
    return { 
        isLoaded : state.inventoryStore.isLoaded,
        currentHash : state.inventoryStore.currentHash,
        inventory: state.inventoryStore.inventory,
        isSignedIn: state.auth.isSignedIn,
        mainContractAddress: state.contract.contractDetails.mainContractAddress,
        changedState: state.inventoryStore.changedState,
        scabLedger: state.inventoryStore.scabLedger
        
    }
}

export default connect(mapStateToProps,{
    loadInventory: loadInventory,
    updateInventory: updateInventory,
    initiateInventorySave: initiateInventorySave,
    deleteItems: deleteItems
})(InventoryPage);