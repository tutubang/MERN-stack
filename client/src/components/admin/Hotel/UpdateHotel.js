import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');

class UpdateHotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            _hotel_name: "",
            _city_id: "",
            _star: "",
            _phone_number: "",
            _address: "",
            _description: "",
            _check_in_time: "",
            _check_out_time: "",
            _regulations_check_in: "",
            _other_rule: "",
            _service_id: "",
            _old_images: null,
            _new_hotel_images: null,
            error: null,
            valerrors: null,
            success: null
        };
        this.state._id = this.props.match.params._id;
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._id, querystring.stringify({
            '_type': "hotel"
        }))
            .then((result) => {
                var images = [];
                for (let i = 0; i < result.data.image.length; i++) {
                    const buffer = result.data.image[i].data;
                    const b64 = new Buffer(buffer).toString('base64');
                    const mimeType = "image/png";
                    images.push(`data:${mimeType};base64,${b64}`);
                }
                this.setState({
                    _hotel_name: result.data.hotel._hotel_name,
                    _city_id: result.data.hotel._city_id,
                    _service_id: result.data.hotel._service_id,
                    _star: result.data.hotel._star,
                    _phone_number: result.data.hotel._phone_number,
                    _address: result.data.hotel._address,
                    _description: result.data.hotel._description,
                    _check_in_time: result.data.hotel._check_in_time,
                    _check_out_time: result.data.hotel._check_out_time,
                    _regulations_check_in: result.data.hotel._regulations_check_in,
                    _other_rule: result.data.hotel._other_rule,
                    _old_images: images
                })
            });
        this.getCities();
        this.getServices();
        this.getCities = this.getCities.bind(this);
        this.getServices = this.getServices.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.fileSelectHandler = this.fileSelectHandler.bind(this);
        this.multipleSelectHandler = this.multipleSelectHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    getCities() {
        axios.post("http://localhost:8000/api/general/getDataByStatus", querystring.stringify({
            '_type': "city"
        }))
            .then(cities => this.setState({ cities: cities.data }));

    }
    getServices() {
        axios.post("http://localhost:8000/api/general/getDataByStatus", querystring.stringify({
            '_type': "service",
            '_type_service': "hotel"
        }))
        
            .then(services => this.setState({ services: services.data }));
    }
    inputChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    multipleSelectHandler(e) {
        var value = [];
        for (let i = 0; i < e.target.options.length; i++) {
            if (e.target.options[i].selected) {
                value.push(e.target.options[i].value);
            }
        }
        this.setState({
            [e.target.name]: value
        });
    }
    fileSelectHandler(e) {
        var file = [];
        for (let i = 0; i < e.target.files.length; i++) {
            file.push(e.target.files[i]);
        }
        this.setState({
            _new_hotel_images: file
        })
    }
    submitHandler(e) {
        this.setState({
            error: null,
            valerrors: null,
            success: null
        });
        e.preventDefault();
        console.log(this.state._service_id);
        const formData = new FormData();
        formData.append('_hotel_name', this.state._hotel_name);
        formData.append('_city_id', this.state._city_id);
        formData.append('_service_id', this.state._service_id);
        formData.append('_star', this.state._star);
        formData.append('_phone_number', this.state._phone_number);
        formData.append('_address', this.state._address);
        formData.append('_description', this.state._description);
        formData.append('_check_in_time', this.state._check_in_time);
        formData.append('_check_out_time', this.state._check_out_time);
        formData.append('_regulations_check_in', this.state._regulations_check_in);
        formData.append('_other_rule', this.state._other_rule);
        if (this.state._new_hotel_images === null || this.state._new_hotel_images.length === 0) {
            axios.put("http://localhost:8000/api/admin/updateHotel/" + this.state._id, formData)
                .then(res => {
                    if (res.data.errors) {
                        return this.setState({ valerrors: res.data.errors });
                    }
                    else if (res.data.success === false) {
                        return this.setState({ error: res.data.message });
                    }
                    else {
                        return this.setState({ success: res.data.message });
                    }
                })
        } else {
            if (this.state._new_hotel_images.length !== 0) {
                for (let i = 0; i < this.state._new_hotel_images.length; i++) {
                    formData.append('_new_hotel_images', this.state._new_hotel_images[i], this.state._new_hotel_images[i].name);
                }
            }
            axios.put("http://localhost:8000/api/admin/updateHotel/" + this.state._id,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    if (res.data.errors) {
                        return this.setState({ valerrors: res.data.errors });
                    }
                    else if (res.data.success === false) {
                        return this.setState({ error: res.data.message });
                    }
                    else {
                        return this.setState({ success: res.data.message });
                    }
                })
        }
    }
    render() {
        return (
            <div className="row">
                <div className="col-sm-8 col-sm-offset-2">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <h3 className="card-title">Update a hotel</h3>
                            {this.state.error && <p className="alert alert-danger">{this.state.error}</p>}
                            {this.state.success && <p className="alert alert-success">{this.state.success}</p>}
                            <form onSubmit={this.submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="_hotel_name">Hotel name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="_hotel_name"
                                        name="_hotel_name"
                                        placeholder="Enter hotel name"
                                        onChange={this.inputChangeHandler}
                                        value={this.state._hotel_name} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._hotel_name && (
                                            <p className="errors">{this.state.valerrors._hotel_name.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_city_id">City name:</label>
                                    <select name="_city_id"
                                        className="form-control"
                                        onChange={this.inputChangeHandler}>
                                        <option defaultValue="">Choose</option>
                                        {this.state.cities &&
                                            this.state.cities.map(city => {
                                                return (
                                                    this.state._city_id === city._id ?
                                                        <option selected key={city._id} value={city._id}>{city._city_name}</option> :
                                                        <option key={city._id} value={city._id}>{city._city_name}</option>
                                                )
                                            })}
                                    </select>
                                    {this.state.valerrors &&
                                        this.state.valerrors._city_id && (
                                            <p className="errors">{this.state.valerrors._city_id.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleFormControlSelect2">Service of hotel:</label>
                                    <select
                                        multiple={true}
                                        className="form-control"
                                        name="_service_id"
                                        style={{ minHeight: '200px' }}
                                        onChange={this.multipleSelectHandler}>
                                        {this.state.services &&
                                            this.state.services.map(service => {
                                                return (
                                                    <option key={service._id} value={service._id}>{service._service_name}</option>
                                                )
                                            })}
                                    </select>
                                    {this.state.valerrors &&
                                        this.state.valerrors._service_id && (
                                            <p className="errors">{this.state.valerrors._service_id.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_star">Star:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="_star"
                                        name="_star"
                                        placeholder="Enter star"
                                        onChange={this.inputChangeHandler}
                                        value={this.state._star} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._star && (
                                            <p className="errors">{this.state.valerrors._star.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_phone_number">Phone Number:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="_phone_number"
                                        name="_phone_number"
                                        placeholder="Enter phone number"
                                        onChange={this.inputChangeHandler}
                                        value={this.state._phone_number} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._phone_number && (
                                            <p className="errors">{this.state.valerrors._phone_number.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_address">Address:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="_address"
                                        name="_address"
                                        placeholder="Enter address"
                                        onChange={this.inputChangeHandler}
                                        value={this.state._address} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._address && (
                                            <p className="errors">{this.state.valerrors._address.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_description">Description:</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter description"
                                        id="_description"
                                        name="_description"
                                        rows="3"
                                        onChange={this.inputChangeHandler}
                                        value={this.state._description}></textarea>
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._description && (
                                            <p className="errors">{this.state.valerrors._description.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_check_in_time">Check in time:</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="_check_in_time"
                                        name="_check_in_time"
                                        onChange={this.inputChangeHandler}
                                        defaultValue={this.state._check_in_time}></input>
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._check_in_time && (
                                            <p className="errors">{this.state.valerrors._check_in_time.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_check_out_time">Check out time:</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="_check_out_time"
                                        name="_check_out_time"
                                        onChange={this.inputChangeHandler}
                                        defaultValue={this.state._check_out_time}></input>
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._check_out_time && (
                                            <p className="errors">{this.state.valerrors._check_out_time.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_regulations_check_in">Regulations check in:</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Regulations check in"
                                        id="_regulations_check_in"
                                        name="_regulations_check_in"
                                        rows="3"
                                        onChange={this.inputChangeHandler}
                                        value={this.state._regulations_check_in}></textarea>
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._regulations_check_in && (
                                            <p className="errors">{this.state.valerrors._regulations_check_in.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_other_rule">Other rule:</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Other rule"
                                        id="_other_rule"
                                        name="_other_rule"
                                        rows="3"
                                        onChange={this.inputChangeHandler}
                                        value={this.state._other_rule}></textarea>
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._other_rule && (
                                            <p className="errors">{this.state.valerrors._other_rule.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_old_images">Images:</label>
                                    <br />
                                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                                        <ol className="carousel-indicators">
                                            {this.state._old_images && this.state._old_images.map(function (image, index) {
                                                return (
                                                    index === 0 ?
                                                        <li key={index} data-target="#carouselExampleIndicators" data-slide-to={index} className="active" ></li>
                                                        :
                                                        <li key={index} data-target="#carouselExampleIndicators" data-slide-to={index}></li>
                                                )
                                            })}
                                        </ol>
                                        <div className="carousel-inner">
                                            {this.state._old_images && this.state._old_images.map(function (image, index) {
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
                                    <br />
                                    <br />
                                    <label htmlFor="_images">New images (If you don't want to change, Don't choose image):</label>
                                    <input
                                        accept="image/*"
                                        multiple={true}
                                        type="file"
                                        className="form-control"
                                        id="_new_hotel_images"
                                        name="_new_hotel_images"
                                        onChange={this.fileSelectHandler} />
                                    <br />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdateHotel;