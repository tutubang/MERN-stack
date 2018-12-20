import React, { Component } from 'react';
import axios from 'axios';
import querystring from 'querystring';

class AddStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _firstname: "",
            _lastname: "",
            _username: "",
            _email: "",
            _phone_number: "",
            _password: "",
            _password_con: "",
            _hotel_id: "",
            _staff_image: null,
            error: null,
            valerrors: null,
            success: null
        }
        this.gethotels();
        this.changeHandler = this.changeHandler.bind(this);
        this.fileSelectHandler = this.fileSelectHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.resetHandler = this.resetHandler.bind(this);
        this.gethotels = this.gethotels.bind(this);
    }
    gethotels() {
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
            _staff_image: e.target.files[0]
        });

    }
    resetHandler(e) {
        this.setState({
            _firstname: "",
            _lastname: "",
            _username: "",
            _email: "",
            _phone_number: "",
            _password: "",
            _password_con: "",
            _hotel_id: "",
            _staff_image: null,
            error: null,
            valerrors: null,
            success: null
        });   
    }
    submitHandler(e) {
        this.setState({
            error: null,
            valerrors: null,
            success: null
        });
        e.preventDefault();
        const formData = new FormData();
        formData.append('_firstname', this.state._firstname);
        formData.append('_lastname', this.state._lastname);
        formData.append('_username', this.state._username);
        formData.append('_email', this.state._email);
        formData.append('_phone_number', this.state._phone_number);
        formData.append('_password', this.state._password);
        formData.append('_password_con', this.state._password);
        formData.append('_hotel_id', this.state._hotel_id);
        formData.append('_staff_image', this.state._staff_image);
        axios.post("http://localhost:8000/api/admin/addStaff",
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
                            <h3 className="card-title">Add new a staff</h3>
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
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._username && (
                                            <p className="errors">{this.state.valerrors._username.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_password">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="_password"
                                        name="_password"
                                        placeholder="Enter password"
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._password && (
                                            <p className="errors">{this.state.valerrors._password.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_password_con">Password confirmation:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="_password_con"
                                        name="_password_con"
                                        placeholder="Enter password"
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._password_con && (
                                            <p className="errors">{this.state.valerrors._password_con.msg}</p>
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
                                    <label htmlFor="_staff_image">Image:</label>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        className="form-control"
                                        id="_staff_image"
                                        name="_staff_image"
                                        onChange={this.fileSelectHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._staff_image && (
                                            <p className="errors">{this.state.valerrors._staff_image.msg}</p>
                                        )}
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <button style={{marginLeft: 10}} type="reset" className="btn btn-primary" onClick={this.resetHandler}>Reset</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddStaff;