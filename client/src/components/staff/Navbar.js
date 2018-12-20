import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _hotel_id: this.props.hotel_id,
            _staff_id: this.props.staff_id
        }
    }
    render() {
        return (
            <nav id="sidebar">
                <div className="sidebar-header">
                    <h3>Booking Room Manager</h3>
                </div>
                <ul className="list-unstyled components">
                    <li>
                        <Link replace to="/staff">Home</Link>
                    </li>
                    <li>
                        <a href="#ordersSubmenu" data-toggle="collapse" aria-expanded="false"
                            className="dropdown-toggle">Orders</a>
                        <ul className="collapse list-unstyled" id="ordersSubmenu">
                            <li>
                                <Link replace to={"/ordersCanceled/" + this.state._hotel_id + "/" + this.state._staff_id}>Orders canceled</Link>
                            </li>
                            <li>
                                <Link replace to={"/ordersWaiting/" + this.state._hotel_id + "/" + this.state._staff_id}>Orders waiting</Link>
                            </li>
                            <li>
                                <Link replace to={"/ordersHired/" + this.state._hotel_id + "/" + this.state._staff_id}>Orders hired</Link>
                            </li>
                            <li>
                                <Link replace to={"/ordersCheckedOut/" + this.state._hotel_id + "/" + this.state._staff_id}>Orders checked out</Link>
                            </li>
                            <li>
                                <Link replace to={"/ordersOutOfDate/" + this.state._hotel_id + "/" + this.state._staff_id}>Orders out of date</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#accountSubmenu" data-toggle="collapse" aria-expanded="false"
                            className="dropdown-toggle">Account</a>
                        <ul className="collapse list-unstyled" id="accountSubmenu">
                            <li>
                                <Link replace to={"/changeInfo/" + this.state._staff_id}>Change information</Link>
                            </li>
                            <li>
                                <Link replace to={"/changePass/" + this.state._staff_id}>Change password</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;