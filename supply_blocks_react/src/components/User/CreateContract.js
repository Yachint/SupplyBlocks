import React from 'react';
import { PageHeader } from 'antd';
import history from '../../history';
import { connect } from 'react-redux';
import { initializeContract } from '../../actions';
import ContractForm from '../Reusable/Form';
import { Spin, notification, Result, Button } from 'antd';
import ContractCreateSteps from './Fixed/ContractCreateSteps';
import { Link } from 'react-router-dom';


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
        <React.Fragment>
            <ContractCreateSteps />
            <Spin spinning={this.state.isLoading && this.props.mainContractAddress === null} 
            tip="Creating your Smart-Contract, Please be patient...">
                <PageHeader
                className="site-page-header"
                onBack={() => history.push('/')}
                title="Create a new Warehouse Contract"
                />

                {this.props.steps.isFinished ?  <Result
                        status="success"
                        title="Successfully Created Smart Contract"
                        subTitle="Please Visit the dashboard for further details"
                        extra={[
                         <Button type="primary" key="console">
                         <Link to="/" >Go to Dashboard</Link>
                        </Button>
                        ]}
                /> : <ContractForm onSubmit={this.onSubmit}/>}
            </Spin>
        </React.Fragment>
    );

    }
    
}

const mapStateToProps = (state) => {
    return { 
        mainContractAddress: state.contract.contractDetails.mainContractAddress,
        steps: state.steps         
    };
}

export default connect(mapStateToProps,{
    initializeContract: initializeContract
})(CreateContract);