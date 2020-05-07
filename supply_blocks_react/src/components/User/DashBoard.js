import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { loadContract } from '../../actions';
import SupplyBlocks from '../../ethereum/SupplyBlocks';
import { Empty, Button, Descriptions, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';

const DashBoard = (props) =>{

    const { address, loadContract } = props;

    const [isChecked, setChecked] = useState(true);

    const checkForWarehouse = useCallback(async () => {
        const isWarehouse = await SupplyBlocks.methods.getContractAddress(address).call();
        console.log('isWarehouse ? :',isWarehouse);
        if(isWarehouse !== "0x0000000000000000000000000000000000000000" 
        && isWarehouse!== null){
            loadContract(isWarehouse);
        }
        else{
            console.log("No contracts Associated yet!");
            setChecked(false);
        }
    },[address, loadContract]);

    const renderCategories = () => {
        return props.AdditionalInfo.productCategories.map(item => {
            return <React.Fragment key={item}>
                {item} <br />
            </React.Fragment>
        })
    }

    const renderContent = () => {

        if(props.contractAddress === null && 
            (props.isSignedIn === null || props.isSignedIn === false )){
            return(
                <div>
                    <h3>Welcome User to DashBoard!</h3>
                </div>
            );
        }
        else if(props.contractAddress === null &&
            props.isSignedIn === true){
            return (
            <Spin style={{marginTop : "110px"}} 
            spinning={isChecked} 
            tip="Checking your Contract Details, just a second...">
                {isChecked ? <div></div> :
                <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                height: 60,
                }}
                description={
                <span>
                    No Warehouse Associated with this Address, Maybe create one?
                </span>
                }
            >
                <Button type="primary">
                    <Link to="/User/NewContract">Create Now</Link>
                </Button>
            </Empty>}
          </Spin>
          );
        }
        else{
            const { contractAddress, contractDetails, AdditionalInfo } = props;
            return (
                <Descriptions title="Contract Details" bordered>
                    <Descriptions.Item label="Organization Name">{contractDetails.orgName}</Descriptions.Item>
                    <Descriptions.Item label="Organization Address" span={2} >{contractAddress}</Descriptions.Item>
                    <Descriptions.Item label="Manager Address">{contractDetails.managerAddress}</Descriptions.Item>
                    <Descriptions.Item label="Main Contract Address" span={2}>
                    {contractDetails.mainContractAddress}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" >
                    <Badge status="processing" text="Online" />
                    </Descriptions.Item>
                    <Descriptions.Item label="Organization Description" span={2}>{contractDetails.description}</Descriptions.Item>
                    <Descriptions.Item label="Product Categories">{renderCategories()}</Descriptions.Item>
                    <Descriptions.Item label="Config Info" span={2}>
                    Name: {AdditionalInfo.name}
                    <br />
                    Designation: {AdditionalInfo.designation}
                    <br />
                    Company Address: {AdditionalInfo.companyAddress}
                    <br />
                    Warehouse Address: {AdditionalInfo.warehouseAddress}
                    <br />
                    </Descriptions.Item>
                    <Descriptions.Item label="Organization Public Key" span={3}>{contractDetails.publicKey}</Descriptions.Item>
                </Descriptions>
            );
        }
    }

    const { isSignedIn, contractDetails } = props;
    const { mainContractAddress } = contractDetails;

    useEffect(() => {
        if(isSignedIn && mainContractAddress === null){
            checkForWarehouse();
        }
        else if(isSignedIn && mainContractAddress !== null){
            setChecked(false);
        }
        else if(!isSignedIn){
            setChecked(true);
        }

    },
    [isSignedIn, checkForWarehouse, mainContractAddress]);

    return(
        renderContent()
    );
};

const mapStateToProps = (state) => {
    return { 
        contractAddress : state.contract.contractAddress,
        isSignedIn: state.auth.isSignedIn,
        address: state.auth.userAddress,
        contractDetails: state.contract.contractDetails,
        AdditionalInfo: state.contract.AdditionalInfo
     }
}

export default connect(mapStateToProps, {
    loadContract: loadContract
})(DashBoard);