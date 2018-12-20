import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');

class UpdateStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            _firstname: "",
            _lastname: "",
            _username: "",
            _email: "",
            _phone_number: "",
            _hotel_id: "",
            _new_staff_image: null,
            error: null,
            valerrors: null,
            success: null
        };
        this.state._id = this.props.match.params._id;
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._id, querystring.stringify({
            '_type': "staff"
        }))
            .then((result) => {
                const buffer = result.data.image.data; // e.g., <Buffer 89 50 4e ... >
                const b64 = new Buffer(buffer).toString('base64')
                const mimeType = "image/png";// e.g., image/png
                this.setState({
                    _firstname: result.data.staff._firstname,
                    _lastname: result.data.staff._lastname,
                    _username: result.data.staff._username,
                    _email: result.data.staff._email,
                    _phone_number: result.data.staff._phone_number,
                    _hotel_id: result.data.staff._hotel_id,
                    _old_image: `data:${mimeType};base64,${b64}`
                })
            });
        this.getHotels();
        this.getHotels = this.getHotels.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.fileSelectHandler = this.fileSelectHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    getHotels() {
        axios.post("http://localhost:8000/api/general/getDataByStatus", querystring.stringify({
            '_type': "hotel"
        }))
            .then(hotels => this.setState({ hotels: hotels.data }));

    }
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    fileSelectHandler(e) {
        this.setState({
            _new_staff_image: e.target.files[0]
        });

    }
    submitHandler(e) {
        this.setState({
            error: null,
            valerrors: null,
            success: null
        });
        e.preventDefault();
        if (this.state._new_staff_image === null || this.state._new_staff_image === undefined) {
            const formData = new FormData();
            formData.append('_firstname', this.state._firstname);
            formData.append('_lastname', this.state._lastname);
            formData.append('_username', this.state._username);
            formData.append('_email', this.state._email);
            formData.append('_phone_number', this.state._phone_number);
            formData.append('_hotel_id', this.state._hotel_id);
            axios.put("http://localhost:8000/api/admin/updateStaff/" + this.state._id, formData)
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
            const formData = new FormData();
            formData.append('_firstname', this.state._firstname);
            formData.append('_lastname', this.state._lastname);
            formData.append('_username', this.state._username);
            formData.append('_email', this.state._email);
            formData.append('_phone_number', this.state._phone_number);
            formData.append('_hotel_id', this.state._hotel_id);
            formData.append('_new_staff_image', this.state._new_staff_image);
            axios.put("http://localhost:8000/api/admin/updateStaff/" + this.state._id,
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
                            <h3 className="card-title">Update a staff</h3>
                            {this.state.error && <p className="alert alert-danger">{this.state.error}</p>}
                            {this.state.success && <p className="alert alert-success">{this.state.success}</p>}
                            <form onSubmit={this.submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="_firstname">First name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="_firstname"
                                        name="_firstname"
                                        placeholder="Enter first name"
                                        value={this.state._firstname}
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._firstname && (
                                            <p className="errors">{this.state.valerrors._firstname.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_lastname">Last name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="_lastname"
                                        name="_lastname"
                                        placeholder="Enter last name"
                                        value={this.state._lastname}
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._lastname && (
                                            <p className="errors">{this.state.valerrors._lastname.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_email">Email:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="_email"
                                        name="_email"
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
                                    <label htmlFor="_phone_number">Phone number:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="_phone_number"
                                        name="_phone_number"
                                        placeholder="Enter phone number"
                                        value={this.state._phone_number}
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._phone_number && (
                                            <p className="errors">{this.state.valerrors._phone_number.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_username">Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="_username"
                                        name="_username"
                                        placeholder="Enter username"
                                        value={this.state._username}
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._username && (
                                            <p className="errors">{this.state.valerrors._username.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_hotel_id">Hotel name:</label>
                                    <select name="_hotel_id"
                                        className="form-control"
                                        onChange={this.changeHandler}>
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
                                        id="_new_staff_image"
                                        name="_new_staff_image"
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

export default UpdateStaff;