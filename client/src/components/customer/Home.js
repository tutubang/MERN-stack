import React, { Component } from 'react';
import Header from './Header';
import BookingDate from './BookingDate';
import TopDestination from './TopDestination';
import ListHotelCities from './ListHotelCities';
import Footer from './Footer';
class Home extends Component {
    constructor() {
        super();
        this.handlerDate();
        this.handlerDate = this.handlerDate.bind(this);
    }
    handlerDate() {
        var today = new Date();
        var dd_today = today.getDate();
        var mm_today = today.getMonth() + 1;
        var yyyy_today = today.getFullYear();
        //tomorrow
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        var dd_tomorrow = tomorrow.getDate();
        var mm_tomorrow = tomorrow.getMonth() + 1;
        var yyyy_tomorrow = tomorrow.getFullYear();
        //after tomorrow
        var after_tomorrow = new Date();
        after_tomorrow.setDate(today.getDate() + 2);
        var dd_after_tomorrow = after_tomorrow.getDate();
        var mm_after_tomorrow = after_tomorrow.getMonth() + 1;
        var yyyy_after_tomorrow = after_tomorrow.getFullYear();
        //handler today
        if (dd_today < 10) {
            dd_today = '0' + dd_today;
        }
        if (mm_today < 10) {
            mm_today = '0' + mm_today;
        }
        //handler tomorrow
        if (dd_tomorrow < 10) {
            dd_tomorrow = '0' + dd_tomorrow;
        }
        if (mm_tomorrow < 10) {
            mm_tomorrow = '0' + mm_tomorrow;
        }
        //handler after tomorrow
        if (dd_after_tomorrow < 10) {
            dd_after_tomorrow = '0' + dd_after_tomorrow;
        }
        if (mm_after_tomorrow < 10) {
            mm_after_tomorrow = '0' + mm_after_tomorrow;
        }
        var date_now = yyyy_today + '-' + mm_today + '-' + dd_today;
        var start_date = yyyy_tomorrow + '-' + mm_tomorrow + '-' + dd_tomorrow;
        var end_date = yyyy_after_tomorrow + '-' + mm_after_tomorrow + '-' + dd_after_tomorrow;
        this.state = {
            _city_id: "",
            _date_now: date_now,
            _start_date: start_date,
            _end_date: end_date
        };
    }
    render() {
        return (
            <div>
                <Header />
                <BookingDate />
                <TopDestination
                    _start_date={this.state._start_date}
                    _end_date={this.state._end_date} />
                <ListHotelCities _start_date={this.state._start_date}
                    _end_date={this.state._end_date} />
                <Footer />
            </div>
        )
    }
}

export default Home;