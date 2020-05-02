import React from 'react';
import { Button } from 'antd';

const LogInMetamask = (props) => {

    const initiateLogin = () =>{
        props.initiateLogin()
    }

    const initiateLogout = () => {
        props.initiateLogout();
    }   

    const renderButton = () => {
        if(props.isSignedIn === null || props.isSignedIn === false){
            return <Button style={{marginLeft: '30px', marginRight: '-20px'}} type="primary" loading={props.isLoading} onClick={initiateLogin}>Sign in with Metamask</Button>
        }else{
            return <Button type="primary" loading={props.isLoading} onClick={initiateLogout}>Welcome User</Button>
        }
    }

    return(
        renderButton()
    );
}

export default LogInMetamask;