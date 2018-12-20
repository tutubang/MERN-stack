import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../../css/admin/navbar.css';

class Navbar extends Component {
    render() {
        return (
            <nav id="sidebar">
                <div className="sidebar-header">
                    <h3>Booking Room Manager</h3>
                </div>
                <ul className="list-unstyled components">
                    <li>
                        <Link replace to="/admin">Home</Link>
                    </li>
                    <li>
                        <a href="#citySubmenu" data-toggle="collapse" aria-expanded="false"
                            className="dropdown-toggle">Cities</a>
                        <ul className="collapse list-unstyled" id="citySubmenu">
                            <li>
                                <Link replace to="/showCity">List city</Link>
                            </li>
                            <li>
                                <Link replace to="/addCity">Add new city</Link>
                            </li>                           
                        </ul>
                    </li>
                    <li>
                        <a href="#hotelSubmenu" data-toggle="collapse" aria-expanded="false"
                            className="dropdown-toggle">Hotels</a>
                        <ul className="collapse list-unstyled" id="hotelSubmenu">
                            <li>
                                <Link replace to="/showHotel">List hotel</Link>
                            </li>
                            <li>
                                <Link replace to="/addHotel">Add new Hotel</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#typeRoomSubmenu" data-toggle="collapse" aria-expanded="false"
                            className="dropdown-toggle">Type Room</a>
                        <ul className="collapse list-unstyled" id="typeRoomSubmenu">
                            <li>
                                <Link replace to="/showTypeRoom">List type room</Link>
                            </li>
                            <li>
                                <Link replace to="/addTypeRoom">Add new type room</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#staffSubmenu" data-toggle="collapse" aria-expanded="false"
                            className="dropdown-toggle">Staff</a>
                        <ul className="collapse list-unstyled" id="staffSubmenu">
                            <li>
                                <Link replace to="/showStaff">List staffs</Link>
                            </li>
                            <li>
                                <Link replace to="/addStaff">Add new staffs</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#serviceSubmenu" data-toggle="collapse" aria-expanded="false"
                            className="dropdown-toggle">Services</a>
                        <ul className="collapse list-unstyled" id="serviceSubmenu">
                            <li>
                                <Link replace to="/showService">List service</Link>
                            </li>
                            <li>
                                <Link replace to="/addService">Add new service</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;