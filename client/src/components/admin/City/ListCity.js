import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
var querystring = require('querystring');

class ListCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 0,
            error: "",
            success: "",
            cities: null,
            currentPage: 1,
            citiesPerPage: 5
        };
        this.getCities();
        this.getCities = this.getCities.bind(this);
        this.statusHandler = this.statusHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.paginitionHandler = this.paginitionHandler.bind(this);
    }
    getCities() {
        axios.post("http://localhost:8000/api/general/showAllData", querystring.stringify({
            '_type': "city"
        }))
            .then(cities => {
                const indexOfLastTodo = this.state.currentPage * this.state.citiesPerPage;
                const indexOfFirstTodo = indexOfLastTodo - this.state.citiesPerPage;
                const currentTodos = cities.data.slice(indexOfFirstTodo, indexOfLastTodo);
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(cities.data.length / this.state.citiesPerPage); i++) {
                    pageNumbers.push(i);
                }
                this.setState({
                    cities: currentTodos,
                    length: cities.data.length,
                    pageNumbers: pageNumbers
                });
            });
    }
    paginitionHandler(e) {
        e.preventDefault();
        this.setState({
            currentPage: Number(e.target.id)
        });
        this.getCities();
    }
    statusHandler(e) {
        e.preventDefault();
        var confirm = window.confirm("All data of this city will change! Are you sure?");
        if (confirm === true) {
            axios.post("http://localhost:8000/api/admin/statusHandler/" + e.target.value, querystring.stringify({
                '_type': "city"
            })).then(res => {
                if (res.data.success === false) {
                    this.setState({ error: res.data.message });
                }
                else {
                    this.setState({ success: res.data.message });
                    this.getCities();
                }
            })
        }
    }
    changeHandler(e) {
        var _city_name = e.target.value;
        if (!_city_name) {
            this.getCities();
        } else {
            axios.post("http://localhost:8000/api/admin/searchDataByName", querystring.stringify({
                '_city_name': _city_name,
                '_type': "city"
            }))
                .then(cities => {
                    const indexOfLastTodo = this.state.currentPage * this.state.citiesPerPage;
                    const indexOfFirstTodo = indexOfLastTodo - this.state.citiesPerPage;
                    const currentTodos = cities.data.slice(indexOfFirstTodo, indexOfLastTodo);
                    const pageNumbers = [];
                    for (let i = 1; i <= Math.ceil(cities.data.length / this.state.citiesPerPage); i++) {
                        pageNumbers.push(i);
                    }
                    this.setState({
                        cities: currentTodos,
                        length: cities.data.length,
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
                <p className="alert alert-info">Total {this.state.length} cities!</p>
                <input
                    type="text"
                    className="form-control"
                    id="_city_name"
                    name="_city_name"
                    placeholder="Search by city name"
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
                                <th>City</th>
                                <th>Create date</th>
                                <th>Last update date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {this.state.cities &&
                            this.state.cities.map(city => {
                                return (
                                    <tbody key={city._id}>
                                        <tr>
                                            <td>{city._city_name}</td>
                                            <td>{new Date(city._createAt).toLocaleString()}</td>
                                            <td>{new Date(city._updateAt).toLocaleString()}</td>
                                            <td>{city._status}</td>
                                            <td>{city._status === "active" ? <button
                                                onClick={this.statusHandler}
                                                type="button"
                                                className="btn btn-danger"
                                                value={city._id}>Deactive</button> :
                                                <button
                                                    onClick={this.statusHandler}
                                                    type="button"
                                                    className="btn btn-danger"
                                                    value={city._id}>Active</button>
                                            }
                                                <br />
                                                <br />
                                                <button
                                                    onClick={this.updateHandler}
                                                    type="button"
                                                    className="btn btn-info"
                                                    value={city._id}>
                                                    <Link to={"/updateCity/" + city._id}>Update</Link>
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

export default ListCity;