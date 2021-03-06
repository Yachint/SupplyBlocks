import React, { useState, useEffect } from 'react';
import { message, Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { signIn, signOut, unloadContract, unloadInventory } from '../../actions';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogInMetamask from './LogInMetamask';
import web3 from '../../ethereum/web3';

const { Header } = Layout;

const HeaderComp = (props) => {

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if(props.mainContractAddress!==null){
            setLoading(false);
        }
    },[isLoading, props.mainContractAddress])

    const getSelectedKey = () => {
        const { location } = props;
        const pathSnippets = location.pathname.split('/').filter(i => i);
        let onWhichPage = pathSnippets[0];
        if(onWhichPage === undefined) return ["1"];
        else if(onWhichPage === 'Inventory') return ["2"];
        else if(onWhichPage === 'Orders') return ["3"];
        else if(onWhichPage === 'Store') return ["4"];
        else if(onWhichPage === 'PaymentsBank') return ["6"];
        else return ["5"];
    }

    const initiateLogin = async () =>{
        setLoading(true);
        const accounts = await web3.eth.getAccounts();
        if(accounts.length === 0){
            console.log("Accounts length is Empty, Maybe Login to Metamask First?");
            setLoading(false);
            error();
        }else{
            props.signIn(accounts[0]);
            messageOnLogin();
            setLoading(false);
        }
    }

    const initiateLogout = () => {
        props.signOut();
        props.unloadContract();
        props.unloadInventory();
        messageOnLogOut();
    }   

    const messageOnLogin = () => {
        message.success('You have successfully Logged in!');
    };

    const messageOnLogOut = () => {
        message.success('You have successfully Logged out!');
    };

    const error = () => {
        message.error('Failed to login!, Maybe Login to Metamask First?');
    };

    const getMenuIems = () => {
        if(props.isSignedIn && props.mainContractAddress !== null){
            return (
                <Menu 
                    theme="dark" 
                    mode="horizontal" 
                    defaultSelectedKeys={['1']} 
                    className="MenuPos"
                    selectedKeys = {getSelectedKey()}>
                    <Menu.Item className = "ItemPos" key="1">
                        <Link to="/">DashBoard</Link>
                    </Menu.Item>
                    <Menu.Item className = "ItemPos" key="2">
                        <Link to="/Inventory">Inventory</Link>
                    </Menu.Item>
                    <Menu.Item className = "ItemPos" key="3">
                        <Link to="/Orders">Orders</Link>
                    </Menu.Item>
                    <Menu.Item className = "ItemPos" key="6">
                        <Link to="/PaymentsBank">Payments Bank</Link>
                    </Menu.Item>
                    <Menu.Item className = "ItemPos" key="4">
                        <Link to="/Store">SCAB Store</Link>
                    </Menu.Item>
                    <Menu.Item className = "ItemPos" key="5">
                        <Link to="/User">User</Link>
                    </Menu.Item>
                    <LogInMetamask initiateLogout={initiateLogout} isLoading={isLoading} isSignedIn={props.isSignedIn}/>
            </Menu>
            );
        } else if(props.isSignedIn && props.mainContractAddress === null){
            return (
                <Menu 
                    theme="dark" 
                    mode="horizontal" 
                    defaultSelectedKeys={['1']} 
                    className="MenuPos"
                    selectedKeys = {getSelectedKey()}>
                    <Menu.Item className = "ItemPos" key="1">
                        <Link to="/">DashBoard</Link>
                    </Menu.Item>
                    <Menu.Item className = "ItemPos" key="2">
                        <Link to="/Inventory">Inventory</Link>
                    </Menu.Item>
                    <Menu.Item className = "ItemPos" key="3">
                        <Link to="/Orders">Orders</Link>
                    </Menu.Item>
                    <Menu.Item className = "ItemPos" key="4">
                        <Link to="/Store">SCAB Store</Link>
                    </Menu.Item>
                    <LogInMetamask initiateLogout={initiateLogout} isLoading={isLoading} isSignedIn={props.isSignedIn}/>
            </Menu>
            );
        } else {
            return (
                <Menu 
                    theme="dark" 
                    mode="horizontal" 
                    defaultSelectedKeys={['1']} 
                    className="MenuPos"
                    selectedKeys = {getSelectedKey()}>
                    <Menu.Item className = "ItemPos" key="1">
                        <Link to="/">DashBoard</Link>
                    </Menu.Item>
                    <LogInMetamask initiateLogin={initiateLogin} isLoading={isLoading} isSignedIn={props.isSignedIn} />
                </Menu>
            );
        }
    }

    return(
    <Header>
        <div className="logo">
             <Link to="/"><p>SupplyBlocks</p></Link>
        </div>
      {getMenuIems()}
    </Header>
    );
}

const mapStateToProps = (state) => {
    return { 
        isSignedIn: state.auth.isSignedIn,
        mainContractAddress: state.contract.contractDetails.mainContractAddress
    }; 
}

export default withRouter(connect(mapStateToProps,{
    signIn: signIn,
    signOut: signOut,
    unloadContract: unloadContract,
    unloadInventory: unloadInventory
})(HeaderComp));
