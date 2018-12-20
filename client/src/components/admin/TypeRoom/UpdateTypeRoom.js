import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');

class UpdateTypeRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            _type_room_name: "",
            _hotel_id: "",
            _service_id: "",
            _person_number: "",
            _number_room: "",
            _price: "",
            _description: "",
            _old_image: null,
            _new_type_room_image: null,
            error: null,
            valerrors: null,
            success: null
        };
        this.state._id = this.props.match.params._id;
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._id, querystring.stringify({
            '_type': "type_room"
        }))
            .then((result) => {
                const buffer = result.data.image.data; // e.g., <Buffer 89 50 4e ... >
                const b64 = new Buffer(buffer).toString('base64')
                const mimeType = "image/png";// e.g., image/png
                this.setState({
                    _type_room_name: result.data.type_room._type_room_name,
                    _hotel_id: result.data.type_room._hotel_id,
                    _service_id: result.data.type_room._service_id,
                    _person_number: result.data.type_room._person_number,
                    _number_room: result.data.type_room._number_room,
                    _price: result.data.type_room._price,
                    _description: result.data.type_room._description,
                    _old_image: `data:${mimeType};base64,${b64}`
                })
            });
        this.getHotels();
        this.getServices();
        this.getHotels = this.getHotels.bind(this);
        this.getServices = this.getServices.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        this.multipleSelectHandler = this.multipleSelectHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    getHotels() {
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
            _new_type_room_image: e.target.files[0]
        })
    }
    submitHandler(e) {
        this.setState({
            error: null,
            valerrors: null,
            success: null
        });
        e.preventDefault();
        console.log(this.state._new_type_room_image)
        const formData = new FormData();
        formData.append('_type_room_name', this.state._type_room_name);
        formData.append('_hotel_id', this.state._hotel_id);
        formData.append('_service_id', this.state._service_id);
        formData.append('_person_number', this.state._person_number);
        formData.append('_number_room', this.state._number_room);
        formData.append('_price', this.state._price);
        formData.append('_description', this.state._description);
        if (this.state._new_type_room_image === null || this.state._new_type_room_image === undefined) {
            axios.put("http://localhost:8000/api/admin/updateTypeRoom/" + this.state._id, formData)
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
            formData.append('_new_type_room_image', this.state._new_type_room_image);
            axios.put("http://localhost:8000/api/admin/updateTypeRoom/" + this.state._id,
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
                            <h3 className="card-title">Update type room</h3>
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
                                        value={this.state._type_room_name}
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
                                                    this.state._hotel_id === hotel._id ?
                                                        <option selected key={hotel._id} value={hotel._id}>{hotel._hotel_name}</option> :
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
                                        value={this.state._person_number}
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
                                        value={this.state._number_room}
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
                                        value={this.state._price}
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
                                        value={this.state._description}
                                        onChange={this.inputChangeHandler}></textarea>
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._description && (
                                            <p className="errors">{this.state.valerrors._description.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_old_image">Images:</label>
                                    <br />
                                    <img src={this.state._old_image}
                                        className="img-thumbnail"
                                        alt="Cinque Terre"
                                        width="304"
                                        height="236" />
                                    <br />
                                    <br />
                                    <label htmlFor="_images">New images (If you don't want to change, Don't choose image):</label>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        className="form-control"
                                        id="_new_type_room_image"
                                        name="_new_type_room_image"
                                        onChange={this.fileSelectedHandler} />
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

export default UpdateTypeRoom;
