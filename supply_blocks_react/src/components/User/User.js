import React, { useState, useEffect } from 'react';
import UserPageSideMenu from './Fixed/UserPageSideMenu';
import { updateContract, deleteContract } from '../../actions';
import { connect } from 'react-redux';
import Form from '../Reusable/Form';
import { notification, Button, Spin } from 'antd';
import { reset } from '../../actions/stepActions';
import ContractUpdateSteps from './Fixed/ContractUpdateSteps';

import './User.css';

const User = (props) => {
    const [selectedView, setView] = useState('edit');
    const [isDeleting, setDelete] = useState(false);

    const {contractDetails, AdditionalInfo} = props;
    const { mainContractAddress } = contractDetails;
    const { reset, isGenerating, isFinished, isStarted } = props;

    useEffect(() => {
        if(isGenerating && isFinished){
            reset();
        }
        else if(!isGenerating && isFinished){
            openNotification();
            reset();
        }
        else if(mainContractAddress===null){
            setDelete(false);
        }
    },[reset, isFinished, isGenerating, mainContractAddress]);

    

    const onSubmit = (formValues) => {
        console.log(formValues);
        props.updateContract(formValues);
    }

    const onMenuClick = (view) => {
        // console.log(view.key);
        if(view.key === '1') setView('edit');
        else if(view.key === '2') setView('delete');
    }

    const onDelete = () => {
        props.deleteContract();
        setDelete(true);
    }

    const openNotification = () => {
        notification.open({
          message: 'Smart-Contract Updated!',
          description:
            'Your Smart-Contract has been Successfully updated. Please visit the Dashboard for Further Details.',
          onClick: () => {
            notification.close();
          },
        });
      };

    const renderView = () =>{
        switch(selectedView){
            case 'edit':
                const editableObj = {
                    orgName: contractDetails.orgName,
                    description: contractDetails.description,
                    name: AdditionalInfo.name,
                    designation: AdditionalInfo.designation,
                    companyAddress: AdditionalInfo.companyAddress,
                    warehouseAddress: AdditionalInfo.warehouseAddress,
                    productCategories: AdditionalInfo.productCategories
                }
                console.log(isStarted);
                return <Spin 
                tip="Updating your contract, please be patient..." 
                spinning={isStarted}
                >
                <Form  onSubmit={onSubmit}  initialValues={editableObj} />
                </Spin>

            case 'delete':
                return <div>
                    <Spin 
                    tip="Deleting your contract, please be patient..." 
                    spinning={isDeleting}
                    style={{marginTop: '50px'}}>
                    {isDeleting? <div></div> : <React.Fragment>
                            <h3>Delete Account? This action cannot be reversed.</h3>
                            <Button type="primary" danger onClick={() => { onDelete() }} >
                            Yes, Delete   
                            </Button>
                        </React.Fragment>
                    }
                        
                    </Spin>
                </div>
            default:
                return <div>
                    Welcome to contract Settings!
                </div>
        }
    }

    return(
        <div className="space-align-container">
            <ContractUpdateSteps />
            <div className="space-align-block">
                <UserPageSideMenu onMenuClick={onMenuClick}/>
            </div>
            <div className="space-align-side">
                
                {renderView()}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return { 
        contractDetails: state.contract.contractDetails,
        AdditionalInfo: state.contract.AdditionalInfo,
        isGenerating : state.steps.isGenerating,
        isFinished: state.steps.isFinished,
        isStarted: state.steps.isStarted
    }
}

export default connect(mapStateToProps,{
    updateContract: updateContract,
    reset: reset,
    deleteContract: deleteContract
})(User);