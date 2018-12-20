import React, { Component } from 'react';
import '../../css/customer/booking_date.css';
import { Link } from "react-router-dom";
import axios from 'axios';
var querystring = require('querystring');
import '../../css/customer/top_destination.css';

class TopDestination extends Component {
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
        axios.get("http://localhost:8000/api/customer/getCityTopDestination")
            .then(results => {
                let _images = {};
                for (var key in results.data.images) {
                    const buffer = results.data.images[key].data;
                    const b64 = new Buffer(buffer).toString('base64');
                    const mimeType = "image/png";
                    _images[key] = `data:${mimeType};base64,${b64}`;
                }
                var part1_cities = results.data.cities.slice(0, 4);
                var part2_cities = results.data.cities.slice(4, 8);
                var part3_cities = results.data.cities.slice(8, 12);
                this.setState({
                    _row_cities_1: part1_cities,
                    _row_cities_2: part2_cities,
                    _row_cities_3: part3_cities,
                    _images: _images,
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
            <div role="main" className="top-destination">
                <div className="container">
                    <div className="row">
                        <div className="wrapperTopCities">
                            <div className="topCitiesTitle">
                                <h3>Top destination</h3>
                                <span className="TopCities">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </div>
                            <table className="ddlTopCities" cellSpacing="0" cellPadding="0" border="0" >
                                <tbody>
                                    <tr>
                                        {this.state._row_cities_1 && this.state._row_cities_1.map(city => {
                                            return (
                                                <td key={city._id} className="ddlTopCitiesTD" align="left" valign="top">
                                                    <div title={city._city_name}>
                                                        <Link className="link-img-hotel" to={"/list-hotel/" +
                                                            city._id + "/" +
                                                            this.state._start_date + "/" +
                                                            this.state._end_date + "/"}>
                                                            {Object.keys(this.state._images).map((key_image) => {
                                                                if (key_image === city._id) {
                                                                    return <img key={key_image} className="img-thumbnail image-hotel" alt="" src={this.state._images[key_image]} />
                                                                }
                                                            })}
                                                        </Link>
                                                        <div className="CityName">
                                                            <a title={city._city_name} className="blue mihawk-list-hotel" href="#">{city._city_name}</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                    <tr>
                                        {this.state._row_cities_2 && this.state._row_cities_2.map(city => {
                                            return (
                                                <td key={city._id} className="ddlTopCitiesTD" align="left" valign="top">
                                                    <div title={city._city_name}>
                                                        <Link className="link-img-hotel" to={"/list-hotel/" +
                                                            city._id + "/" +
                                                            this.state._start_date + "/" +
                                                            this.state._end_date + "/"}>
                                                            {Object.keys(this.state._images).map((key_image) => {
                                                                if (key_image === city._id) {
                                                                    return <img key={key_image} className="img-thumbnail image-hotel" alt="" src={this.state._images[key_image]} />
                                                                }
                                                            })}
                                                        </Link>
                                                        <div className="CityName">
                                                            <a title={city._city_name} className="blue mihawk-list-hotel" href="#">{city._city_name}</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                    <tr>
                                        {this.state._row_cities_3 && this.state._row_cities_3.map(city => {
                                            return (
                                                <td key={city._id} className="ddlTopCitiesTD" align="left" valign="top">
                                                    <div title={city._city_name}>
                                                        <Link className="link-img-hotel" to={"/list-hotel/" +
                                                            city._id + "/" +
                                                            this.state._start_date + "/" +
                                                            this.state._end_date + "/"}>
                                                            {Object.keys(this.state._images).map((key_image) => {
                                                                if (key_image === city._id) {
                                                                    return <img key={key_image} className="img-thumbnail image-hotel" alt="" src={this.state._images[key_image]} />
                                                                }
                                                            })}
                                                        </Link>
                                                        <div className="CityName">
                                                            <a title={city._city_name} className="blue mihawk-list-hotel" href="#">{city._city_name}</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TopDestination;