import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
var querystring = require('querystring');

class ListHotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 0,
            error: "",
            success: "",
            hotels: null,
            cities: null,
            currentPage: 1,
            hotelsPerPage: 5
        };
        this.getHotels();
        this.getHotels = this.getHotels.bind(this);
        this.statusHandler = this.statusHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.paginitionHandler = this.paginitionHandler.bind(this);
    }
    getHotels() {
        axios.post("http://localhost:8000/api/general/showAllData", querystring.stringify({
            '_type': "hotel"
        }))
            .then(res => {
                var cities = [];
                for (let i = 0; i < res.data.cities.length; i++) {
                    cities.push(res.data.cities[i]);
                }
                const indexOfLastTodo = this.state.currentPage * this.state.hotelsPerPage;
                const indexOfFirstTodo = indexOfLastTodo - this.state.hotelsPerPage;
                const currentTodos = res.data.hotels.slice(indexOfFirstTodo, indexOfLastTodo);
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(res.data.hotels.length / this.state.hotelsPerPage); i++) {
                    pageNumbers.push(i);
                }
                this.setState({
                    hotels: currentTodos,
                    length: res.data.hotels.length,
                    cities: cities,
                    pageNumbers: pageNumbers
                })
            }
            );
    }
    paginitionHandler(e) {
        e.preventDefault();
        this.setState({
            currentPage: Number(e.target.id)
        });
        this.getHotels();
    }
    statusHandler(e) {
        e.preventDefault();
        var confirm = window.confirm("All data of this hotel will change! Are you sure?");
        if (confirm === true) {
            axios.post("http://localhost:8000/api/admin/statusHandler/" + e.target.value, querystring.stringify({
                '_type': "hotel"
            })).then(res => {
                if (res.data.success === false) {
                    this.setState({ error: res.data.message });
                }
                else {
                    this.setState({ success: res.data.message });
                    this.getHotels();
                }
            })
        }
    }
    changeHandler(e) {
        var _hotel_name = e.target.value;
        if (!_hotel_name) {
            this.getHotels();
        } else {
            axios.post("http://localhost:8000/api/admin/searchDataByName", querystring.stringify({
                '_hotel_name': _hotel_name,
                '_type': "hotel"
            }))
                .then(hotels => {
                    const indexOfLastTodo = this.state.currentPage * this.state.hotelsPerPage;
                    const indexOfFirstTodo = indexOfLastTodo - this.state.hotelsPerPage;
                    const currentTodos = hotels.data.slice(indexOfFirstTodo, indexOfLastTodo);
                    const pageNumbers = [];
                    for (let i = 1; i <= Math.ceil(hotels.data.length / this.state.hotelsPerPage); i++) {
                        pageNumbers.push(i);
                    }
                    this.setState({
                        hotels: currentTodos,
                        length: hotels.data.length,
                        pageNumbers: pageNumbers
                    })
                });
        }
    }
    render() {
        return (
            <div>
                {this.state.error && <p className="alert alert-danger">{this.state.error}</p>}
                {this.state.success && <p className="alert alert-success">{this.state.success}</p>}
                <p className="alert alert-info">Total {this.state.length} hotels!</p>
                <input
                    type="text"
                    className="form-control"
                    id="_hotel_name"
                    name="_hotel_name"
                    placeholder="Search by hotel name"
                    onChange={this.changeHandler} />
                <br />
                <ul className="pagination">
                    {this.state.pageNumbers &&
                        this.state.pageNumbers.map(number => {
                            return (
                                number === this.state.currentPage ?
                                    <li key={number} className="page-item active">
                                        <a
                                            id={number}
                                            onClick={this.paginitionHandler}
                                            className="page-link"
                                            href="">{number}</a>
                                    </li> :
                                    <li key={number} className="page-item">
                                        <a
                                            id={number}
                                            onClick={this.paginitionHandler}
                                            className="page-link"
                                            href="">{number}</a>
                                    </li>
                            );
                        })}
                </ul>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Hotel</th>
                                <th>City</th>
                                <th>Address</th>
                                <th>Create date</th>
                                <th>Last update date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {this.state.hotels &&
                            this.state.hotels.map(hotel => {
                                return (
                                    <tbody key={hotel._id}>
                                        <tr>
                                            <td>{hotel._hotel_name}</td>
                                            {this.state.cities && this.state.cities.map(city => {
                                                return (
                                                    hotel._city_id === city._id &&
                                                    <td key={city._id}>{city._city_name}</td>
                                                )
                                            })}
                                            <td>{hotel._address}</td>
                                            <td>{new Date(hotel._createAt).toLocaleString()}</td>
                                            <td>{new Date(hotel._updateAt).toLocaleString()}</td>
                                            <td>{hotel._status}</td>
                                            <td>{hotel._status === "active" ? <button
                                                onClick={this.statusHandler}
                                                type="button"
                                                className="btn btn-danger"
                                                value={hotel._id}>Deactive</button> :
                                                <button
                                                    onClick={this.statusHandler}
                                                    type="button"
                                                    className="btn btn-danger"
                                                    value={hotel._id}>Active</button>
                                            }
                                                <br />
                                                <br />
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    value={hotel._id}>
                                                    <Link to={"/updateHotel/" + hotel._id}>Update</Link>
                                                </button>
                                                <br />
                                                <br />
                                                <button
                                                    type="button"
                                                    className="btn btn-succ"
                                                    value={hotel._id}>
                                                    <Link to={"/showReview/" + hotel._id}>Reviews</Link>
                                                </button>
                                                <br />
                                                <br />
                                                <button
                                                    type="button"
                                                    className="btn btn-success"
                                                    value={hotel._id}>
                                                    <Link to={"/showStatistic/" + hotel._id}>Statistic</Link>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                )
                            })}
                    </table>
                </div>
            </div>
        )
    }
}

export default ListHotel;