import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
var querystring = require('querystring');

class OrdersWaiting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 0,
            error: "",
            success: "",
            orders: null,
            currentPage: 1,
            ordersPerPage: 5,
            _hotel_id: "",
            _staff_id: ""
        }
        this.state._hotel_id = this.props.match.params.hotel_id;
        this.state._staff_id = this.props.match.params.staff_id;
        this.getOrdersWaiting();
        this.getTypeRomeByHotel();
        this.getCustomer();
        this.getCustomer = this.getCustomer.bind(this);
        this.getTypeRomeByHotel = this.getTypeRomeByHotel.bind(this);
        this.getOrdersWaiting = this.getOrdersWaiting.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.confirmHire = this.confirmHire.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
    }
    getOrdersWaiting() {
        axios.post("http://localhost:8000/api/staff/getOrders", querystring.stringify({
            '_status': "Waiting",
            '_hotel_id': this.state._hotel_id
        }))
            .then(results => {
                const indexOfLastTodo = this.state.currentPage * this.state.ordersPerPage;
                const indexOfFirstTodo = indexOfLastTodo - this.state.ordersPerPage;
                const currentTodos = results.data.orders.slice(indexOfFirstTodo, indexOfLastTodo);
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(results.data.orders.length / this.state.ordersPerPage); i++) {
                    pageNumbers.push(i);
                }
                this.setState({
                    orders: currentTodos,
                    length: results.data.orders.length,
                    pageNumbers: pageNumbers
                });
            })
    }
    getCustomer() {
        axios.post("http://localhost:8000/api/general/showAllData", querystring.stringify({
            '_type': 'customer'
        }))
            .then(results => {
                this.setState({
                    customers: results.data.customers
                })
            })
    }
    getTypeRomeByHotel() {
        axios.post("http://localhost:8000/api/staff/getTypeRoomsByHotel", querystring.stringify({
            '_hotel_id': this.state._hotel_id
        }))
            .then(results => {
                this.setState({
                    type_rooms: results.data.type_rooms
                })
            })
    }
    paginitionHandler(e) {
        e.preventDefault();
        this.setState({
            currentPage: Number(e.target.id)
        });
        this.getCities();
    }
    changeHandler(e) {
        var order_id = e.target.value;
        if (!order_id) {
            this.getOrdersWaiting();
        } else {
            axios.post("http://localhost:8000/api/staff/searchOrders", querystring.stringify({
                '_order_id': order_id,
                '_status': 'Waiting'
            }))
                .then(orders => {
                    const indexOfLastTodo = this.state.currentPage * this.state.ordersPerPage;
                    const indexOfFirstTodo = indexOfLastTodo - this.state.ordersPerPage;
                    const currentTodos = orders.data.slice(indexOfFirstTodo, indexOfLastTodo);
                    const pageNumbers = [];
                    for (let i = 1; i <= Math.ceil(orders.data.length / this.state.ordersPerPage); i++) {
                        pageNumbers.push(i);
                    }
                    this.setState({
                        orders: currentTodos,
                        length: orders.data.length,
                        pageNumbers: pageNumbers
                    })
                });
        }
    }
    confirmHire(e) {
        e.preventDefault();
        axios.post("http://localhost:8000/api/staff/handlerOrders", querystring.stringify({
            '_order_id': e.target.value,
            '_staff_id': this.state._staff_id,
            '_handler': 'Confirm Hired'
        })).then(results => {
            if (results.data.success === false) {
                alert(results.data.message);
                window.location.reload();
            }
            else {
                alert(results.data.message);
                window.location.reload();
            }
        })
    }
    cancelOrder(e) {
        e.preventDefault();
        axios.post("http://localhost:8000/api/staff/handlerOrders", querystring.stringify({
            '_order_id': e.target.value,
            '_staff_id': this.state._staff_id,
            '_handler': 'Cancel'
        })).then(results => {
            if (results.data.success === false) {
                alert(results.data.message);
                window.location.reload();
            }
            else {
                alert(results.data.message);
                window.location.reload();
            }
        })
    }
    render() {
        return (
            <div>
                <p className="alert alert-info">Total {this.state.length} orders Waiting!</p>
                <input
                    type="text"
                    className="form-control"
                    id="_order_id"
                    name="_order_id"
                    placeholder="Search by order id"
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
                                <th>Order id</th>
                                <th>Check in date</th>
                                <th>Check out date</th>
                                <th>Number room</th>
                                <th>Total price</th>
                                <th>Customer</th>
                                <th>Type room</th>
                                <th>Status</th>
                                <th>ACtion</th>
                            </tr>
                        </thead>
                        {this.state.orders &&
                            this.state.orders.map(order => {
                                return (
                                    <tbody key={order._id}>
                                        <tr>
                                            <td>{order._order_id}</td>
                                            <td>{order._check_in_date}</td>
                                            <td>{order._check_out_date}</td>
                                            <td>{order._number_room}</td>
                                            <td>{order._total_price}</td>
                                            {this.state.customers && this.state.customers.map(customer => {
                                                return (
                                                    order._customer_id === customer._id &&
                                                    <td key={customer._id}><Link to={"/infoCustomer/" + customer._id}>{customer._full_name}</Link></td>
                                                )
                                            })}
                                            {this.state.type_rooms && this.state.type_rooms.map(type_room => {
                                                return (
                                                    order._type_room_id === type_room._id &&
                                                    <td key={type_room._id}><Link to={"/info-type-room/" + type_room._id}>{type_room._type_room_name}</Link></td>
                                                )
                                            })}
                                            <td>{order._status}</td>
                                            <td><button
                                                onClick={this.confirmHire}
                                                type="button"
                                                className="btn btn-info"
                                                value={order._id}>Confirm Hire</button>
                                                <br />
                                                <br />
                                                <button
                                                    onClick={this.cancelOrder}
                                                    type="button"
                                                    className="btn btn-danger"
                                                    value={order._id}>Cancel</button>
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

export default OrdersWaiting;