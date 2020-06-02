import React from 'react';
import { Steps } from 'antd';
import { connect } from 'react-redux';
import { 
    SolutionOutlined,
    BlockOutlined, 
    BankOutlined,
    LoadingOutlined, 
    CloudUploadOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';

const { Step } = Steps;

const PayForOrderSteps = (props) =>{

    const { steps } = props;
    const { isStarted, isScabBroadcast, isTransacting,isScabReciept, isIpfsUpload, isCreatingOrder, isFinished } = steps;

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
                else if (isScabReciept === true && isIpfsUpload === false) return "process";
                else return "finish";
            case "isIpfsUpload":
                if(isIpfsUpload === false) return "wait";
                else if (isIpfsUpload === true && isCreatingOrder === false) return "process";
                else return "finish";
            case "isCreatingOrder":
                if(isCreatingOrder === false) return "wait";
                else if (isCreatingOrder === true && isFinished === false) return "process";
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
                getStatus("isTransacting") === "process" ? <LoadingOutlined /> : <SolutionOutlined />
            } />
            <Step status={getStatus("isScabReciept")} title="Generating Bank Log" icon={
                getStatus("isScabReciept") === "process" ? <LoadingOutlined /> : <BankOutlined />
            } />
            <Step status={getStatus("isIpfsUpload")} title="Uploading to IPFS" icon={
                getStatus("isIpfsUpload") === "process" ? <LoadingOutlined /> : <CloudUploadOutlined />
            } />
            <Step status={getStatus("isCreatingOrder")} title="Finalizing your order" icon={
                getStatus("isCreatingOrder") === "process" ? <LoadingOutlined /> : <ShoppingCartOutlined />
            } />
        </Steps> : <div></div>}
        
    </React.Fragment>
        
    );
}

const mapStateToProps = (state) => {
    return { steps : state.transferSteps }
}

export default connect(mapStateToProps)(PayForOrderSteps);