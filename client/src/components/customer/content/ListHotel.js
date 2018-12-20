import React, { Component } from 'react';
import Favicon from 'react-favicon';
import Header from '../Header';
import '../../../css/customer/list_hotel.css';
import axios from 'axios';
import BookingDateLeft from '../BookingDataLeft';
import Footer from '../Footer';
import star5 from '../../../images/star-yellow-5.gif';
import star4 from '../../../images/star-yellow-4.gif';
import star3 from '../../../images/star-yellow-3.gif';
import star2 from '../../../images/star-yellow-2.gif';

var querystring = require('querystring');

class ListHotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _city_id: "",
            _address: "",
            _start_date: "",
            _end_date: "",
            hotels: null,
            currentPage: 1,
            hotelsPerPage: 5
        }
        this.state._city_id = this.props.match.params.city_id;
        this.state._address = this.props.match.params.address;
        this.state._start_date = this.props.match.params.start_date;
        this.state._end_date = this.props.match.params.end_date;
        this.getCityName();
        this.getHotelsByCity();
        this.countAllReviewHotel();
        this.countAllReviewHotel = this.countAllReviewHotel.bind(this);
        this.getHotelsByCity = this.getHotelsByCity.bind(this);
        this.getCityName = this.getCityName.bind(this);
        this.paginitionHandler = this.paginitionHandler.bind(this);
        this.bookRoomHandler = this.bookRoomHandler.bind(this);
        this.listHotelByCity = this.listHotelByCity.bind(this);
    }
    getHotelsByCity() {
        axios.post("http://localhost:8000/api/customer/getHotelsByCityId", querystring.stringify({
            '_city_id': this.state._city_id,
            '_address': this.state._address
        }))
            .then(result => {
                const indexOfLastTodo = this.state.currentPage * this.state.hotelsPerPage;
                const indexOfFirstTodo = indexOfLastTodo - this.state.hotelsPerPage;
                const currentTodos = result.data.hotels.slice(indexOfFirstTodo, indexOfLastTodo);
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(result.data.hotels.length / this.state.hotelsPerPage); i++) {
                    pageNumbers.push(i);
                }
                let _images = {};
                for (var key in result.data.images) {
                    const buffer = result.data.images[key].data;
                    const b64 = new Buffer(buffer).toString('base64');
                    const mimeType = "image/png";
                    _images[key] = `data:${mimeType};base64,${b64}`;
                }
                this.setState({
                    hotels: currentTodos,
                    images: _images,
                    pageNumbers: pageNumbers
                })
            });
    }
    getCityName() {
        axios.post("http://localhost:8000/api/customer/getCityById", querystring.stringify({
            '_city_id': this.state._city_id
        }))
            .then(result => {
                this.setState({ city: result.data })
            })
    }
    countAllReviewHotel() {
        axios.get("http://localhost:8000/api/general/countAllReviewHotel")
            .then(results => {
                this.setState({
                    list_count_hotel: results.data.count
                });
            })
    }
    paginitionHandler(e) {
        e.preventDefault();
        this.setState({
            currentPage: Number(e.target.id)
        });
        this.getHotelsByCity();
    }
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    listHotelByCity(e) {
        e.preventDefault();
        if (this.state._address === undefined) {
            window.location = "/list-hotel/" +
                this.state._city_id + "/" +
                this.state._start_date + "/" +
                this.state._end_date + "/";
        } else {
            window.location = "/list-hotel/" +
                this.state._city_id + "/" +
                this.state._address + "/" +
                this.state._start_date + "/" +
                this.state._end_date + "/";
        }
    }
    bookRoomHandler(e) {
        e.preventDefault();
        if (this.state._address === undefined) {
            window.location = "/book-room/" +
                e.target.value + "/" +
                this.state._city_id + "/" +
                this.state._start_date + "/" +
                this.state._end_date + "/";
        } else {
            window.location = "/book-room/" +
                e.target.value + "/" +
                this.state._city_id + "/" +
                this.state._address + "/" +
                this.state._start_date + "/" +
                this.state._end_date + "/";
        }
    }
    render() {
        return (
            <div>
                <Favicon url="../../../../../src/images/favicon.ico" />
                <Header />
                <div id="contentSearchHotel">
                    <div className="breadcrumbs">
                        <div className="container">
                            <ul className="list-inline list-breadcrumbs">
                                <span itemScope="" itemType="http://data-vocabulary.org/Breadcrumb">
                                    <a href="http://localhost:8080/" title="Booking room hotel" itemProp="url" className="mihawk-list-hotel">
                                        <span itemProp="title" style={{ marginRight: -5 }}>Home Page</span>
                                    </a>
                                </span>
                                <span style={{ color: '#86b817' }}>&nbsp; <i className="fa fa-angle-double-right"></i> &nbsp;</span>
                                <span itemScope="" itemType="http://data-vocabulary.org/Breadcrumb">
                                    <a href="#" title="Hotel" itemProp="url" className="mihawk-list-hotel">
                                        <span itemProp="title" style={{ marginRight: -5 }}>Hotel</span>
                                    </a>
                                </span>
                                <span style={{ color: '#86b817' }}>&nbsp; <i className="fa fa-angle-double-right"></i> &nbsp;</span>
                                <span itemScope="" itemType="http://data-vocabulary.org/Breadcrumb">
                                    <a href="/t.vung-tau.html" title={this.state.city && this.state.city._city_name} itemProp="url" className="mihawk-list-hotel">
                                        <span itemProp="title" style={{ marginRight: -5 }}>{this.state.city && this.state.city._city_name} Hotel</span>
                                    </a>
                                </span>
                            </ul>
                        </div>
                    </div>
                    <div role="main" className="main">
                        <div className="content-body container">
                            <div className="row">
                                <BookingDateLeft
                                    _city_id={this.state._city_id}
                                    _address={this.state._address}
                                    _start_date={this.state._start_date}
                                    _end_date={this.state._end_date} />
                                <div id="secondary" className="col-md-9 page-search-result">
                                    <div className="page-top" id="resultList">
                                        <h1>
                                            <a onClick={this.listHotelByCity}>{this.state.city && this.state.city._city_name} Hotel</a>
                                        </h1>
                                        <p>{this.state.city && this.state.city._description}</p>
                                    </div>
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
                                    <div id="search-result">
                                        <div className="page-top search-result">
                                            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                                                <a className="navbar-brand" href="#">Sort: </a>
                                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                                    <span className="navbar-toggler-icon"></span>
                                                </button>
                                                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                                    <ul className="navbar-nav">
                                                        <li className="nav-item">
                                                            <a className="nav-link" href="#">REVIEW <span className="sr-only">(current)</span></a>
                                                        </li>

                                                        <li className="nav-item dropdown">
                                                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">STANDARD</a>
                                                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                                <a className="dropdown-item" href="#">STANDARD 5-1</a>
                                                                <a className="dropdown-item" href="#">STANDARD 1-5</a>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </nav>
                                        </div>
                                        <div className="page-body">
                                            {this.state.hotels && this.state.hotels.map(hotel => {
                                                return (
                                                    <article key={hotel._id} className=" post-hotel-list-item hotel-item">
                                                        <div className="row-height">
                                                            <div className="post-thumbnail">
                                                                <a href="#" title="" >
                                                                    {Object.keys(this.state.images).map((key_image) => {
                                                                        if (key_image === hotel._id) {
                                                                            return <img key={key_image} src={this.state.images[key_image]} className="img-thumbnail image-hotel" alt=""></img>
                                                                        }
                                                                    })}
                                                                </a>
                                                            </div>
                                                            <div className="post-features">
                                                                <h2>
                                                                    <a title="" href="#" className="mihawk-detail-hotel">{hotel._hotel_name}</a>
                                                                </h2>
                                                                <div className="post-rating">
                                                                    <div className="post-rating-star">
                                                                        {
                                                                            hotel._star === 5 ?
                                                                                <img className="img-thumbnail star-rating" src={star5}></img> :
                                                                                hotel._star === 4 ?
                                                                                    <img className="img-thumbnail star-rating" src={star4}></img> :
                                                                                    hotel._star === 3 ?
                                                                                        <img className="img-thumbnail star-rating" src={star3}></img> :
                                                                                        <img className="img-thumbnail star-rating" src={star2}></img>
                                                                        }
                                                                    </div>
                                                                    <div className="post-rating-reviews">
                                                                        {this.state.list_count_hotel && Object.keys(this.state.list_count_hotel).map((key) => {
                                                                            if (key === hotel._id) {
                                                                                return (
                                                                                    <span key={key}>
                                                                                        <i className="fa fa-thumbs-up"></i>
                                                                                        <a>{this.state.list_count_hotel[key]} Reivews</a>
                                                                                    </span>
                                                                                )
                                                                            }
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <div className="post-location">
                                                                    <span>
                                                                        {hotel._address}
                                                                    </span>
                                                                </div>
                                                                <hr />
                                                                <div className="post-features-list">
                                                                    <ul className="list-unstyled list-icon">
                                                                        <li className="mrgb1x"><span className="label tag_listing_green">Free 1 child under 12 years old</span></li>
                                                                        <li className="mrgb1x"><span className="label tag_listing_green">Breakfast|Wifi Free</span></li>
                                                                    </ul>
                                                                </div>
                                                                <div className="col-hotel-post-link">
                                                                    <p className="hotel-post-link">
                                                                        <button
                                                                            className="btn btn-primary post-booking-room"
                                                                            value={hotel._id}
                                                                            onClick={this.bookRoomHandler}>Booking Room
                                                                        </button>
                                                                    </p>
                                                                </div>
                                                                <div className="col-hotel-price-assistance">
                                                                    <p className="hotel-price-assistance">
                                                                        Need advice? Please call
                                                                        <br />
                                                                        <a className="color-support">
                                                                            0{hotel._phone_number}
                                                                        </a>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </article>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default ListHotel;