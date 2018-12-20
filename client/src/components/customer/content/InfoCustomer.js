import React, { Component } from 'react';
import Favicon from 'react-favicon';
import Header from '../Header';
import axios from 'axios';
var querystring = require('querystring');
import '../../../css/customer/info_customer.css';
import Footer from '../Footer';
import $ from 'jquery';
import star5 from '../../../images/star-yellow-5.gif';
import star4 from '../../../images/star-yellow-4.gif';
import star3 from '../../../images/star-yellow-3.gif';
import star2 from '../../../images/star-yellow-2.gif';


class InfoCustomer extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        var dd_today = today.getDate();
        var mm_today = today.getMonth() + 1;
        var yyyy_today = today.getFullYear();
        if (dd_today < 10) {
            dd_today = '0' + dd_today;
        }
        if (mm_today < 10) {
            mm_today = '0' + mm_today;
        }
        var date_now = yyyy_today + '-' + mm_today + '-' + dd_today;
        this.state = {
            _hotel_id: "",
            _type_room_id: "",
            _number_room: "",
            _start_date: "",
            _end_date: "",
            _price: 0,
            _number_night: 0,
            _date_now: date_now,
            _check_box: false,
            error: null,
            valerrors: null,
            success: null
        }
        this.state._hotel_id = this.props.match.params.hotel_id;
        this.state._type_room_id = this.props.match.params.type_room_id;
        this.state._number_room = this.props.match.params.number_room;
        this.state._start_date = this.props.match.params.start_date;
        this.state._end_date = this.props.match.params.end_date;
        this.state._number_night = this.dateDiff(this.parseDate(this.state._start_date), this.parseDate(this.state._end_date));
        this.getHotelById();
        this.getNumberRoom(this.state._start_date, this.state._end_date);
        this.countReviewHotel();
        this.getTypeRoomById();
        this.totalPrice = this.totalPrice.bind(this);
        this.getTypeRoomById = this.getTypeRoomById.bind(this);
        this.countReviewHotel = this.countReviewHotel.bind(this);
        this.dateDiff = this.dateDiff.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.startDateChangeHandler = this.startDateChangeHandler.bind(this);
        this.endDateChangeHandler = this.endDateChangeHandler.bind(this);
        this.getHotelById = this.getHotelById.bind(this);
        this.getNumberRoom = this.getNumberRoom.bind(this);
        this.getCityName = this.getCityName.bind(this);
        this.numberRoomChangeHandler = this.numberRoomChangeHandler.bind(this);
        this.checkBoxHandler = this.checkBoxHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    getHotelById() {
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._hotel_id, querystring.stringify({
            '_type': "hotel"
        }))
            .then(result => {
                var images = [];
                for (let i = 0; i < result.data.image.length; i++) {
                    const buffer = result.data.image[i].data;
                    const b64 = new Buffer(buffer).toString('base64');
                    const mimeType = "image/png";
                    images.push(`data:${mimeType};base64,${b64}`);
                }
                this.setState({
                    _hotel_name: result.data.hotel._hotel_name,
                    _hotel_star: result.data.hotel._star,
                    _images: images
                })
                this.getCityName(result.data.hotel._city_id)
            })
    }
    getTypeRoomById() {
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._type_room_id, querystring.stringify({
            '_type': "type_room"
        }))
            .then(result => {
                this.setState({
                    _type_room_name: result.data.type_room._type_room_name,
                    _price: result.data.type_room._price,
                });
                this.totalPrice(this.state._number_room, this.state._number_night, result.data.type_room._price);
            })
    }
    getCityName(_city_id) {
        axios.post("http://localhost:8000/api/customer/getCityById", querystring.stringify({
            '_city_id': _city_id
        }))
            .then(result => {
                this.setState({ city: result.data })
            })
    }
    getNumberRoom(start_date, end_date) {
        console.log(start_date);
        console.log(end_date);
        axios.post("http://localhost:8000/api/customer/getNumberRoomTypeRoom", querystring.stringify({
            '_type_room_id': this.state._type_room_id,
            '_start_date': start_date,
            '_end_date': end_date,
        }))
            .then(results => {
                if (results.data.error === true) {
                    alert(results.data.message);
                    location.reload();
                } else {
                    this.setState({ _list_number_room: results.data });
                }
            })
    }
    dateDiff(first, second) {
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }
    parseDate(str) {
        let ymd = str.split('-');
        return new Date(ymd[0], ymd[1] - 1, ymd[2]);
    }
    startDateChangeHandler(e) {
        if (e.target.value < this.state._date_now) {
            alert('Start date less than date now!')
            $('#start_date').val(this.state._start_date);
        } else {
            this.setState({
                _start_date: e.target.value
            });
            let split_ymd_start_date = e.target.value.split("-");
            var ymd_start_date = new Date(split_ymd_start_date[0], split_ymd_start_date[1] - 1, split_ymd_start_date[2]);
            let split_ymd_end_date = this.state._end_date.split("-");
            var ymd_end_date = new Date(split_ymd_end_date[0], split_ymd_end_date[1] - 1, split_ymd_end_date[2]);
            if (ymd_start_date.getDate() >= ymd_end_date.getDate() || ymd_start_date.getFullYear() > ymd_end_date.getFullYear() || ymd_start_date.getMonth() > ymd_end_date.getMonth()) {
                ymd_end_date.setDate(ymd_start_date.getDate() + 1);
                var dd_end_date = ymd_end_date.getDate();
                var mm_end_date = ymd_end_date.getMonth() + 1;
                var yyyy_end_date = ymd_end_date.getFullYear();
                if (dd_end_date < 10) {
                    dd_end_date = '0' + dd_end_date;
                }
                if (mm_end_date < 10) {
                    mm_end_date = '0' + mm_end_date;
                }
                var end_date = yyyy_end_date + '-' + mm_end_date + '-' + dd_end_date;         
                $('#end_date').val(end_date);
                var number_night = this.dateDiff(this.parseDate(e.target.value), this.parseDate(end_date));
                this.setState({
                    _start_date: e.target.value,
                    _end_date: end_date,
                    _number_night: number_night
                });
                this.getNumberRoom(e.target.value, end_date);
            } else {
                var number_night = this.dateDiff(this.parseDate(e.target.value), this.parseDate(this.state._end_date));
                this.setState({
                    _start_date: e.target.value,
                    _number_night: number_night
                });
                this.getNumberRoom(e.target.value, this.state._end_date);
            }
        }
    }
    endDateChangeHandler(e) {
        if (e.target.value === this.state._start_date) {
            alert('End date can not equal the start date!')
            $('#end_date').val(this.state._end_date);
        } else {
            var number_night = this.dateDiff(this.parseDate(this.state._start_date), this.parseDate(e.target.value));
            this.setState({
                _end_date: e.target.value,
                _number_night: number_night
            });
            this.totalPrice(this.state._number_room, number_night, this.state._price);
            this.getNumberRoom(this.state._start_date, e.target.value);
        }
    }
    numberRoomChangeHandler(e) {
        var number_room = e.target.value;
        $('#numberRoom').val(number_room);
        this.setState({
            _number_room: e.target.value,
        });
        this.totalPrice(number_room, this.state._number_night, this.state._price);
    }
    totalPrice(number_room, number_night, price) {
        var total_price = number_room * number_night * price;
        this.setState({
            _total_price: total_price,
        });
    }
    countReviewHotel() {
        axios.post("http://localhost:8000/api/general/countReviewHotel", querystring.stringify({
            '_hotel_id': this.state._hotel_id
        }))
            .then(results => {
                this.setState({ _count_review: results.data.count });
            })
    }
    checkBoxHandler(e) {
        this.setState({
            _check_box: e.target.checked
        })
    }
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    submitHandler(e) {
        this.setState({
            error: null,
            valerrors: null,
            success: null
        });
        e.preventDefault();
        console.log(this.state._end_date);
        if (this.state._check_box === false) {
            alert('Please select a privacy policy');
        } else {
            axios.post("http://localhost:8000/api/customer/bookRoom", querystring.stringify({
                '_hotel_id': this.state._hotel_id,
                '_type_room_id': this.state._type_room_id,
                '_check_in_date': this.state._start_date,
                '_check_out_date': this.state._end_date,
                '_number_night': this.state._number_night,
                '_number_room': this.state._number_room,
                '_total_price': this.state._total_price,
                '_full_name': this.state._full_name,
                '_identity_card': this.state._identity_card,
                '_phone_number': this.state._phone_number,
                '_email': this.state._email,
                '_note': this.state._note
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
                        window.location = "/";
                    }
                });
        }
    }
    render() {
        return (
            <div>
                <Favicon url="../../../../../../src/images/favicon.ico" />
                <Header />
                <div id="contentInfoCustomer">
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
                </div>
                <div role="main" className="main">
                    <div className="content-body container">
                        <form onSubmit={this.submitHandler}>
                            <div className="row">
                                <div className="col-sm-7">
                                    <div className="container-fluid">
                                        <div className="info">
                                            <h3 className="subtitle sub_booking">Contact Information</h3>
                                            <div className="form-group row">
                                                <label htmlFor="_start_date" className="col-sm-4 col-form-label">Start date</label>
                                                <div className="col-sm-7">
                                                    <input type="date" className="form-control"
                                                        min={this.state._date_now}
                                                        defaultValue={this.state._start_date}
                                                        id="start_date"
                                                        name="_start_date"
                                                        title="Start date"
                                                        onChange={this.startDateChangeHandler} />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="_number_night" className="col-sm-4 col-form-label">Number of nights</label>
                                                <div className="col-sm-7">
                                                    <input type="number" className="form-control number-night"
                                                        readOnly
                                                        value={this.state._number_night}
                                                        id="_number_night"
                                                        name="_number_night"
                                                        title="Number night" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="_end_date" className="col-sm-4 col-form-label">End date</label>
                                                <div className="col-sm-7">
                                                    <input type="date" className="form-control"
                                                        id="end_date"
                                                        min={this.state._start_date}
                                                        defaultValue={this.state._end_date}
                                                        name="_end_date"
                                                        title="End date"
                                                        onChange={this.endDateChangeHandler} />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="_number_room" className="col-sm-4 col-form-label">Number of rooms</label>
                                                <div className="col-sm-7">
                                                    {this.state._list_number_room && Object.keys(this.state._list_number_room).map((key) => {
                                                        if (this.state._type_room_id === key) {
                                                            return <input key={key} type="number" className="form-control number-room"
                                                                min="1"
                                                                max={this.state._list_number_room[key]}
                                                                defaultValue={this.state._number_room}
                                                                id="_number_room"
                                                                name="_number_room"
                                                                title="Number room"
                                                                onChange={this.numberRoomChangeHandler} />
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="_full_name" className="col-sm-4 col-form-label">Full name<span className="req">*</span></label>
                                                <div className="col-sm-7">
                                                    <input type="text" className="form-control full-name"
                                                        id="_full_name"
                                                        name="_full_name"
                                                        title="Full name"
                                                        placeholder="Enter your full name"
                                                        onChange={this.changeHandler} />
                                                    <br />
                                                    {this.state.valerrors &&
                                                        this.state.valerrors._full_name && (
                                                            <p className="errors">{this.state.valerrors._full_name.msg}</p>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="_identity_card" className="col-sm-4 col-form-label">Identity card<span className="req">*</span></label>
                                                <div className="col-sm-7">
                                                    <input type="number" className="form-control identity-card"
                                                        id="_identity_card"
                                                        name="_identity_card"
                                                        title="identity card"
                                                        placeholder="Enter your identity card"
                                                        onChange={this.changeHandler} />
                                                    <br />
                                                    {this.state.valerrors &&
                                                        this.state.valerrors._identity_card && (
                                                            <p className="errors">{this.state.valerrors._identity_card.msg}</p>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="_phone_number" className="col-sm-4 col-form-label">Phone number<span className="req">*</span></label>
                                                <div className="col-sm-7">
                                                    <input type="number" className="form-control phone-number"
                                                        id="_phone_number"
                                                        name="_phone_number"
                                                        title="phone number"
                                                        placeholder="Enter your phone number"
                                                        onChange={this.changeHandler} />
                                                    <br />
                                                    {this.state.valerrors &&
                                                        this.state.valerrors._phone_number && (
                                                            <p className="errors">{this.state.valerrors._phone_number.msg}</p>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="_email" className="col-sm-4 col-form-label">Email<span className="req">*</span></label>
                                                <div className="col-sm-7">
                                                    <input type="email" className="form-control email"
                                                        id="_email"
                                                        name="_email"
                                                        title="Email name"
                                                        placeholder="Enter your email"
                                                        onChange={this.changeHandler} />
                                                    <br />
                                                    {this.state.valerrors &&
                                                        this.state.valerrors._email && (
                                                            <p className="errors">{this.state.valerrors._email.msg}</p>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="_note" className="col-sm-4 col-form-label">Note</label>
                                                <div className="col-sm-7">
                                                    <textarea
                                                        className="form-control note"
                                                        id="_note"
                                                        name="_note"
                                                        title="Email note"
                                                        placeholder="Enter your note"
                                                        onChange={this.changeHandler} ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-5">
                                    <h3 className="subtitle sub_booking">Room Information</h3>
                                    <div className="hotels-container">
                                        <article className="hotel-list">
                                            <div className="hotel-content">
                                                {this.state._images && this.state._images.map(function (image, index) {
                                                    return (
                                                        index === 0 &&
                                                        <img key={index} src={image} className="img-thumbnail image-hotel" alt=""></img>
                                                    )
                                                })}
                                                <div className="hotel-right col-sm-6">
                                                    <h2 className="hotel-name">
                                                        <a href="" title={this.state._hotel_name}>{this.state._hotel_name}</a>
                                                    </h2>
                                                    {
                                                        this.state._hotel_star === 5 ?
                                                            <img className="img-thumbnail star-rating" src={star5}></img> :
                                                            this.state._hotel_star === 4 ?
                                                                <img className="img-thumbnail star-rating" src={star4}></img> :
                                                                this.state._hotel_star === 3 ?
                                                                    <img className="img-thumbnail star-rating" src={star3}></img> :
                                                                    <img className="img-thumbnail star-rating" src={star2}></img>
                                                    }
                                                    <span>
                                                        <i className="fa fa-thumbs-up"></i>
                                                        <a className="divReviewRating">{this.state._count_review} Reivews</a>
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                        <div className="booking-room">
                                            <span><b id="numberRoom">{this.state._number_room} </b>{this.state._type_room_name} room</span>
                                        </div>
                                        <div className="room-price-details">
                                            <div className="title">
                                                <span >Room price details</span>
                                            </div>
                                            <div className="booking-price">
                                                <div className="row info-type-room">
                                                    <div className="col-md-12">
                                                        <span className="col-md-6 type_room"><b>Type room:</b></span>
                                                        <span className="col-md-6 type_room_name"><b>{this.state._type_room_name}</b></span>
                                                    </div>
                                                </div>
                                                <div className="row info-price">
                                                    <div className="col-md-12">
                                                        <span className="col-md-6 room-night">{this.state._number_room} room x {this.state._number_night} night:</span>
                                                        <span className="col-md-6 price">{this.state._total_price}$</span>
                                                    </div>
                                                </div>
                                                <div className="row total-price">
                                                    <div className="col-md-12">
                                                        <span className="col-md-6 room-night"><b>Total price</b></span>
                                                        <span className="col-md-6 price"><b>{this.state._total_price}$</b></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-7 terms-privacy-policy">
                                    <div className="form-check">
                                        <input type="checkbox"
                                            className="form-check-input"
                                            id="check_box"
                                            name="_check_box"
                                            onChange={this.checkBoxHandler} />
                                        <label className="form-check-label" htmlFor="exampleCheck1">I have read and accept the hotel <span className="text-terms-privacy-policy">policies, terms & conditions, and privacy policy</span></label>
                                    </div>
                                    <div className="book-room">
                                        <button type="submit" id="btnSearch" className="btn btn-primary">Book Room</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default InfoCustomer;