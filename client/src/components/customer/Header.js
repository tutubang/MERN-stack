import React, { Component } from 'react';
import '../../css/customer/header.css';
import logo from '../../images/logo.jpg';
class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="menu-head-top row align-items-start">
                </div>
                <div className="menu-head-end row align-items-end">
                    <div className="container">
                        <div className="row">
                            <nav className="navbar navbar-expand-lg navbar-light bg-light main-menu">
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                                    <div className="col-xl-2 col-xs-12">
                                        <a className="navbar-brand" href="http://localhost:8080/" title="Khách Sạn, Đánh Giá, Khuyến Mãi">
                                            <img className="img-fluid" alt="Khách Sạn, Đánh Giá, Khuyến Mãi" src={logo} />
                                        </a>
                                    </div>
                                    <div className="col-xl-7 col-xs-12 nav-main">
                                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                                            <li className="nav-item">
                                                <a className="nav-link" href="http://localhost:8080/">HOME PAGE</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="/top-destination">HOTELS</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">TRAVEL</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">VIDEO</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">EVALUATE</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">ABOUTS US</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-xl-3 col-xs-12 contact">
                                        <div className="block-text">
                                            <div className="row">
                                                <h3>
                                                    <i className="fa fa-phone" aria-hidden="true"></i>
                                                    <span id="contact">CONTACT</span>
                                                </h3>
                                                <div className="text-content">
                                                    <p className="small"><b>admin: 0869 773 517</b></p>
                                                    <p className="small">support: 0367 909 317</p>
                                                    <p className="small">skype: tubang96</p>
                                                    <p className="small">greenhouse_123@gmail.com</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>             
            </div>
        )
    }
}

export default Header;