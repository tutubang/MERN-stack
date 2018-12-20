import React, { Component } from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';
import $ from 'jquery';

import Navbar from './Navbar';
import Header from './Header';

import OrdersWaiting from './content/order/OrdersWaiting';
import OrdersCanceled from './content/order/OrdersCanceled';
import OrdersHired from './content/order/OrdersHired';
import OrdersCheckedOut from './content/order/OrdersCheckedOut';
import OrdersOutOfDate from './content/order/OrdersOutOfDate';
import InfoStaff from './content/staff/InfoStaff';
import InfoCustomer from './content/customer/InfoCustomer';
import InfoTypeRoom from './content/typeRoom/InfoTypeRoom';
import ChangeInfo from './content/account/ChangeInfo';
import ChangePass from './content/account/ChangePass';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            isloggedin: false
        };
        axios.get("http://localhost:8000/api/staff/isloggedin")
            .then(res => {
                if (res.data.isLoggedIn) {
                    return this.setState({
                        isloggedin: true,
                        _staff_id: res.data.accInfo._id,
                        _hotel_id: res.data.accInfo._hotel_id,
                        _first_name: res.data.accInfo._firstname,
                        _lastname: res.data.accInfo._lastname,
                        _email: res.data.accInfo._email,
                        _phone_number: res.data.accInfo._phone_number,
                        _username: res.data.accInfo._username
                    });
                }
            });
        this.submitHandler = this.submitHandler.bind(this);
    }
    componentDidMount() {
        $(document).ready(function () {
            $('#sidebarCollapse').on('click', function () {
                $('#sidebar, #content').toggleClass('active');
                $('.collapse.in').toggleClass('in');
                $('a[aria-expanded=true]').attr('aria-expanded', 'false');
            });
        });
    }
    submitHandler(e) {
        e.preventDefault();
        window.location = "/staff-login";
    }
    render() {
        return this.state.isloggedin === true ? (
            <HashRouter>
                <div className="wrapper">
                    <Navbar hotel_id={this.state._hotel_id} staff_id={this.state._staff_id}/>
                    <div id="content">
                        <Header />
                        <Switch>
                            <Route path="/ordersWaiting/:hotel_id/:staff_id" component={OrdersWaiting} />
                            <Route path="/ordersCanceled/:hotel_id/:staff_id" component={OrdersCanceled} />
                            <Route path="/ordersHired/:hotel_id/:staff_id" component={OrdersHired} />
                            <Route path="/ordersCheckedOut/:hotel_id/:staff_id" component={OrdersCheckedOut} />
                            <Route path="/ordersOutOfDate/:hotel_id/:staff_id" component={OrdersOutOfDate} />
                            <Route path="/info-staff/:staff_id" component={InfoStaff} />
                            <Route path="/info-type-room/:type_room_id" component={InfoTypeRoom} />
                            <Route path="/infoCustomer/:customer_id" component={InfoCustomer} />
                            <Route path="/changeInfo/:staff_id" component={ChangeInfo} />
                            <Route path="/changePass/:staff_id" component={ChangePass} />
                        </Switch>
                    </div>
                </div>
            </HashRouter>
        ) : (
                <div>
                    <h1>You have to Login first!</h1>
                    <form onSubmit={this.submitHandler}>
                        <button type="submit" className="btn btn-secondary">Login</button>
                    </form>
                </div>
            )
    }
}

export default Home;