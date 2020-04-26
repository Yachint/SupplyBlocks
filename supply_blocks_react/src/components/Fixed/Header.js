import React from 'react';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const HeaderComp = () => {
    return(
    <Header>
        <div className="logo"><p>SupplyBlocks</p></div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} className="MenuPos">
        <Menu.Item className = "ItemPos" key="1">Inventory</Menu.Item>
        <Menu.Item className = "ItemPos" key="2">Orders</Menu.Item>
        <Menu.Item className = "ItemPos" key="3">My Account</Menu.Item>
      </Menu>
    </Header>
    );
}

export default HeaderComp;
