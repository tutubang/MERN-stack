import React, { Component } from 'react';
import '../../css/customer/booking_date.css';
import { Link } from "react-router-dom";
import axios from 'axios';
var querystring = require('querystring');
import '../../css/customer/list_hotel_cities.css';

class ListHotelCities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: null,
            _start_date: this.props._start_date,
            _end_date: this.props._end_date
        }
        this.getCities();
        this.clickHandler = this.clickHandler.bind(this);
        this.getCities = this.getCities.bind(this);
    }
    getCities() {
        axios.post("http://localhost:8000/api/general/getDataByStatus", querystring.stringify({
            '_type': "city"
        }))
            .then(results => {
                var part1_cities = results.data.slice(0, 10);
                var part2_cities = results.data.slice(10, 20);
                var part3_cities = results.data.slice(20, 30);
                this.setState({
                    _row_cities_1: part1_cities,
                    _row_cities_2: part2_cities,
                    _row_cities_3: part3_cities,
                })
            });
    }
    clickHandler() {
        window.location = "/list-hotel/" +
            this.state._city_id + "/" +
            this.state._start_date + "/" +
            this.state._end_date + "/";
    }
    render() {
        return (
            <div role="main" className="list-hotel-cities">
                <div className="container">
                    <div className="row">
                        <div className="wrapperTopCities">
                            <div className="topCitiesTitle">
                                <h3>HOTEL BY THE CITY</h3>
                                <span className="TopCities">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </div>
                            <div className="row">
                                {this.state._row_cities_1 &&
                                    <div className="col">
                                        {this.state._row_cities_1 && this.state._row_cities_1.map(city => {
                                            return (
                                                <div key={city._id} className="HotelNames">
                                                    <Link className="blue mihawk-list-hotel" title="Khách sạn An Giang" to={"/list-hotel/" +
                                                        city._id + "/" +
                                                        this.state._start_date + "/" +
                                                        this.state._end_date + "/"}>{city._city_name} Hotel</Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                                {this.state._row_cities_1 &&
                                    <div className="col">
                                        {this.state._row_cities_1 && this.state._row_cities_1.map(city => {
                                            return (
                                                <div key={city._id} className="HotelNames">
                                                    <Link className="blue mihawk-list-hotel" title="Khách sạn An Giang" to={"/list-hotel/" +
                                                        city._id + "/" +
                                                        this.state._start_date + "/" +
                                                        this.state._end_date + "/"}>{city._city_name} Hotel</Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                                {this.state._row_cities_1 &&
                                    <div className="col">
                                        {this.state._row_cities_1 && this.state._row_cities_1.map(city => {
                                            return (
                                                <div key={city._id} className="HotelNames">
                                                    <Link className="blue mihawk-list-hotel" title="Khách sạn An Giang" to={"/list-hotel/" +
                                                        city._id + "/" +
                                                        this.state._start_date + "/" +
                                                        this.state._end_date + "/"}>{city._city_name} Hotel</Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                                {this.state._row_cities_1 &&
                                    <div className="col">
                                        {this.state._row_cities_1 && this.state._row_cities_1.map(city => {
                                            return (
                                                <div key={city._id} className="HotelNames">
                                                    <Link className="blue mihawk-list-hotel" title="Khách sạn An Giang" to={"/list-hotel/" +
                                                        city._id + "/" +
                                                        this.state._start_date + "/" +
                                                        this.state._end_date + "/"}>{city._city_name} Hotel</Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                                {this.state._row_cities_1 &&
                                    <div className="col">
                                        {this.state._row_cities_1 && this.state._row_cities_1.map(city => {
                                            return (
                                                <div key={city._id} className="HotelNames">
                                                    <Link className="blue mihawk-list-hotel" title="Khách sạn An Giang" to={"/list-hotel/" +
                                                        city._id + "/" +
                                                        this.state._start_date + "/" +
                                                        this.state._end_date + "/"}>{city._city_name} Hotel</Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListHotelCities;