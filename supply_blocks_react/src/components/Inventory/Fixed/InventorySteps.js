import React from 'react';
import { Steps } from 'antd';
import { connect } from 'react-redux';
import { 
    CloudUploadOutlined, 
    BlockOutlined, 
    SolutionOutlined, 
    LoadingOutlined, 
    LockOutlined
} from '@ant-design/icons';

const { Step } = Steps;

const InventorySteps = (props) =>{

    const { steps } = props;
    const { isStarted, isGenerating, isEncrypting, isUploading, isCreating, isFinished } = steps;

    const getStatus = (statusName) => {
        switch(statusName){
            case "Generating Keys":
                if(isGenerating === false) return "wait";
                else if(isGenerating === true && isEncrypting === false) return "process";
                else return "finish";
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
            <Step status={getStatus("Generating Keys")} title="Verify through SCAB" icon={
                getStatus("Generating Keys") === "process" ? <LoadingOutlined /> : <BlockOutlined />
            } />
            <Step status={getStatus("Encrypting Data")} title="Encrypt Data" icon={
                getStatus("Encrypting Data") === "process" ? <LoadingOutlined /> : <LockOutlined />
            } />
            <Step status={getStatus("Uploading to IPFS")} title="Upload to IPFS" icon={
                getStatus("Uploading to IPFS") === "process" ? <LoadingOutlined /> : <CloudUploadOutlined /> 
            } />
            <Step status={getStatus("Creating Smart Contract")} title="Update Contract" icon={
                getStatus("Creating Smart Contract") === "process" ? <LoadingOutlined /> : <SolutionOutlined />
            } />
        </Steps> : <div></div>}
        
    </React.Fragment>
        
    );
}

const mapStateToProps = (state) => {
    return { steps : state.steps }
}

export default connect(mapStateToProps)(InventorySteps);