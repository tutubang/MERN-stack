import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
var querystring = require('querystring');

class ListService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 0,
            error: "",
            success: "",
            services: null,
            currentPage: 1,
            servicePerPage: 5
        };
        this.getServices();
        this.getServices = this.getServices.bind(this);
        this.statusHandler = this.statusHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.paginitionHandler = this.paginitionHandler.bind(this);
    }
    getServices() {
        axios.post("http://localhost:8000/api/general/showAllData", querystring.stringify({
            '_type': "service"
        }))
            .then(services => {
                const indexOfLastTodo = this.state.currentPage * this.state.servicePerPage;
                const indexOfFirstTodo = indexOfLastTodo - this.state.servicePerPage;
                const currentTodos = services.data.slice(indexOfFirstTodo, indexOfLastTodo);
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(services.data.length / this.state.servicePerPage); i++) {
                    pageNumbers.push(i);
                }
                this.setState({
                    services: currentTodos,
                    length: services.data.length,
                    pageNumbers: pageNumbers
                });
            });
    }
    paginitionHandler(e) {
        e.preventDefault();
        this.setState({
            currentPage: Number(e.target.id)
        });
        this.getServices();
    }
    statusHandler(e) {
        e.preventDefault();
        axios.post("http://localhost:8000/api/admin/statusHandler/" + e.target.value, querystring.stringify({
            '_type': "service"
        }))
            .then(res => {
                if (res.data.success === false) {
                    this.setState({ error: res.data.message });
                }
                else {
                    this.setState({ success: res.data.message });
                    this.getServices();
                }
            })
    }
    changeHandler(e) {
        var _service_name = e.target.value;
        if (!_service_name) {
            this.getServices();
        } else {
            axios.post("http://localhost:8000/api/admin/searchDataByName", querystring.stringify({
                '_service_name': _service_name,
                '_type': "service"
            }))
                .then(services => {
                    const indexOfLastTodo = this.state.currentPage * this.state.servicePerPage;
                    const indexOfFirstTodo = indexOfLastTodo - this.state.servicePerPage;
                    const currentTodos = services.data.slice(indexOfFirstTodo, indexOfLastTodo);
                    const pageNumbers = [];
                    for (let i = 1; i <= Math.ceil(services.data.length / this.state.servicePerPage); i++) {
                        pageNumbers.push(i);
                    }
                    this.setState({
                        services: currentTodos,
                        length: services.data.length,
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
                <p className="alert alert-info">Total {this.state.length} services!</p>
                <input
                    type="text"
                    className="form-control"
                    id="_service_name"
                    name="_service_name"
                    placeholder="Search by service name"
                    onChange={this.changeHandler} />
                <br />
                <select className="form-control" onChange={this.sortByServiceType}>
                    <option defaultValue="0">Sort by service type</option>
                    <option value="0">All</option>
                    <option value="1">Hotel</option>
                    <option value="2">Type Room</option>
                </select>
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
                                <th>Service</th>
                                <th>Type</th>
                                <th>Create date</th>
                                <th>Last update date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {this.state.services &&
                            this.state.services.map(service => {
                                return (
                                    <tbody key={service._id}>
                                        <tr>
                                            <td>{service._service_name}</td>
                                            {service._service_type === 1 ?
                                                <td>Hotel</td> :
                                                <td>Type Room</td>
                                            }
                                            <td>{new Date(service._createAt).toLocaleString()}</td>
                                            <td>{new Date(service._updateAt).toLocaleString()}</td>
                                            <td>{service._status}</td>
                                            <td>
                                                {service._status === "active" ? <button
                                                    onClick={this.statusHandler}
                                                    type="button"
                                                    className="btn btn-danger"
                                                    value={service._id}>Deactive</button> :
                                                    <button
                                                        onClick={this.statusHandler}
                                                        type="button"
                                                        className="btn btn-danger"
                                                        value={service._id}>Active</button>
                                                }
                                                <br />
                                                <br />
                                                <button
                                                    onClick={this.updateHandler}
                                                    type="button"
                                                    className="btn btn-info"
                                                    value={service._id}>
                                                    <Link to={"/updateService/" + service._id}>Update</Link>
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

export default ListService;