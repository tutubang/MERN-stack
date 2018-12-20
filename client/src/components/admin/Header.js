import React, { Component } from 'react';
import axios from 'axios';
import '../../css/admin/navbar.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _username: ""
        }
        axios.get("http://localhost:8000/api/admin/isloggedin")
            .then(res => {
                return this.setState({ _username: res.data.accInfo });
            });
        this.logoutHandler = this.logoutHandler.bind(this);
    }
    logoutHandler(e) {
        e.preventDefault();
        axios.get("http://localhost:8000/api/admin/logout", this.state)
            .then(res => {
                if (res.data.isLoggedIn === false)
                    return (window.location = "/admin-login");
            });
    }
    render() {
        return ( 
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <button type="button" id="sidebarCollapse" className="btn btn-info">
                    <span>Menu</span>
                </button>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item dropdown">
                            {this.state._username && <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Hello, {this.state._username}!</a>}
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" onClick={this.changePasswordHandler} href="#">Change password</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" onClick={this.logoutHandler} href="#">Logout</a>
                            </div>
                        </li>

                    </ul>
                </div>
            </nav>
        )
    }
}

export default Header;