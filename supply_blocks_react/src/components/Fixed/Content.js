import React from 'react';
import { Layout, Breadcrumb } from 'antd';

const { Content } = Layout;

const ContentComp = (props) => {
    return(
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
        <div className="site-layout-content">{props.children}</div>
    </Content>
    );
}

export default ContentComp;
