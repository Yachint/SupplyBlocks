import 'antd/dist/antd.css';
import './App.css';

import React from 'react';
import { Layout } from 'antd';
import Header from './Fixed/Header';
import Content from './Fixed/Content';
import Footer from './Fixed/Footer';


class App extends React.Component {
    render(){
        return (
            <Layout className="layout">
                <Header />
                <Content />
                <Footer />
            </Layout>
        );
    };
};

export default App;