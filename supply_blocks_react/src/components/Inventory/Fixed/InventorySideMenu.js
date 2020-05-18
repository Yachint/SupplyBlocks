import React from 'react';
import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;

const InventorySideMenu = (props) => {
    return (
        <Menu
        onClick={props.onMenuClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
          <SubMenu key="sub1" icon={<SettingOutlined />} title="Settings">
          <Menu.Item key="1">Manage Inventory</Menu.Item>
          <Menu.Item key="2">Check logs</Menu.Item>
        </SubMenu>
 
        </Menu>
    );
}

export default InventorySideMenu;