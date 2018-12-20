import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
var querystring = require('querystring');

class ListReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _hotel_id: "",
            length: 0,
            error: "",
            success: "",
            reviews: null,
            reviews: null,
            currentPage: 1,
            typeRoomsPerPage: 5
        };
        this.state._hotel_id = this.props.match.params._id;
        this.gerReviewByHotel();
        this.getHotel();
        this.getHotel = this.getHotel.bind(this);
        this.gerReviewByHotel = this.gerReviewByHotel.bind(this);
        this.statusHandler = this.statusHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.paginitionHandler = this.paginitionHandler.bind(this);
    }
    gerReviewByHotel() {
        axios.post("http://localhost:8000/api/general/showAllData", querystring.stringify({
            '_type': 'review',
            '_hotel_id': this.state._hotel_id
        }))
            .then(res => {
                var reviews = [];
                for (let i = 0; i < res.data.reviews.length; i++) {
                    reviews.push(res.data.reviews[i]);
                }
                const indexOfLastTodo = this.state.currentPage * this.state.typeRoomsPerPage;
                const indexOfFirstTodo = indexOfLastTodo - this.state.typeRoomsPerPage;
                const currentTodos = res.data.reviews.slice(indexOfFirstTodo, indexOfLastTodo);
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(res.data.reviews.length / this.state.typeRoomsPerPage); i++) {
                    pageNumbers.push(i);
                }
                this.setState({
                    reviews: currentTodos,
                    length: res.data.reviews.length,
                    reviews: reviews,
                    pageNumbers: pageNumbers
                });
            });
    }
    getHotel() {
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._hotel_id, querystring.stringify({
            '_type': "hotel"
        }))
            .then((result) => {          
                this.setState({
                    _hotel_name: result.data.hotel._hotel_name       
                })
            });
    }
    paginitionHandler(e) {
        e.preventDefault();
        this.setState({
            currentPage: Number(e.target.id)
        });
        this.gerReviewByHotel();
    }
    statusHandler(e) {
        e.preventDefault();
        var confirm = window.confirm("All data of this type room will change! Are you sure?");
        if (confirm === true) {
            axios.post("http://localhost:8000/api/admin/statusHandler/" + e.target.value, querystring.stringify({
                '_type': "review"
            }))
                .then(res => {
                    if (res.data.success === false) {
                        this.setState({ error: res.data.message });
                    }
                    else {
                        this.setState({ success: res.data.message });
                        this.gerReviewByHotel();
                    }
                })
        }
    }
    changeHandler(e) {
        var _email = e.target.value;
        if (!_email) {
            this.gerReviewByHotel();
        } else {
            axios.post("http://localhost:8000/api/admin/searchDataByName", querystring.stringify({
                '_email': _email,
                '_type': "review"
            }))
                .then(reviews => { this.setState({ reviews: reviews.data, length: reviews.data.length }) });
        }
    }
    render() {
        return (
            <div>
                {this.state.error && <p className="alert alert-danger">{this.state.error}</p>}
                {this.state.success && <p className="alert alert-success">{this.state.success}</p>}
                <p className="alert alert-info">Total {this.state.length} reviews of {this.state._hotel_name}!</p>
                <input
                    type="text"
                    className="form-control"
                    id="_email"
                    name="_email"
                    placeholder="Search by email"
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
                <div className="table-responsive-sm">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Customer name</th>
                                <th>Email</th>
                                <th>Content</th>
                                <th>Create date</th>
                                <th>Last update date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {this.state.reviews &&
                            this.state.reviews.map(review => {
                                return (
                                    <tbody key={review._id}>
                                        <tr>
                                            <td>{review._full_name}</td>
                                            <td>{review._email}</td>
                                            <td>{review._content}</td>
                                            <td>{new Date(review._createAt).toLocaleString()}</td>
                                            <td>{new Date(review._updateAt).toLocaleString()}</td>
                                            <td>{review._status}</td>
                                            <td>
                                                {review._status === "active" ? <button
                                                    onClick={this.statusHandler}
                                                    type="button"
                                                    className="btn btn-danger"
                                                    value={review._id}>Deactive</button> :
                                                    <button
                                                        onClick={this.statusHandler}
                                                        type="button"
                                                        className="btn btn-danger"
                                                        value={review._id}>Active</button>
                                                }
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

export default ListReview;