import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');

class InfoStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _firstname: "",
            _lastname: "",
            _email: "",
            _phone_number: "",
            _hotel_id: "",
            staff: null,
            _staff_id: ""
        }
        this.state._staff_id = this.props.match.params.staff_id;
        this.getStaffByID();
        this.getHotels();
        this.getHotels = this.getHotels.bind(this);
        this.getStaffByID = this.getStaffByID.bind(this);
    }
    getStaffByID() {
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._staff_id, querystring.stringify({
            '_type': "staff"
        }))
            .then(result => {
                const buffer = result.data.image.data; // e.g., <Buffer 89 50 4e ... >
                const b64 = new Buffer(buffer).toString('base64')
                const mimeType = "image/png";// e.g., image/png
                this.setState({
                    _firstname: result.data.staff._firstname,
                    _lastname: result.data.staff._lastname,
                    _email: result.data.staff._email,
                    _phone_number: result.data.staff._phone_number,
                    _hotel_id: result.data.staff._hotel_id,
                    _old_image: `data:${mimeType};base64,${b64}`
                })
            });
    }
    getHotels() {
        axios.post("http://localhost:8000/api/general/getDataByStatus", querystring.stringify({
            '_type': "hotel"
        }))
            .then(hotels => this.setState({ hotels: hotels.data }));

    }
    render() {
        return (
            <div className="row">
                <div className="col-sm-8 col-sm-offset-2">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <h3 className="card-title">Information a staff</h3>
                            <div className="form-group">
                                <label htmlFor="_firstname">First name:</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="form-control"
                                    id="_firstname"
                                    name="_firstname"
                                    placeholder="Enter first name"
                                    value={this.state._firstname} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_lastname">Last name:</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="form-control"
                                    id="_lastname"
                                    name="_lastname"
                                    placeholder="Enter last name"
                                    value={this.state._lastname} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_email">Email:</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="form-control"
                                    id="_email"
                                    name="_email"
                                    placeholder="Enter email"
                                    value={this.state._email} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_phone_number">Phone number:</label>
                                <input
                                    readOnly
                                    type="number"
                                    className="form-control"
                                    id="_phone_number"
                                    name="_phone_number"
                                    placeholder="Enter phone number"
                                    value={this.state._phone_number} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_hotel_id">Hotel name:</label>
                                {this.state.hotels &&
                                    this.state.hotels.map(hotel => {
                                        return (
                                            this.state._hotel_id === hotel._id &&
                                            <input
                                                readOnly
                                                key={hotel._id}
                                                type="text"
                                                className="form-control"
                                                id="_username"
                                                name="_username"
                                                placeholder="Enter username"
                                                value={hotel._hotel_name} />
                                        )
                                    })}
                            </div>
                            <div className="form-group">
                                <label htmlFor="_old_image">Images:</label>
                                <br />
                                <img src={this.state._old_image}
                                    className="img-thumbnail"
                                    alt="Cinque Terre"
                                    width="304"
                                    height="236" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default InfoStaff;