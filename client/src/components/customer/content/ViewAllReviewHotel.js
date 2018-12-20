import React, { Component } from 'react';
import Favicon from 'react-favicon';
import Header from '../Header';
import Footer from '../Footer';
import axios from 'axios';
var querystring = require('querystring');
import star5 from '../../../images/star-a-5.0.gif';
import star4 from '../../../images/star-a-4.0.gif';
import star3 from '../../../images/star-a-3.0.gif';
import star2 from '../../../images/star-a-2.0.gif';
import '../../../css/customer/view_review.css';

class ViewAllReviewHotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _hotel_id: "",
            _address: "",
            _description: "",
            currentPage: 1,
            reviewsPerPage: 5,
            _reviews: null
        }
        this.state._hotel_id = this.props.match.params.hotel_id;
        this.getReviewByHotel();
        this.countReviewHotel();
        this.getHotelById();
        this.getHotelById = this.getHotelById.bind(this);
        this.countReviewHotel = this.countReviewHotel.bind(this);
        this.getReviewByHotel = this.getReviewByHotel.bind(this);
        this.paginitionHandler = this.paginitionHandler.bind(this);
    }
    getHotelById() {
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._hotel_id, querystring.stringify({
            '_type': 'hotel'
        }))
            .then(result_hotel => {
                this.setState({
                    _hotel_name: result_hotel.data.hotel._hotel_name,
                    _star: result_hotel.data.hotel._star,
                    _address: result_hotel.data.hotel._address,
                    _description: result_hotel.data.hotel._description
                });
            })
    }
    getReviewByHotel() {
        axios.post("http://localhost:8000/api/general/getReviewByHotel", querystring.stringify({
            '_hotel_id': this.state._hotel_id
        }))
            .then(results => {
                const indexOfLastTodo = this.state.currentPage * this.state.reviewsPerPage;
                const indexOfFirstTodo = indexOfLastTodo - this.state.reviewsPerPage;
                const currentTodos = results.data.reviews.slice(indexOfFirstTodo, indexOfLastTodo);
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(results.data.reviews.length / this.state.reviewsPerPage); i++) {
                    pageNumbers.push(i);
                }
                this.setState({
                    _reviews: currentTodos,
                    pageNumbers: pageNumbers,
                });
            })
    }
    paginitionHandler(e) {
        e.preventDefault();
        this.setState({
            currentPage: Number(e.target.id)
        });
        this.getReviewByHotel();
    }
    countReviewHotel() {
        axios.post("http://localhost:8000/api/general/countReviewHotel", querystring.stringify({
            '_hotel_id': this.state._hotel_id
        }))
            .then(results => {
                this.setState({ _count_review: results.data.count });
            })
    }
    render() {
        return (
            <div>
                <Favicon url="../src/images/favicon.ico" />
                <Header />
                <div id="contentReviewHotel">
                    <div role="main" className="main">
                        <div className="content-body container">
                            <div className="row">
                                <div id="primary" className="col-md-3 sidebar-snippets">
                                    <div className="snippet search-panel">
                                        <h3 className="snippet-title">HOTEL INFORMATION</h3>
                                        <div className="snippet-content">
                                            <p className="description">{this.state._description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div id="secondary" className="col-md-9 page-search-result">
                                    <div className="hotel-top">
                                        <div className="hotel-top-header post-rating">
                                            <h1 className="title">
                                                <a onClick={this.hotelDetails}>Reviews of {this.state._hotel_name}</a>
                                            </h1>
                                            <span className="star HotelRating">
                                                {
                                                    this.state._star === 5 ?
                                                        <img className="img-thumbnail star-rating" src={star5} alt={this.state._hotel_name}></img> :
                                                        this.state._star === 4 ?
                                                            <img className="img-thumbnail star-rating" src={star4} alt={this.state._hotel_name}></img> :
                                                            this.state._star === 3 ?
                                                                <img className="img-thumbnail star-rating" src={star3} alt={this.state._hotel_name}></img> :
                                                                <img className="img-thumbnail star-rating" src={star2} alt={this.state._hotel_name}></img>
                                                }
                                                <br />
                                                <p className="divStarRating">
                                                    <span>(Provided by the hotel)</span>
                                                </p>
                                            </span>
                                            <div className="caption">
                                                <span>
                                                    <i className="fa fa-thumbs-up"></i>
                                                    <a className="divReviewRating">{this.state._count_review} Reivews</a>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="hotel-top-address">
                                            <p>{this.state._address}</p>
                                        </div>
                                        <hr />
                                    </div>
                                    <div className="hotel-customer-reviews">
                                        <div className="left"><h2>{this.state._count_review} guests reviewed the hotel</h2></div>
                                        {this.state._reviews && this.state._reviews.map(review => {
                                            return (
                                                <div key={review._id} className="list-rate">
                                                    <div className="listrote">
                                                        <div className="row">
                                                            <div className="customer col-3">
                                                                <span className="nameauthor">{review._full_name}</span>
                                                                <br />
                                                                <span className="date"><em>{new Date(review._createAt).toLocaleString()}</em></span>
                                                            </div>
                                                            <div className="customercm col">
                                                                <a href="//khachsan.chudu24.com/ks.892.khach-san-pan-pacific-hanoi.danh-gia.214923.danh-gia-khach-san-pan-pacific-hanoi.html">
                                                                    <span className="green">Review of {this.state._hotel_name}</span></a>
                                                                <br />
                                                                <span className="content">"{review._content}"</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="review-pagination">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default ViewAllReviewHotel;