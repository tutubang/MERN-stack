import React, { Component } from 'react';
import axios from 'axios';

class AddCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _city_name: "",
            _top_destination: false,
            _description: "",
            _city_image: null,
            error: null,
            valerrors: null,
            success: null
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.fileSelectHandler = this.fileSelectHandler.bind(this);
        this.checkedHandler = this.checkedHandler.bind(this);
        this.resetHandler = this.resetHandler.bind(this);
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
            _city_image: e.target.files[0]
        });

    }
    resetHandler(e) {
        this.setState({
            _city_name: "",
            _top_destination: false,
            _description: "",
            _city_image: null,
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
        formData.append('_city_name', this.state._city_name);
        formData.append('_top_destination', this.state._top_destination);
        formData.append('_description', this.state._description);
        formData.append('_city_image', this.state._city_image);
        axios.post("http://localhost:8000/api/admin/addCity",
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
                            <h3 className="card-title">Add new a city</h3>
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
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._city_name && (
                                            <p className="errors">{this.state.valerrors._city_name.msg}</p>
                                        )}
                                </div>
                                <div className="form-check">
                                    <input type="checkbox"
                                        className="form-check-input"
                                        id="_top_destination"
                                        name="_top_destination"
                                        onChange={this.checkedHandler} />
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
                                        onChange={this.changeHandler}></textarea>
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._description && (
                                            <p className="errors">{this.state.valerrors._description.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_city_image">Image:</label>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        className="form-control"
                                        id="_city_image"
                                        name="_city_image"
                                        onChange={this.fileSelectHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._city_image && (
                                            <p className="errors">{this.state.valerrors._city_image.msg}</p>
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

export default AddCity;