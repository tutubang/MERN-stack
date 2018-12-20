import React, { Component } from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';
import $ from 'jquery';

import Navbar from './Navbar';
import Header from './Header';
//city
import AddCity from './City/AddCity';
import ListCity from './City/ListCity';
import UpdateCity from './City/UpdateCity';
//hotel
import AddHotel from './Hotel/AddHotel';
import ListHotel from './Hotel/ListHotel';
import UpdateHotel from './Hotel/UpdateHotel';
//service
import AddService from './Service/AddService';
import ListService from './Service/ListService';
import UpdateService from './Service/UpdateService';
//type room
import AddTypeRoom from './TypeRoom/AddTypeRoom';
import ListTypeRoom from './TypeRoom/ListTypeRoom';
import UpdateTypeRoom from './TypeRoom/UpdateTypeRoom';
//staff
import AddStaff from './Staff/AddStaff';
import ListStaff from './Staff/ListStaff';
import UpdateStaff from './Staff/UpdateStaff';
//review
import ListReview from './Review/ListReivew';
//order
import Statistic from './Order/Statistic';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloggedin: false
        };
        axios.get("http://localhost:8000/api/admin/isloggedin")
            .then(res => {
                if (res.data.isLoggedIn) {
                    return this.setState({ isloggedin: true });
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
        window.location = "/admin-login";
    }
    render() {
        return this.state.isloggedin === true ? (
            <HashRouter>
                <div className="wrapper">
                    <Navbar />
                    <div id="content">
                        <Header />
                        <Switch>
                            <Route path="/showCity" component={ListCity} />
                            <Route path="/addCity" component={AddCity} />
                            <Route path="/updateCity/:_id" component={UpdateCity} />

                            <Route path="/showHotel" component={ListHotel} />
                            <Route path="/addHotel" component={AddHotel} />
                            <Route path="/updateHotel/:_id" component={UpdateHotel} />

                            <Route path="/addService" component={AddService} />
                            <Route path="/showService" component={ListService} />
                            <Route path="/updateService/:_id" component={UpdateService} />

                            <Route path="/addTypeRoom" component={AddTypeRoom} />
                            <Route path="/showTypeRoom" component={ListTypeRoom} />
                            <Route path="/updateTypeRoom/:_id" component={UpdateTypeRoom} />

                            <Route path="/addStaff" component={AddStaff} />
                            <Route path="/showStaff" component={ListStaff} />
                            <Route path="/updateStaff/:_id" component={UpdateStaff} />

                            <Route path="/showReview/:_id" component={ListReview} />
                            <Route path="/showStatistic/:_id" component={Statistic} />
                            
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