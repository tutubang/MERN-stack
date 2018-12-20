import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');

class UpdateCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            _city_name: "",
            _description: "",
            _top_destination: '',
            _old_images: null,
            _new_city_image: null,
            error: null,
            valerrors: null,
            success: null
        };
        this.state._id = this.props.match.params._id;
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._id, querystring.stringify({
            '_type': "city"
        }))
            .then((result) => {
                const buffer = result.data.image.data; // e.g., <Buffer 89 50 4e ... >
                const b64 = new Buffer(buffer).toString('base64')
                const mimeType = "image/png";// e.g., image/png
                this.setState({
                    _city_name: result.data.city._city_name,
                    _top_destination: result.data.city._top_destination,
                    _description: result.data.city._description,
                    _old_images: `data:${mimeType};base64,${b64}`
                })
            });
        this.changeHandler = this.changeHandler.bind(this);
        this.fileSelectHandler = this.fileSelectHandler.bind(this);
        this.checkedHandler = this.checkedHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    checkedHandler(e) {
        this.setState({
            [e.target.name]: e.target.checked
        });
    }
    fileSelectHandler(e) {
        this.setState({
            _new_city_image: e.target.files[0]
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
        formData.append('_city_name', this.state._city_name);
        formData.append('_top_destination', this.state._top_destination);
        formData.append('_description', this.state._description);
        if (this.state._new_city_image === null || this.state._new_city_image === undefined) {
            axios.put("http://localhost:8000/api/admin/updateCity/" + this.state._id, formData)
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
            formData.append('_new_city_image', this.state._new_city_image);
            axios.put("http://localhost:8000/api/admin/updateCity/" + this.state._id,
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
                            <h3 className="card-title">Update a city</h3>
                            {this.state.error && <p className="alert alert-danger">{this.state.error}</p>}
                            {this.state.success && <p className="alert alert-success">{this.state.success}</p>}
                            <form onSubmit={this.submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="_city_name">City name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="_city_name"
                                        name="_city_name"
                                        placeholder="Enter city name"
                                        value={this.state._city_name}
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._city_name && (
                                            <p className="errors">{this.state.valerrors._city_name.msg}</p>
                                        )}
                                </div>
                                <div className="form-check">
                                    {this.state._top_destination === true ?
                                        <input type="checkbox"
                                            className="form-check-input"
                                            id="_top_destination"
                                            name="_top_destination"
                                            onChange={this.checkedHandler}
                                            defaultChecked /> :
                                        <input type="checkbox"
                                            className="form-check-input"
                                            id="_top_destination"
                                            name="_top_destination"
                                            onChange={this.checkedHandler} />
                                    }
                                    <label className="form-check-label" htmlFor="_top_destination">Top destination</label>
                                </div>
                                <br />
                                <div className="form-group">
                                    <label htmlFor="_description">Description:</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter description"
                                        id="_description"
                                        name="_description"
                                        rows="3"
                                        value={this.state._description}
                                        onChange={this.changeHandler}></textarea>
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._description && (
                                            <p className="errors">{this.state.valerrors._description.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_old_images">Images:</label>
                                    <br />
                                    <img src={this.state._old_images}
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
                                        id="_new_city_image"
                                        name="_new_city_image"
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

export default UpdateCity;