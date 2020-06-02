import React, { useState, useEffect } from 'react';
import { Button, Spin, PageHeader } from 'antd';
import OrdersSideMenu from './Fixed/OrdersSideMenu';
import { 
    updateOrdersCloud, 
    updateOrdersLocal, 
    loadOrders,
    resetStat
} from '../../actions/orderActions';
import SellerControlPanel from './SellerControlPanel';
import { connect } from 'react-redux';
import history from '../../history';
import BuyerViewPanel from './BuyerViewPanel';
import _ from 'lodash';

const Orders = (props) => {

    const [selectedView, setView] = useState('buyer');
    const [isLoaded, setLoaded] = useState(false);
    const { isStarted, isDone } = props;

    useEffect(() => {
        if(isStarted && isDone){
            setLoaded(false)
        }
    },[isStarted, isDone])

    const onMenuClick = (view) => {
        // console.log(view.key);
        if(view.key === '1') setView('buyer');
        else if(view.key === '2') setView('seller');
    }

    const renderView = () =>{
        switch(selectedView){
            case 'buyer':
                return(<Spin spinning={isLoaded} tip="Updating your order details, Just a second...">
                
                    <BuyerViewPanel 
                    data={_.dropWhile(props.orders, function(o) { return o.seller === props.contractAddress })}
                    handleRefresh={handleRefreshBuyer}
                    />
                 </Spin>);
            case 'seller':
                return(<Spin spinning={isLoaded} tip="Updating your order details, Just a second...">
                
                    <SellerControlPanel 
                    reduxData={_.dropWhile(props.orders, function(o) { return o.buyer === props.contractAddress })}
                    reduxSetData={setData}
                    handleRefresh={handleRefresh}
                    />
                    <Button type="primary" loading={isLoaded} onClick={() => saveData()}>
                    Apply Changes
                    </Button>
                 </Spin>);
            default:
                return <div>Welcome to Order Management</div>
        }
    }

    const setData = (data) => {
        props.updateOrdersLocal(data);
    }

    const saveData =() => {
        props.resetStat();
        setLoaded(true);
        props.updateOrdersCloud();
    }

    const handleRefresh = () => {
        // console.log('called');
        props.resetStat();
        setLoaded(true);
        props.loadOrders('seller');
    }

    const handleRefreshBuyer = () => {
        props.resetStat();
        setLoaded(true);
        props.loadOrders('buyer');
    }

    return(
        <div className="space-align-container">
        {console.log('STATE :',isLoaded)}
            <div className="space-align-block">
                <PageHeader
                className="site-Orders"
                onBack={() => {history.push('/')}}
                title="Your Orders"
                />
                <OrdersSideMenu onMenuClick={onMenuClick}/>
            </div>
            <div className="space-align-side">
                {renderView()}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return { 
        orders: state.orderStore.orders,
        isStarted: state.orderStore.isStarted,
        isDone: state.orderStore.isDone,
        contractAddress: state.contract.contractAddress
    }
}

export default connect(mapStateToProps,{
    updateOrdersCloud: updateOrdersCloud,
    updateOrdersLocal: updateOrdersLocal,
    loadOrders: loadOrders,
    resetStat: resetStat 
})(Orders);