import React, { useState } from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../../actions';
import { message, Button } from 'antd';
import web3 from '../../ethereum/web3';

const LogInMetamask = (props) => {

    const [isLoading, setLoading] = useState(false);

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

    const messageOnLogin = () => {
        message.success('You have successfully Logged in!');
    };

    const messageOnLogOut = () => {
        message.success('You have successfully Logged out!');
    };

    const error = () => {
        message.error('Failed to login!, Maybe Login to Metamask First?');
    };

    const initiateLogout = () => {
        props.signOut();
        messageOnLogOut();
    }   

    const renderButton = () => {
        if(props.isSignedIn === null || props.isSignedIn === false){
            return <Button type="primary" loading={isLoading} onClick={initiateLogin}>Sign in with Metamask</Button>
        }else{
            return <Button type="primary" loading={isLoading} onClick={initiateLogout}>Welcome User</Button>
        }
    }

    return(
        renderButton()
    );


}

const mapStateToProps = (state) => {
    return { isSignedIn: state.auth.isSignedIn };
}

export default connect(mapStateToProps, {
    signIn: signIn,
    signOut: signOut
})(LogInMetamask);