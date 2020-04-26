import React from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const HeaderComp = (props) => {

    const getSelectedKey = () => {
        const { location } = props;
        const pathSnippets = location.pathname.split('/').filter(i => i);
        let onWhichPage = pathSnippets[0];
        if(onWhichPage === undefined) return ["1"];
        else if(onWhichPage === 'Inventory') return ["2"];
        else if(onWhichPage === 'Orders') return ["3"];
        else return ["4"];
    }

    return(
    <Header>
        <div className="logo">
             <Link to="/"><p>SupplyBlocks</p></Link>
        </div>
      <Menu 
      theme="dark" 
      mode="horizontal" 
      defaultSelectedKeys={['1']} 
      className="MenuPos"
      selectedKeys = {getSelectedKey()}
      >
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
            <Link to="/User">User</Link>
        </Menu.Item>
      </Menu>
    </Header>
    );
}

export default withRouter(HeaderComp);
