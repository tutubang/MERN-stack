import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');

class AddTypeRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _type_room_name: "",
            _hotel_id: "",
            _service_id: [],
            _person_number: "",
            _number_room:"",
            _price: "",
            _description: "",
            _type_room_image:null,
            error: null,
            valerrors: null,
            success: null,
            hotels: null,
            services: null
        }
        this.gethotels();
        this.getServices();
        this.gethotels = this.gethotels.bind(this);
        this.getServices = this.getServices.bind(this);
        this.resetHandler = this.resetHandler.bind(this);
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.multipleSelectHandler = this.multipleSelectHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    gethotels() {
        axios.post("http://localhost:8000/api/general/getDataByStatus", querystring.stringify({
            '_type': "hotel"
        }))
            .then(hotels => this.setState({ hotels: hotels.data }));
    }
    getServices() {
        axios.post("http://localhost:8000/api/general/getDataByStatus", querystring.stringify({
            '_type': "service",
            '_type_service': "type_room"
        }))
            .then(services => this.setState({ services: services.data }));
    }
    inputChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    resetHandler(e) {
        this.setState({
            _type_room_name: "",
            _hotel_id: "",
            _service_id: [],
            _person_number: "",
            _number_room: "",
            _price: "",
            _description: "",
            _type_room_image: "",
            error: null,
            valerrors: null,
            success: null
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
    fileSelectedHandler(e) {
        this.setState({
            _type_room_image: e.target.files[0]
        })
    }
    submitHandler(e) {
        this.setState({
            error: null,
            valerrors: null,
            success: null
        });
        e.preventDefault();
        const formData = new FormData();
        formData.append('_type_room_name', this.state._type_room_name);
        formData.append('_hotel_id', this.state._hotel_id);
        formData.append('_service_id', this.state._service_id);
        formData.append('_person_number', this.state._person_number);
        formData.append('_number_room', this.state._number_room);
        formData.append('_price', this.state._price);
        formData.append('_description', this.state._description);
        formData.append('_type_room_image', this.state._type_room_image);
        axios.post("http://localhost:8000/api/admin/addTypeRoom",
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
    render() {
        return (
            <div className="row">
                <div className="col-sm-8 col-sm-offset-2">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <h3 className="card-title">Add new a type room</h3>
                            {this.state.error && <p className="alert alert-danger">{this.state.error}</p>}
                            {this.state.success && <p className="alert alert-success">{this.state.success}</p>}
                            <form onSubmit={this.submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="_type_room_name">Type room name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="_type_room_name"
                                        name="_type_room_name"
                                        placeholder="Enter type room name"
                                        onChange={this.inputChangeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._type_room_name && (
                                            <p className="errors">{this.state.valerrors._type_room_name.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_hotel_id">Hotel name:</label>
                                    <select name="_hotel_id"
                                        className="form-control"
                                        onChange={this.inputChangeHandler}>
                                        <option defaultValue="">Choose</option>
                                        {this.state.hotels &&
                                            this.state.hotels.map(hotel => {
                                                return (
                                                    <option key={hotel._id} value={hotel._id}>{hotel._hotel_name}</option>
                                                )
                                            })}
                                    </select>
                                    {this.state.valerrors &&
                                        this.state.valerrors._hotel_id && (
                                            <p className="errors">{this.state.valerrors._hotel_id.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleFormControlSelect2">Service of type room:</label>
                                    <select multiple={true}
                                        className="form-control"
                                        name="_service_id"
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
                                    <label htmlFor="_person_number">Person Number:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="_person_number"
                                        name="_person_number"
                                        placeholder="Enter person number"
                                        onChange={this.inputChangeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._person_number && (
                                            <p className="errors">{this.state.valerrors._person_number.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_number_room">Number Room:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="_number_room"
                                        name="_number_room"
                                        placeholder="Enter number room"
                                        onChange={this.inputChangeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._number_room && (
                                            <p className="errors">{this.state.valerrors._number_room.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_price">Price:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="_price"
                                        name="_price"
                                        placeholder="Enter price"
                                        onChange={this.inputChangeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._price && (
                                            <p className="errors">{this.state.valerrors._price.msg}</p>
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
                                        onChange={this.inputChangeHandler}></textarea>
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._description && (
                                            <p className="errors">{this.state.valerrors._description.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_type_room_image">Image:</label>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        className="form-control"
                                        id="_type_room_image"
                                        name="_type_room_image"
                                        onChange={this.fileSelectedHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._type_room_image && (
                                            <p className="errors">{this.state.valerrors._type_room_image.msg}</p>
                                        )}
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <button style={{ marginLeft: 10 }} type="reset" className="btn btn-primary" onClick={this.resetHandler}>Reset</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddTypeRoom;