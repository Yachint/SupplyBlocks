import 'antd/dist/antd.css';
import './App.css';

import React from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import Header from './Fixed/Header';
import Content from './Fixed/Content';
import Footer from './Fixed/Footer';
import history from '../history';
import User from './User/User';
import InventoryPage from './Inventory/InventoryPage';
import Orders from './Orders/Orders';
import DashBoard from './User/DashBoard';
import CreateContract from './User/CreateContract';
import ScabMainPage from './ScabStore/mainPage';
import PaymentsBank from './PaymentsBank/BankMain';

class App extends React.Component {

    getRoutes = () => {
        if(this.props.isSignedIn){
             return (
                <Switch>
                    <Route path="/" exact component={DashBoard} />
                    <Route path="/User" exact component = {User} />
                    <Route path="/Orders" exact component = {Orders} />
                    <Route path="/Inventory" exact component = {InventoryPage} />
                    <Route path="/User/NewContract" exact component = {CreateContract} />
                    <Route path="/Store" exact component={ScabMainPage} />
                    <Route path="/PaymentsBank" exact component={PaymentsBank} />
                    <Redirect to="/" />
                </Switch>
            );
        }else{
            return (
                <Switch>
                    <Route path="/" exact component={DashBoard} />
                    <Redirect to="/" />
                </Switch>
            );
        }
    }

    render(){
        return (
            <Router history={history}>
                <Layout className="layout">
                    <Header />
                    <Content>
                        {this.getRoutes()}
                    </Content>
                    <Footer />
                </Layout>
            </Router>
        );
    };
};

const mapStateToProps = (state) => {
    return { isSignedIn: state.auth.isSignedIn };
}

export default connect(mapStateToProps)(App);