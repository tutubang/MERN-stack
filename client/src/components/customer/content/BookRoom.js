import React, { Component } from 'react';
import Favicon from 'react-favicon';
import Header from '../Header';
import '../../../css/customer/book_room.css';
import axios from 'axios';
import BookingDateLeft from '../BookingDataLeft';
import $ from 'jquery';
import Footer from '../Footer';
import star5 from '../../../images/star-a-5.0.gif';
import star4 from '../../../images/star-a-4.0.gif';
import star3 from '../../../images/star-a-3.0.gif';
import star2 from '../../../images/star-a-2.0.gif';
import { Link } from "react-router-dom";
var querystring = require('querystring');

class BookRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _hotel_id: "",
            _city_id: "",
            _address_search: "",
            _start_date: "",
            _end_date: "",
            _hotel_name: "",
            _star: "",
            _phone_number: "",
            _address: "",
            _description: "",
            _check_in_time: "",
            _check_out_time: "",
            _regulations_check_in: "",
            _other_rule: "",
            _service_id: "",
            _images: null,
            error: null,
            valerrors: null,
            success: null,
            _full_name: "",
            _email: "",
            _content: "",
            _number_room: 0,
            _defaultNumber: 0
        }
        this.state._hotel_id = this.props.match.params.hotel_id;
        this.state._city_id = this.props.match.params.city_id;
        this.state._address_search = this.props.match.params.address;
        this.state._start_date = this.props.match.params.start_date;
        this.state._end_date = this.props.match.params.end_date;
        this.getCityName();
        this.getHotelById();
        this.getTypeRoomsByHotel();
        this.getReviewByHotel();
        this.countReviewHotel();
        this.getNumberRoom();
        this.getServiceTypeRoom();
        this.getServiceTypeRoom = this.getServiceTypeRoom.bind(this);
        this.getHotelById = this.getHotelById.bind(this);
        this.countReviewHotel = this.countReviewHotel.bind(this);
        this.getReviewByHotel = this.getReviewByHotel.bind(this);
        this.openReviewBox = this.openReviewBox.bind(this);
        this.getTypeRoomsByHotel = this.getTypeRoomsByHotel.bind(this);
        this.getCityName = this.getCityName.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.reviewHandler = this.reviewHandler.bind(this);
        this.getNumberRoom = this.getNumberRoom.bind(this);
        this.bookRoomHandler = this.bookRoomHandler.bind(this);
        this.detailsRoom = this.detailsRoom.bind(this);
        this.numberRoomChangeHandler = this.numberRoomChangeHandler.bind(this);
    }
    getHotelById() {
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._hotel_id, querystring.stringify({
            '_type': 'hotel'
        }))
            .then(result_hotel => {
                axios.post("http://localhost:8000/api/customer/getAllServices", querystring.stringify({
                    'service_type': 1
                }))
                    .then(result_service => {
                        var services_hotel = [];
                        var list_service_hotel = result_hotel.data.hotel._service_id.split(",");
                        for (let i = 0; i < result_service.data.services.length; i++) {
                            for (let j = 0; j < list_service_hotel.length; j++) {
                                if (list_service_hotel[j] === result_service.data.services[i]._id) {
                                    services_hotel.push(result_service.data.services[i]);
                                }
                            }
                        }
                        var part1 = services_hotel.slice(0, 10);
                        var part2 = services_hotel.slice(10, 20);
                        var part3 = services_hotel.slice(20, 30);
                        this.setState({
                            _column_services_1: part1,
                            _column_services_2: part2,
                            _column_services_3: part3,
                        })
                    })
                var images = [];
                for (let i = 0; i < result_hotel.data.image.length; i++) {
                    const buffer = result_hotel.data.image[i].data;
                    const b64 = new Buffer(buffer).toString('base64');
                    const mimeType = "image/png";
                    images.push(`data:${mimeType};base64,${b64}`);
                }
                this.setState({
                    _hotel_name: result_hotel.data.hotel._hotel_name,
                    _star: result_hotel.data.hotel._star,
                    _phone_number: result_hotel.data.hotel._phone_number,
                    _address: result_hotel.data.hotel._address,
                    _description: result_hotel.data.hotel._description,
                    _check_in_time: result_hotel.data.hotel._check_in_time,
                    _check_out_time: result_hotel.data.hotel._check_out_time,
                    _regulations_check_in: result_hotel.data.hotel._regulations_check_in,
                    _other_rule: result_hotel.data.hotel._other_rule,
                    _images: images
                });
            })
    }
    getServiceTypeRoom() {
        axios.post("http://localhost:8000/api/customer/getAllServices", querystring.stringify({
            'service_type': 2
        }))
            .then(result_service => {
                this.setState({
                    _list_service: result_service.data.services,
                })
            })
    }
    detailsRoom(e) {
        axios.post("http://localhost:8000/api/general/getDataById/" + e.target.name, querystring.stringify({
            '_type': 'type_room'
        }))
            .then(result_type_room => {
                axios.post("http://localhost:8000/api/customer/getAllServices", querystring.stringify({
                    'service_type': 2
                }))
                    .then(result_service => {
                        var services_type_room = [];
                        var list_service_type_room = result_type_room.data.type_room._service_id.split(",");
                        for (let i = 0; i < result_service.data.services.length; i++) {
                            for (let j = 0; j < list_service_type_room.length; j++) {
                                if (list_service_type_room[j] === result_service.data.services[i]._id) {
                                    services_type_room.push(result_service.data.services[i]);
                                }
                            }
                        }
                        var part1 = services_type_room.slice(0, 10);
                        var part2 = services_type_room.slice(10, 20);
                        var part3 = services_type_room.slice(20, 30);
                        this.setState({
                            _column_services_tr_1: part1,
                            _column_services_tr_2: part2,
                            _column_services_tr_3: part3,
                        })
                    })
            })
    }
    getTypeRoomsByHotel() {
        axios.post("http://localhost:8000/api/customer/getTypeRoomsByHotel", querystring.stringify({
            '_hotel_id': this.state._hotel_id
        })).then(results => {
            let _images = {};
            for (var key in results.data.images) {
                const buffer = results.data.images[key].data;
                const b64 = new Buffer(buffer).toString('base64');
                const mimeType = "image/png";
                _images[key] = `data:${mimeType};base64,${b64}`;
            }
            this.setState({
                type_rooms: results.data.type_rooms,
                _type_room_images: _images
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
    getReviewByHotel() {
        axios.post("http://localhost:8000/api/general/getReviewByHotel", querystring.stringify({
            '_hotel_id': this.state._hotel_id
        }))
            .then(results => {
                var review_slice = results.data.reviews.slice(0, 5)
                this.setState({ _reviews: review_slice })
            })
    }
    countReviewHotel() {
        axios.post("http://localhost:8000/api/general/countReviewHotel", querystring.stringify({
            '_hotel_id': this.state._hotel_id
        }))
            .then(results => {
                this.setState({ _count_review: results.data.count });
            })
    }
    getNumberRoom() {
        axios.post("http://localhost:8000/api/customer/getNumberRoomTypeRoom", querystring.stringify({
            '_hotel_id': this.state._hotel_id,
            '_start_date': this.state._start_date,
            '_end_date': this.state._end_date,
        }))
            .then(results => {
                this.setState({ _list_number_room: results.data });
            })
    }
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    numberRoomChangeHandler(e) {
        var id = e.target.id;
        var value = e.target.value;
        var name = e.target.name;
        axios.post("http://localhost:8000/api/customer/getTypeRoomsByHotel", querystring.stringify({
            '_hotel_id': this.state._hotel_id
        })).then(results => {
            var test = {};
            for (let i = 0; i < results.data.type_rooms.length; i++) {
                test[results.data.type_rooms[i]._id] = results.data.type_rooms[i]._id
            }
            for (var key in test) {
                if (test[key] === id) {
                    this.setState({
                        _defaultNumber: 0,
                        _type_room_id: name,
                        _number_room: value
                    });
                }
                else {
                    $('#' + test[key]).val(0);
                }
            }
        });
    }
    openReviewBox(e) {
        this.setState({
            _full_name: "",
            _email: "",
            _content: "",
            error: null,
            valerrors: null,
            success: null
        });
    }
    reviewHandler(e) {
        this.setState({
            error: null,
            valerrors: null,
            success: null
        });
        e.preventDefault()
        axios.post("http://localhost:8000/api/customer/addReviewHotel", querystring.stringify({
            '_full_name': this.state._full_name,
            '_email': this.state._email,
            '_content': this.state._content,
            '_hotel_id': this.state._hotel_id
        }))
            .then(res => {
                if (res.data.errors) {
                    return this.setState({ valerrors: res.data.errors });
                }
                else if (res.data.success === false) {
                    return this.setState({ error: res.data.message });
                }
                else {
                    alert(res.data.message);
                    location.reload();
                }
            })
    }
    bookRoomHandler(e) {
        this.setState({
            _number_room: 0,
            _type_room_id: ""
        })
        e.preventDefault();
        var number_room = this.state._number_room;
        var type_room_id = this.state._type_room_id;
        if (number_room === 0) {
            alert('Please select the number of rooms to book.');
        } else {
            window.location = "/info-customer/" +
                this.state._hotel_id + "/" +
                type_room_id + "/" +
                number_room + "/" +
                this.state._start_date + "/" +
                this.state._end_date;
        }
    }
    render() {
        return (
            <div>
                <Favicon url="../../../../../../src/images/favicon.ico" />
                <Header />
                <div id="contentBookRoom">
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
                                <span style={{ color: '#86b817' }}>&nbsp; <i className="fa fa-angle-double-right"></i> &nbsp;</span>
                                <span itemScope="" itemType="http://data-vocabulary.org/Breadcrumb">
                                    <a href="/t.vung-tau.html" title={this.state._hotel_name} itemProp="url" className="mihawk-list-hotel">
                                        <span itemProp="title" style={{ marginRight: -5 }}>{this.state._hotel_name && this.state._hotel_name}</span>
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
                                    _address={this.state._address_search}
                                    _start_date={this.state._start_date}
                                    _end_date={this.state._end_date} />
                                <div id="secondary" className="col-md-9 page-search-result">
                                    <div className="hotel-top">
                                        <div className="hotel-top-header post-rating">
                                            <h1 className="title">
                                                <a onClick={this.hotelDetails}>{this.state._hotel_name}</a>
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
                                    <div className="review">
                                        <a onClick={this.openReviewBox} className="btn btn-primary" data-toggle="modal" data-target="#myModal" href="#">Review</a>
                                    </div>
                                    <div className="modal fade" id="myModal">
                                        <div className="modal-dialog modal-lg modal-dialog-centered">
                                            <div className="modal-content">
                                                {/* <!-- Modal Header --> */}
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Reivews {this.state._hotel_name}</h4>
                                                    <button className="button" className="close" data-dismiss="modal">&times;</button>
                                                </div>
                                                {/* <!-- Modal body --> */}
                                                <div className="modal-body">
                                                    <form onSubmit={this.reviewHandler}>
                                                        <div className="form-group">
                                                            <label htmlFor="_full_name">Full name</label>
                                                            <input type="text"
                                                                className="form-control"
                                                                id="_full_name"
                                                                name="_full_name"
                                                                placeholder="Full name"
                                                                value={this.state._full_name}
                                                                onChange={this.changeHandler} />
                                                            <br />
                                                            {this.state.valerrors &&
                                                                this.state.valerrors._full_name && (
                                                                    <p className="errors">{this.state.valerrors._full_name.msg}</p>
                                                                )}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="_email">Email address</label>
                                                            <input type="email"
                                                                className="form-control"
                                                                name="_email" id="_email"
                                                                aria-describedby="emailHelp"
                                                                placeholder="Enter email"
                                                                value={this.state._email}
                                                                onChange={this.changeHandler} />
                                                            <br />
                                                            {this.state.valerrors &&
                                                                this.state.valerrors._email && (
                                                                    <p className="errors">{this.state.valerrors._email.msg}</p>
                                                                )}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="_content">Content</label>
                                                            <textarea className="form-control"
                                                                name="_content"
                                                                id="_content"
                                                                rows="3"
                                                                onChange={this.changeHandler}
                                                                value={this.state._content}
                                                            ></textarea>
                                                            <br />
                                                            {this.state.valerrors &&
                                                                this.state.valerrors._content && (
                                                                    <p className="errors">{this.state.valerrors._content.msg}</p>
                                                                )}
                                                        </div>
                                                        <button type="submit" className="btn btn-primary">Send</button>
                                                    </form>
                                                </div>
                                                {/* <!-- Modal footer --> */}
                                                <div className="modal-footer"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hotel-images">
                                        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                                            <ol className="carousel-indicators">
                                                {this.state._images && this.state._images.map(function (image, index) {
                                                    return (
                                                        index === 0 ?
                                                            <li key={index} data-target="#carouselExampleIndicators" data-slide-to={index} className="active" ></li>
                                                            :
                                                            <li key={index} data-target="#carouselExampleIndicators" data-slide-to={index}></li>
                                                    )
                                                })}
                                            </ol>
                                            <div className="carousel-inner">
                                                {this.state._images && this.state._images.map(function (image, index) {
                                                    return (
                                                        index === 0 ?
                                                            <div className="carousel-item active" key={index}>
                                                                <img className="d-block w-100" src={image} alt="First slide" />
                                                            </div> :
                                                            <div className="carousel-item" key={index}>
                                                                <img className="d-block w-100" src={image} alt="slide" />
                                                            </div>
                                                    )
                                                })}
                                            </div>
                                            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span className="sr-only">Previous</span>
                                            </a>
                                            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span className="sr-only">Next</span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="hotel-description">
                                        {/* <textarea className="text-des" value={this.state._description}
                                            readOnly></textarea> */}
                                        <p>{this.state._description}</p>
                                    </div>
                                    <div className="hotel-search-room">
                                        <div className="col-md-12 search-box">
                                            <div className="search">
                                                <form className="form-inline" id="searchForm" onSubmit={this.submitHandler}>
                                                    <div className="form-group mb-2">
                                                        <label className="label-search">Start date</label>
                                                        <input type="date"
                                                            className="form-control input-date"
                                                            min={this.state._date_now}
                                                            value={this.state._start_date}
                                                            id="_start_date"
                                                            name="_start_date"
                                                            title="Start date"
                                                            onChange={this.changeHandler} />
                                                    </div>
                                                    <div className="form-group mb-2">
                                                        <label className="label-search">End date</label>
                                                        <input type="date"
                                                            className="form-control input-date"
                                                            value={this.state._end_date}
                                                            min={this.state._date_now}
                                                            id="exampleInputEmail3"
                                                            id="_end_date"
                                                            name="_end_date"
                                                            title="End date"
                                                            onChange={this.changeHandler} />
                                                    </div>
                                                    <button id="btnSearch" type="submit" className="btn btn-primary mb-2">View room rates<i className="fa fa-search"></i></button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hotel-room-types">
                                        <div className="table-responsive">
                                            <form onSubmit={this.bookRoomHandler}>
                                                <table className="table">
                                                    <thead>
                                                        <tr className="table-title">
                                                            <th scope="col">Type room</th>
                                                            <th scope="col">Description</th>
                                                            <th scope="col">Number person</th>
                                                            <th scope="col">Number room</th>
                                                            <th scope="col">Price room $/night</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody >
                                                        {this.state.type_rooms &&
                                                            this.state.type_rooms.map(type_room => {
                                                                return (
                                                                    <tr key={type_room._id} className="table-content">
                                                                        <td>
                                                                            <p className="type-name">{type_room._type_room_name}</p>
                                                                            {Object.keys(this.state._type_room_images).map((key_image) => {
                                                                                if (key_image === type_room._id) {
                                                                                    return <img key={key_image} src={this.state._type_room_images[key_image]} className="img-thumbnail image-hotel" alt=""></img>
                                                                                }
                                                                            })}
                                                                            <a value={type_room._id} name={type_room._id} onClick={this.detailsRoom} className="details-room" data-toggle="modal" data-target="#detailsRoom" href="#">Details room</a>
                                                                            <div className="modal fade" id="detailsRoom">
                                                                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                                                                    <div className="modal-content">
                                                                                        {/* <!-- Modal Header --> */}
                                                                                        <div className="modal-header">
                                                                                            <h4 className="modal-title">Room details {type_room._type_room_name}</h4>
                                                                                            <button className="button" className="close" data-dismiss="modal">&times;</button>
                                                                                        </div>
                                                                                        {/* <!-- Modal body --> */}
                                                                                        <div className="modal-body">
                                                                                            <div className="form-group">
                                                                                                <label htmlFor="">Room photos (for reference only)</label>
                                                                                                {Object.keys(this.state._type_room_images).map((key_image) => {
                                                                                                    if (key_image === type_room._id) {
                                                                                                        return <img key={key_image} src={this.state._type_room_images[key_image]} className="img-thumbnail form-control image-hotel" alt=""></img>
                                                                                                    }
                                                                                                })}
                                                                                            </div>
                                                                                            <div className="form-group">
                                                                                                <label htmlFor="">Room Information (For reference only)</label>
                                                                                                <p className="description">{type_room._description}</p>
                                                                                            </div>
                                                                                            <div className="form-group">
                                                                                                <label htmlFor="">Facilities - Room service</label>
                                                                                                <div className="row">
                                                                                                    <div className="col">
                                                                                                        {this.state._column_services_tr_1 && this.state._column_services_tr_1.map(_column_service => {
                                                                                                            return (
                                                                                                                <div key={_column_service._id}>
                                                                                                                    <i className="fa fa-check-square-o"></i><span>{_column_service._service_name}</span><br />
                                                                                                                </div>
                                                                                                            )
                                                                                                        })}
                                                                                                    </div>
                                                                                                    <div className="col">
                                                                                                        {this.state._column_services_tr_2 && this.state._column_services_tr_2.map(_column_service => {
                                                                                                            return (
                                                                                                                <div key={_column_service._id}>
                                                                                                                    <i className="fa fa-check-square-o"></i><span>{_column_service._service_name}</span><br />
                                                                                                                </div>
                                                                                                            )
                                                                                                        })}
                                                                                                    </div>
                                                                                                    <div className="col">
                                                                                                        {this.state._column_services_tr_3 && this.state._column_services_tr_3.map(_column_service => {
                                                                                                            return (
                                                                                                                <div key={_column_service._id}>
                                                                                                                    <i className="fa fa-check-square-o"></i><span>{_column_service._service_name}</span><br />
                                                                                                                </div>
                                                                                                            )
                                                                                                        })}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        {/* <!-- Modal footer --> */}
                                                                                        <div className="modal-footer"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td><p className="description">{type_room._description}</p></td>
                                                                        <td><p className="person-number">{type_room._person_number} people</p></td>
                                                                        <td>
                                                                            {this.state._list_number_room && Object.keys(this.state._list_number_room).map((key) => {
                                                                                if (type_room._id === key) {
                                                                                    return <input key={key} type="number"
                                                                                        min="0"
                                                                                        max={this.state._list_number_room[key]}
                                                                                        name={key}
                                                                                        id={key}
                                                                                        defaultValue={this.state._defaultNumber}
                                                                                        onChange={this.numberRoomChangeHandler} />
                                                                                }
                                                                            })}
                                                                        </td>
                                                                        <td><p>{type_room._price}$</p></td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        <tr>
                                                            <th scope="col"></th>
                                                            <th scope="col"></th>
                                                            <th scope="col"></th>
                                                            <td scope="col"><button
                                                                id="btnSearch"
                                                                type="submit"
                                                                className="btn btn-info"
                                                            >Book Room</button></td>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="hotel-facilities">
                                        <h3 className="heading">Facilities - Hotel services</h3>
                                        <div className="row">
                                            <div className="col">
                                                {this.state._column_services_1 && this.state._column_services_1.map(_column_service => {
                                                    return (
                                                        <div key={_column_service._id}>
                                                            <i className="fa fa-check-square-o"></i><span>{_column_service._service_name}</span><br />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className="col">
                                                {this.state._column_services_2 && this.state._column_services_2.map(_column_service => {
                                                    return (
                                                        <div key={_column_service._id}>
                                                            <i className="fa fa-check-square-o"></i><span>{_column_service._service_name}</span><br />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className="col">
                                                {this.state._column_services_3 && this.state._column_services_3.map(_column_service => {
                                                    return (
                                                        <div key={_column_service._id}>
                                                            <i className="fa fa-check-square-o"></i><span>{_column_service._service_name}</span><br />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hotel-regulations">
                                        <h3 className="heading">DETERMINATION AND NOTICE OF {this.state._hotel_name}</h3>
                                        <div id="accordion">
                                            <div className="card">
                                                <div className="card-header" id="headingOne">
                                                    <h5 className="mb-0">
                                                        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                            Check in-out time</button>
                                                    </h5>
                                                </div>
                                                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <p className="check-in">Check-in: {this.state._check_in_time}</p>
                                                            <p className="check-out">Check-out: {this.state._check_out_time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="headingTwo">
                                                    <h5 className="mb-0">
                                                        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                            Regulations check in</button>
                                                    </h5>
                                                </div>
                                                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                                    <div className="card-body">
                                                        <p className="regulations-check-in">{this.state._regulations_check_in}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="headingThree">
                                                    <h5 className="mb-0">
                                                        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                            Other rule</button>
                                                    </h5>
                                                </div>
                                                <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                                                    <div className="card-body">
                                                        <p>{this.state._other_rule}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hotel-customer-reviews">
                                        <h3 className="heading">Review OF {this.state._hotel_name}</h3>
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
                                    <div className="view-all-review">
                                        <Link to={"/viewAllReviewHotel/" + this.state._hotel_id} className="review-detail">See all reviews of {this.state._hotel_name}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}
export default BookRoom;