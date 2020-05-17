import React from 'react';
import { Steps } from 'antd';
import { connect } from 'react-redux';
import { 
    CloudUploadOutlined, 
    SolutionOutlined, 
    LoadingOutlined, 
    CheckCircleOutlined,
    LockOutlined
} from '@ant-design/icons';

const { Step } = Steps;

const ContractCreateSteps = (props) =>{

    const { steps } = props;
    const { isStarted, isEncrypting, isUploading, isCreating, isFinished } = steps;

    const getStatus = (statusName) => {
        switch(statusName){
            case "Encrypting Data":
                if(isEncrypting === false) return "wait";
                else if(isEncrypting === true && isUploading === false) return "process";
                else return "finish";
            case "Uploading to IPFS":
                if(isUploading === false) return "wait";
                else if (isUploading === true && isCreating === false) return "process";
                else return "finish";
            case "Creating Smart Contract":
                if(isCreating === false) return "wait";
                else if(isCreating === true && isFinished === false) return "process";
                else return "finish"
            case "Completed":
                if(isCreating === true && isFinished === false) return "wait";
                else if(isFinished === true) return "finish"
                else return "wait"
            default:
                return "wait";
        }
    }    

    return(<React.Fragment>
        {isStarted ? <Steps>
            <Step status={getStatus("Encrypting Data")} title="Encrypting Data" icon={
                getStatus("Generating Keys") === "process" ?  <LoadingOutlined /> : <LockOutlined /> 
            } />
            <Step status={getStatus("Uploading to IPFS")} title="Uploading to IPFS" icon={
                getStatus("Uploading to IPFS") === "process" ?  <LoadingOutlined /> : <CloudUploadOutlined />
            } />
            <Step status={getStatus("Creating Smart Contract")} title="Updating Smart Contract" icon={
                getStatus("Creating Smart Contract") === "process" ?  <LoadingOutlined /> : <SolutionOutlined />
            } />
            <Step status={getStatus("Completed")} title="Completed" icon={
                getStatus("Completed") === "process" ? <LoadingOutlined /> : <CheckCircleOutlined />
            } />
        </Steps> : <div></div>}
        
    </React.Fragment>
        
    );
}

const mapStateToProps = (state) => {
    return { steps : state.steps }
}

export default connect(mapStateToProps)(ContractCreateSteps);