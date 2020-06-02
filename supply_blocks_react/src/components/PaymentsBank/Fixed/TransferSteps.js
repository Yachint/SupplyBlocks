import React from 'react';
import { Steps } from 'antd';
import { connect } from 'react-redux';
import { 
    CloudUploadOutlined, 
    BlockOutlined, 
    BankOutlined,
    LoadingOutlined, 
    LockOutlined
} from '@ant-design/icons';

const { Step } = Steps;

const TransferSteps = (props) =>{

    const { steps } = props;
    const { isStarted, isScabBroadcast, isTransacting, isScabReciept, isFinished } = steps;

    const getStatus = (statusName) => {
        switch(statusName){
            case "isScabBroadcast":
                if(isScabBroadcast === false) return "wait";
                else if(isScabBroadcast === true && isTransacting === false) return "process";
                else return "finish";
            case "isTransacting":
                if(isTransacting === false) return "wait";
                else if(isTransacting === true && isScabReciept === false) return "process";
                else return "finish";
            case "isScabReciept":
                if(isScabReciept === false) return "wait";
                else if (isScabReciept === true && isFinished === false) return "process";
                else return "finish";
            default:
                return "wait";
        }
    }    

    return(<React.Fragment>
        {isStarted ? <Steps>
            <Step status={getStatus("isScabBroadcast")} title="Verify through SCAB" icon={
                getStatus("isScabBroadcast") === "process" ? <LoadingOutlined /> : <BlockOutlined />
            } />
            <Step status={getStatus("isTransacting")} title="Confirm Transaction" icon={
                getStatus("isTransacting") === "process" ? <LoadingOutlined /> : <LockOutlined />
            } />
            <Step status={getStatus("isScabReciept")} title="Generating Bank Log" icon={
                getStatus("isScabReciept") === "process" ? <LoadingOutlined /> : <BankOutlined />
            } />
        </Steps> : <div></div>}
        
    </React.Fragment>
        
    );
}

const mapStateToProps = (state) => {
    return { steps : state.transferSteps }
}

export default connect(mapStateToProps)(TransferSteps);