import React from 'react';
import ReactDOM from 'react-dom';
import Favicon from 'react-favicon';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AdminLogin from './components/admin/Login';
import AdminHome from './components/admin/Home';
import StaffLogin from './components/staff/Login';
import StaffHome from './components/staff/Home';
import CustomerHome from './components/customer/Home';
import ListHotels from './components/customer/content/ListHotel';
import BookRoom from './components/customer/content/BookRoom';
import InfoCustomer from './components/customer/content/InfoCustomer';
import ViewAllReviewHotel from './components/customer/content/ViewAllReviewHotel';
import './css/root.css';

ReactDOM.render((
    <div>
        <Favicon url="./src/images/favicon.ico" />
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={CustomerHome} />
                <Route path="/list-hotel/:city_id/:address/:start_date/:end_date" component={ListHotels} />
                <Route path="/list-hotel/:city_id/:start_date/:end_date" component={ListHotels} />
                <Route path="/book-room/:hotel_id/:city_id/:address/:start_date/:end_date" component={BookRoom} />
                <Route path="/book-room/:hotel_id/:city_id/:start_date/:end_date" component={BookRoom} />
                <Route path="/info-customer/:hotel_id/:type_room_id/:number_room/:start_date/:end_date" component={InfoCustomer} />
                <Route path="/admin-login" component={AdminLogin} />
                <Route path="/admin" component={AdminHome} />
                <Route path="/staff-login" component={StaffLogin} />
                <Route path="/staff" component={StaffHome} />
                <Route path="/viewAllReviewHotel/:hotel_id" component={ViewAllReviewHotel} />
                
            </Switch>
        </BrowserRouter>
    </div>
), document.getElementById('root'));
