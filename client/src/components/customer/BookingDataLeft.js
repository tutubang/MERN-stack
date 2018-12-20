import React, { Component } from 'react';
import '../../css/customer/booking_date.css';
import axios from 'axios';
var querystring = require('querystring');

class BookingDateLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _city_id: this.props._city_id,
            _start_date: this.props._start_date,
            _end_date: this.props._end_date
        }
        this.getCities();
        this.getCities = this.getCities.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
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
            <div id="primary" className="col-md-3 sidebar-snippets">
                <div className="snippet search-panel">
                    <h3 className="snippet-title">FIND THE HOTEL</h3>
                    <div className="snippet-content">
                        <div className="form search-filter partials-search-hotels">
                            <div className="form-group">
                                <label>CITY NAME</label>
                                <div className="input-group input-search">
                                    <select id="optAttraction" className="form-control"
                                        title="Choose the city"
                                        name="_city_id"
                                        className="form-control"
                                        onChange={this.changeHandler}>
                                        <option value="">Choose the city</option>
                                        {this.state.cities &&
                                            this.state.cities.map(city => {
                                                return (
                                                    city._id === this.state._city_id ?
                                                        <option selected className="option-city" key={city._id} value={city._id}>{city._city_name}</option> :
                                                        <option className="option-city" key={city._id} value={city._id}>{city._city_name}</option>
                                                )
                                            })}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>ADDRESS</label>
                                <input type="text"
                                    className="form-control input-text"
                                    placeholder="Address"
                                    value={this.props._address}
                                    id="_address"
                                    name="_address"
                                    title="Address"
                                    onChange={this.changeHandler} />
                            </div>
                            <div className="form-group">
                                <label>START DATE</label>
                                <input type="date"
                                    className="form-control input-date"
                                    defaultValue={this.props._start_date}
                                    id="_start_date"
                                    name="_start_date"
                                    title="Start date"
                                    onChange={this.changeHandler} />
                            </div>
                            <div className="form-group">
                                <label>END DATE</label>
                                <input type="date"
                                    className="form-control input-date"
                                    defaultValue={this.props._end_date}
                                    id="exampleInputEmail3"
                                    id="_end_date"
                                    name="_end_date"
                                    title="End date"
                                    onChange={this.changeHandler} />
                            </div>
                            <button id="btnSearch" onClick={this.submitHandler} className="btn btn-primary">Search</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
export default BookingDateLeft;