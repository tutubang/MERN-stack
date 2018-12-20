import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
var querystring = require('querystring');

class ListTypeRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 0,
            error: "",
            success: "",
            hotels: null,
            type_rooms: null,
            currentPage: 1,
            typeRoomsPerPage: 5
        };
        this.getTypeRooms();
        this.getTypeRooms = this.getTypeRooms.bind(this);
        this.statusHandler = this.statusHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.paginitionHandler = this.paginitionHandler.bind(this);
    }
    getTypeRooms() {
        axios.post("http://localhost:8000/api/general/showAllData", querystring.stringify({
            '_type': "type_room"
        }))
            .then(res => {
                var hotels = [];
                for (let i = 0; i < res.data.hotels.length; i++) {
                    hotels.push(res.data.hotels[i]);
                }
                const indexOfLastTodo = this.state.currentPage * this.state.typeRoomsPerPage;
                const indexOfFirstTodo = indexOfLastTodo - this.state.typeRoomsPerPage;
                const currentTodos = res.data.type_rooms.slice(indexOfFirstTodo, indexOfLastTodo);
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(res.data.type_rooms.length / this.state.typeRoomsPerPage); i++) {
                    pageNumbers.push(i);
                }
                this.setState({
                    type_rooms: currentTodos,
                    length: res.data.type_rooms.length,
                    hotels: hotels,
                    pageNumbers: pageNumbers
                });
            });
    }
    paginitionHandler(e) {
        e.preventDefault();
        this.setState({
            currentPage: Number(e.target.id)
        });
        this.getTypeRooms();
    }
    statusHandler(e) {
        e.preventDefault();
        var confirm = window.confirm("All data of this type room will change! Are you sure?");
        if (confirm === true) {
            axios.post("http://localhost:8000/api/admin/statusHandler/" + e.target.value, querystring.stringify({
                '_type': "type_room"
            }))
                .then(res => {
                    if (res.data.success === false) {
                        this.setState({ error: res.data.message });
                    }
                    else {
                        this.setState({ success: res.data.message });
                        this.getTypeRooms();
                    }
                })
        }
    }
    changeHandler(e) {
        var _hotel_name = e.target.value;
        if (!_hotel_name) {
            this.getTypeRooms();
        } else {
            axios.post("http://localhost:8000/api/admin/searchDataByName", querystring.stringify({
                '_hotel_name': _hotel_name,
                '_type': "type_room"
            }))
                .then(type_rooms => { this.setState({ type_rooms: type_rooms.data, length: type_rooms.data.length }) });
        }
    }
    render() {
        return (
            <div>
                {this.state.error && <p className="alert alert-danger">{this.state.error}</p>}
                {this.state.success && <p className="alert alert-success">{this.state.success}</p>}
                <p className="alert alert-info">Total {this.state.length} type rooms!</p>
                <input
                    type="text"
                    className="form-control"
                    id="_type_room_name"
                    name="_type_room_name"
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
                <div className="table-responsive-sm">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Type Room</th>
                                <th>Hotel</th>
                                <th>Create date</th>
                                <th>Last update date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {this.state.type_rooms &&
                            this.state.type_rooms.map(type_room => {
                                return (
                                    <tbody key={type_room._id}>
                                        <tr>
                                            <td>{type_room._type_room_name}</td>
                                            {this.state.hotels && this.state.hotels.map(hotel => {
                                                return (
                                                    type_room._hotel_id === hotel._id &&
                                                    <td key={hotel._id}>{hotel._hotel_name}</td>
                                                )
                                            })}
                                            <td>{new Date(type_room._createAt).toLocaleString()}</td>
                                            <td>{new Date(type_room._updateAt).toLocaleString()}</td>
                                            <td>{type_room._status}</td>
                                            <td>
                                                {type_room._status === "active" ? <button
                                                    onClick={this.statusHandler}
                                                    type="button"
                                                    className="btn btn-danger"
                                                    value={type_room._id}>Deactive</button> :
                                                    <button
                                                        onClick={this.statusHandler}
                                                        type="button"
                                                        className="btn btn-danger"
                                                        value={type_room._id}>Active</button>
                                                }
                                                <br />
                                                <br />
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    value={type_room._id}>
                                                    <Link to={"/updateTypeRoom/" + type_room._id}>Update</Link>
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

export default ListTypeRoom;