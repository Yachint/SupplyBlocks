import React from 'react';
import { PageHeader } from 'antd';
import history from '../../history';
import { connect } from 'react-redux';
import { initializeContract } from '../../actions';
import ContractForm from '../Reusable/Form';
import { Spin, notification } from 'antd';

class CreateContract extends React.Component {

    state = { isLoading: false };

    onSubmit = (formValues) => {
        console.log(formValues);
        this.setState({ isLoading: true });
        this.props.initializeContract(formValues);
    }

    componentDidUpdate(prevProps){
        if(this.props.mainContractAddress !== prevProps.mainContractAddress){
            this.setState({ isLoading: false });
            this.openNotification();
        }
    }

    openNotification = () => {
        notification.open({
          message: 'Smart-Contract Created!',
          description:
            'Your Smart-Contract has been Successfully created. Please visit the Dashboard for Further Details.',
          onClick: () => {
            notification.close();
          },
        });
      };

    render(){
        return(
        <Spin spinning={this.state.isLoading && this.props.mainContractAddress === null} 
        tip="Creating your Smart-Contract, Please be patient...">
            <PageHeader
            className="site-page-header"
            onBack={() => history.push('/')}
            title="Create a new Warehouse Contract"
            />

            <ContractForm onSubmit={this.onSubmit}/>
        </Spin>
    );

    }
    
}

const mapStateToProps = (state) => {
    return { mainContractAddress: state.contract.contractDetails.mainContractAddress };
}

export default connect(mapStateToProps,{
    initializeContract: initializeContract
})(CreateContract);