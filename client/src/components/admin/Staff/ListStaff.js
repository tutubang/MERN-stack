import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
var querystring = require('querystring');

class ListStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 0,
            error: "",
            success: "",
            staffs: null,
            currentPage: 1,
            staffsPerPage: 5
        };
        this.getStaffs();
        this.getStaffs = this.getStaffs.bind(this);
        this.statusHandler = this.statusHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.paginitionHandler = this.paginitionHandler.bind(this);
    }
    getStaffs() {
        axios.post("http://localhost:8000/api/general/showAllData", querystring.stringify({
            '_type': "staff"
        }))
            .then(res => {
                var hotels = [];
                for (let i = 0; i < res.data.hotels.length; i++) {
                    hotels.push(res.data.hotels[i]);
                }
                const indexOfLastTodo = this.state.currentPage * this.state.staffsPerPage;
                const indexOfFirstTodo = indexOfLastTodo - this.state.staffsPerPage;
                const currentTodos = res.data.staffs.slice(indexOfFirstTodo, indexOfLastTodo);
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(res.data.staffs.length / this.state.staffsPerPage); i++) {
                    pageNumbers.push(i);
                }
                this.setState({
                    staffs: currentTodos,
                    length: res.data.staffs.length,
                    hotels: hotels,
                    pageNumbers: pageNumbers
                })
            });
    }
    paginitionHandler(e) {
        e.preventDefault();
        this.setState({
            currentPage: Number(e.target.id)
        });
        this.getStaffs();
    }
    statusHandler(e) {
        e.preventDefault();
        axios.post("http://localhost:8000/api/admin/statusHandler/" + e.target.value, querystring.stringify({
            '_type': "staff"
        }))
            .then(res => {
                if (res.data.success === false) {
                    this.setState({ error: res.data.message });
                }
                else {
                    this.setState({ success: res.data.message });
                    this.getStaffs();
                }
            })
    }
    changeHandler(e) {
        var _firstname = e.target.value;
        if (!_firstname) {
            this.getStaffs();
        } else {
            axios.post("http://localhost:8000/api/admin/searchDataByName", querystring.stringify({
                '_firstname': _firstname,
                '_type': "staff"
            }))
                .then(staff => { this.setState({ staffs: staff.data, length: staff.data.length }) });
        }
    }
    render() {
        return (
            <div>
                {this.state.error && <p className="alert alert-danger">{this.state.error}</p>}
                {this.state.success && <p className="alert alert-success">{this.state.success}</p>}
                <p className="alert alert-info">Total {this.state.length} staffs!</p>
                <input
                    type="text"
                    className="form-control"
                    id="_firstname"
                    name="_firstname"
                    placeholder="Search by first name"
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
                                <th>Full name</th>
                                <th>Hotel name</th>
                                <th>Email</th>
                                <th>Create date</th>
                                <th>Last update date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {this.state.staffs &&
                            this.state.staffs.map(staff => {
                                return (
                                    <tbody key={staff._id}>
                                        <tr>
                                            <td>{staff._firstname} {staff._lastname}</td>
                                            {this.state.hotels && this.state.hotels.map(hotel => {
                                                return (
                                                    staff._hotel_id === hotel._id &&
                                                    <td key={hotel._id}>{hotel._hotel_name}</td>
                                                )
                                            })}
                                            <td>{staff._email}</td>
                                            <td>{new Date(staff._createdAt).toLocaleString()}</td>
                                            <td>{new Date(staff._updatedAt).toLocaleString()}</td>
                                            <td>{staff._status}</td>
                                            <td>
                                                {staff._status === "active" ? <button
                                                    onClick={this.statusHandler}
                                                    type="button"
                                                    className="btn btn-danger"
                                                    value={staff._id}>Deactive</button> :
                                                    <button
                                                        onClick={this.statusHandler}
                                                        type="button"
                                                        className="btn btn-danger"
                                                        value={staff._id}>Active</button>
                                                }
                                                <br />
                                                <br />
                                                <button
                                                    onClick={this.updateHandler}
                                                    type="button"
                                                    className="btn btn-info"
                                                    value={staff._id}>
                                                    <Link to={"/updateStaff/" + staff._id}>Update</Link>
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

export default ListStaff;