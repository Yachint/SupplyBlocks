import React, { useState, useEffect } from 'react';
import { Spin, Divider, Button, Result, notification } from 'antd';
import { connect } from 'react-redux';
import { transferOther, switchAllFalse } from '../../../actions/walletActions';
import { createNewOrder, resetStat } from '../../../actions/orderActions';
import TransferForm from '../../PaymentsBank/Forms/TransferForm';
import PayForOrderSteps from './PayForOrderSteps';

const CreateOrder = (props) => {

    const { item, wallet, resetStat, orderStore, switchAllFalse, createNewOrder} = props;
    const { isDone } = orderStore;
    const { isCompleted, balance } = wallet;

    useEffect(() => {
        if(isCompleted && !isDone){
            createNewOrder(item);
        }
        if(isCompleted && isDone){
            setOperating(false);
        }
    }, [isCompleted, isDone, createNewOrder, item]);

    const [isOperating, setOperating] = useState(false);

    const initialValues = {
        seller: item.seller,
        amount: (item.toBuyPrice/219).toFixed(2)
    }

    const transferFundsSubmit = (formValues) => {
        switchAllFalse()
        resetStat();
        console.log(formValues);
        if(parseFloat(formValues.amount) > parseFloat(balance)){
            openNotification();
        }else {
            props.transferOther(formValues, 'yes');
            setOperating(true);
        }
        
    }

    const openNotification = () => {
        notification.open({
          message: 'Insufficient Balance',
          description:
            'Please check your Balance in Dashboard before proceeding with the transaction',
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
    };

    return(
        <div>
            <PayForOrderSteps />
            <Spin 
            tip="Transfer in progress, please be patient..." 
            spinning={isOperating}
            style={{marginTop: '50px'}}>
            {isCompleted && isDone ? <Result
              status="success"
              title="Order Payment Successfull"
              subTitle="Please check Orders Page for further details"
              extra={[
               <Button type="primary" key="console" onClick={() => {
                   switchAllFalse();
                   resetStat();
                   }} >
               Ok
              </Button>
              ]}
              /> : <React.Fragment>
                    
                    <h2>Pay for Order using Ethereum: </h2>
                    
                    <Divider />
                    <TransferForm onSubmit={transferFundsSubmit} initialValues={initialValues}/>

            </React.Fragment>}
                
            </Spin>
        </div>
    );
}

const mapStateToProps = (state) => {
    return { 
        wallet: state.wallet,
        orderStore: state.orderStore
    }
}


export default connect(mapStateToProps, {
    transferOther: transferOther,
    switchAllFalse: switchAllFalse,
    resetStat: resetStat,
    createNewOrder: createNewOrder
})(CreateOrder);