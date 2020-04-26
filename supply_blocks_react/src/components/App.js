import 'antd/dist/antd.css';
import './App.css';

import React from 'react';
import { Router, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './Fixed/Header';
import Content from './Fixed/Content';
import Footer from './Fixed/Footer';
import history from '../history';
import User from './User/User';
import Inventory from './Inventory/Inventory';
import Orders from './Orders/Orders';
import DashBoard from './User/DashBoard';

class App extends React.Component {
    render(){
        return (
            <Router history={history}>
                <Layout className="layout">
                    <Header />
                    <Content>
                        <Route path="/" exact component={DashBoard} />
                        <Route path="/User" exact component = {User} />
                        <Route path="/Orders" exact component = {Orders} />
                        <Route path="/Inventory" exact component = {Inventory} />
                    </Content>
                    <Footer />
                </Layout>
            </Router>
        );
    };
};

export default App;