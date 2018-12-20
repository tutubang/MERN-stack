import React, { Component } from 'react';
import '../../css/customer/booking_date.css';
import axios from 'axios';
var querystring = require('querystring');

class BookingDate extends Component {
    constructor() {
        super();
        this.getCities();
        this.handlerDate();
        this.handlerDate = this.handlerDate.bind(this);
        this.getCities = this.getCities.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
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
    getCities() {
        axios.post("http://localhost:8000/api/general/getDataByStatus", querystring.stringify({
            '_type': "city"
        }))
            .then(cities => this.setState({ cities: cities.data }));
    }
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submitHandler(e) {
        e.preventDefault();
        if (this.state._city_id === "") {
            alert("You have to choose the city!");
        } else if (this.state._start_date === "") {
            alert("You have to choose the start date!");
        } else if (this.state._end_date === "") {
            alert("You have to choose the end date!");
        } else if (this.state._start_date < this.state._date_now) {
            alert("Start date is past!");
        } else if (this.state._end_date <= this.state._date_now) {
            alert("End date is past!");
        } else if (this.state._start_date > this.state._end_date) {
            alert("The start date is bigger than the end date!");
        } else if (this.state._address === undefined) {
            window.location = "/list-hotel/" +
                this.state._city_id + "/" +
                this.state._start_date + "/" +
                this.state._end_date + "/";
        } else {
            window.location = "/list-hotel/" +
                this.state._city_id + "/" +
                this.state._address + "/" +
                this.state._start_date + "/" +
                this.state._end_date + "/";
        }
    }
    render() {
        return (
            <div className="booking-date">
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 search-box">
                            <div className="search">
                                <form id="searchForm" onSubmit={this.submitHandler}>
                                    <div className="row">
                                        <div className="form-group div-search">
                                            <label className="label-search">City name</label><br />
                                            <select className="form-control select-city"
                                                title="Choose the city"
                                                name="_city_id"
                                                className="form-control"
                                                onChange={this.changeHandler}>
                                                <option value="">Choose the city</option>
                                                {this.state.cities &&
                                                    this.state.cities.map(city => {
                                                        return (
                                                            <option className="option-city" key={city._id} value={city._id}>{city._city_name}</option>
                                                        )
                                                    })}
                                            </select>
                                        </div>
                                        <div className="form-group div-search">
                                            <label className="label-search">Address</label> <br />
                                            <input type="text"
                                                className="form-control input-text"
                                                placeholder="Address"
                                                id="_address"
                                                name="_address"
                                                title="Address"
                                                onChange={this.changeHandler} />
                                        </div>
                                        <div className="form-group div-search">
                                            <label className="label-search">Start date</label> <br />
                                            <input type="date"
                                                className="form-control input-date"

                                                min={this.state._date_now}
                                                value={this.state._start_date}
                                                id="_start_date"
                                                name="_start_date"
                                                title="Start date"
                                                onChange={this.changeHandler} />
                                        </div>
                                        <div className="form-group div-search">
                                            <label className="label-search">End date</label> <br />
                                            <input type="date"
                                                className="form-control input-date"
                                                value={this.state._end_date}
                                                min={this.state._date_now}
                                                id="exampleInputEmail3"
                                                id="_end_date"
                                                name="_end_date"
                                                title="End date"
                                                onChange={this.changeHandler} />
                                        </div>
                                        <button id="btnSearch" type="submit" className="btn btn-primary">Search<i className="fa fa-search"></i></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BookingDate;