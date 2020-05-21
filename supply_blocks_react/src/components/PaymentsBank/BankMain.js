import React, { useState, useEffect } from 'react';
import { PageHeader, Spin, Divider, Button, Result } from 'antd';
import history from '../../history';
import BankSideMenu from './Fixed/BankSideMenu';
import TransferForm from './Forms/TransferForm';
import SelfTransferForm from './Forms/SelfTransferForm';
import { connect } from 'react-redux';
import { transferOther, transferSelf, fetchUpdatesSCAB, switchAllFalse } from '../../actions/walletActions';
import TransactionHistory from './TransactionHistory';

const BankMain = (props) => {

    const [selectedView, setView] = useState('contract');
    const [isOperating, setOperating] = useState(false);
    const { isStarted, isCompleted, stats } = props.wallet;
    const { bankHistory } = stats;

    useEffect(() => {
        // console.log('isStarted :',isStarted);
        // console.log('isCompleted :',isCompleted);
        if( isStarted === false && isCompleted === true){
            setOperating(false);
            if(selectedView !== 'history'){
                setView('done');
            }
            
        }
    },[ isStarted, isCompleted, selectedView ]);

    const onMenuClick = (view) => {
        // console.log(view.key);
        if(view.key === '1') setView('contract');
        else if(view.key === '2') setView('self');
        else setView('history');
    }

    const { fetchUpdatesSCAB } = props;
    const handleRefresh = () =>{
        fetchUpdatesSCAB();
        setOperating(true);
    }

    const transferFundsSubmit = (formValues) => {
        console.log(formValues);
        props.transferOther(formValues);
        setOperating(true);
    }

    const selfFundsSubmit = (formValues) => {
        console.log(formValues);
        props.transferSelf(formValues);
        setOperating(true);
    }

    const renderView = () => {
        switch(selectedView){
            case 'contract' :
                return <div>
                    <Spin 
                    tip="Transfer in progress, please be patient..." 
                    spinning={isOperating}
                    style={{marginTop: '50px'}}>
                    {isOperating ? <div></div> : <React.Fragment>
                            <h2>Transfer Contract-to-Contract: </h2>
                            
                            <Divider />
                            <TransferForm onSubmit={transferFundsSubmit}/>
                        </React.Fragment>
                    }
                        
                    </Spin>
                </div>

            case 'self' :
                return <div>
                    <Spin 
                    tip="Transfer in progress, please be patient..." 
                    spinning={isOperating}
                    style={{marginTop: '50px'}}>
                    {isOperating ? <div></div> : <React.Fragment>
                            <h2>Transfer to this Contract: </h2>
                            
                            <Divider />
                            <SelfTransferForm onSubmit={selfFundsSubmit}/>
                        </React.Fragment>
                    }
                        
                    </Spin>
                </div>      
            case 'done' :
                return <Result
                        status="success"
                        title="Fund Transfer Successfull"
                        subTitle="Please check logs for further details"
                        extra={[
                         <Button type="primary" key="console" onClick={() => {
                             props.switchAllFalse();
                             setView('contract');
                             }} >
                         Ok
                        </Button>
                        ]}
                        /> 

            case 'history' :
                return <div>
                <Spin 
                tip="Fetching latest records, please be patient..." 
                spinning={isOperating}
                style={{marginTop: '50px'}}>
                {isOperating ? <div></div> : <React.Fragment>
                        <h2>Transfer History: </h2>
                        
                        <Divider />
                        <TransactionHistory 
                        handleRefresh={handleRefresh} 
                        bankHistory={bankHistory}
                        />
                    </React.Fragment>
                }
                    
                </Spin>
            </div>     

            default:
                return <div>
                    Welcome to Payments Bank
                </div>

        }
    }

    return(
        <div className="space-align-container">
            <div className="space-align-block">
                <PageHeader
                className="site-PaymentsBank"
                onBack={() => {history.push('/')}}
                title="Payments Bank"
                />
                <BankSideMenu onMenuClick={onMenuClick}/>
            </div>
            <div className="space-align-side">
                {renderView()}
            </div>
        </div>
        
    );
};

const mapStateToProps = (state) => {
    return { wallet: state.wallet }
}

export default connect(mapStateToProps, {
    transferOther: transferOther,
    transferSelf: transferSelf,
    fetchUpdatesSCAB: fetchUpdatesSCAB,
    switchAllFalse: switchAllFalse
})(BankMain); 