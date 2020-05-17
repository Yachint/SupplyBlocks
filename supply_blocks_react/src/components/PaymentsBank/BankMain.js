import React from 'react';
import { PageHeader } from 'antd';
import history from '../../history';

const BankMain = () => {
    return(
        <PageHeader
        className="site-PaymentsBank"
        onBack={() => {history.push('/')}}
        title="Payments Bank"
        subTitle="Supports ether based payments"
        />
    );
};

export default BankMain;