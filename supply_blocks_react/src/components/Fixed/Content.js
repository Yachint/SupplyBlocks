import React from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';

const { Content } = Layout;

const ContentComp = (props) => {
    
    const getBredcrumbValue = () => {
        const { location } = props;
        const pathSnippets = location.pathname.split('/').filter(i => i);
        return(pathSnippets[0]);
    }

    console.log(getBredcrumbValue());
    return(
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>{getBredcrumbValue()}</Breadcrumb.Item>
      </Breadcrumb>
        <div className="site-layout-content">{props.children}</div>
    </Content>
    );
}

export default withRouter(ContentComp);
