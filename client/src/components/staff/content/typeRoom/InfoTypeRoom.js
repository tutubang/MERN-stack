import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');

class InfoTypeRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {

            type_room: null,
            _type_room_id: ""
        }
        this.state._type_room_id = this.props.match.params.type_room_id;
        this.getTypeRoomByID();
        this.getHotels();
        this.getServices();
        this.getServices();
        this.getServices = this.getServices.bind(this);
        this.getHotels = this.getHotels.bind(this);
        this.getTypeRoomByID = this.getTypeRoomByID.bind(this);
    }
    getTypeRoomByID() {
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._type_room_id, querystring.stringify({
            '_type': "type_room"
        }))
            .then(result => {
                const buffer = result.data.image.data; // e.g., <Buffer 89 50 4e ... >
                const b64 = new Buffer(buffer).toString('base64')
                const mimeType = "image/png";// e.g., image/png
                this.setState({
                    _type_room_name: result.data.type_room._type_room_name,
                    _hotel_id: result.data.type_room._hotel_id,
                    _person_number: result.data.type_room._person_number,
                    _number_room: result.data.type_room._number_room,
                    _price: result.data.type_room._price,
                    _description: result.data.type_room._description,
                    _image: `data:${mimeType};base64,${b64}`
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
                            <h3 className="card-title">Information a type room</h3>
                            <div className="form-group">
                                <label htmlFor="_type_room_name">Type room name:</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="form-control"
                                    id="_type_room_name"
                                    name="_type_room_name"
                                    placeholder="Enter type room name"
                                    value={this.state._type_room_name} />
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
                                <label htmlFor="_person_number">Person Number:</label>
                                <input
                                    readOnly
                                    type="number"
                                    className="form-control"
                                    id="_person_number"
                                    name="_person_number"
                                    placeholder="Enter person number"
                                    value={this.state._person_number} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_number_room">Number Room:</label>
                                <input
                                    readOnly
                                    type="number"
                                    className="form-control"
                                    id="_number_room"
                                    name="_number_room"
                                    placeholder="Enter number room"
                                    value={this.state._number_room} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_price">Price:</label>
                                <input
                                    readOnly
                                    type="number"
                                    className="form-control"
                                    id="_price"
                                    name="_price"
                                    placeholder="Enter price"
                                    value={this.state._price} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_description">Description:</label>
                                <textarea
                                    readOnly
                                    className="form-control"
                                    placeholder="Enter description"
                                    id="_description"
                                    name="_description"
                                    rows="3"
                                    value={this.state._description}
                                    onChange={this.inputChangeHandler}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="_image">Images:</label>
                                <br />
                                <img src={this.state._image}
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

export default InfoTypeRoom;