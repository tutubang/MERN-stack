import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');

class UpdateService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            _service_name: "",
            _service_type: "",
            _description: "",
            error: null,
            valerrors: null,
            success: null
        };
        this.state._id = this.props.match.params._id;
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._id, querystring.stringify({
            '_type': "service"
        }))
            .then(result => {
                this.setState({
                    _service_name: result.data.service._service_name,
                    _service_type: result.data.service._service_type,
                    _description: result.data.service._description,
                })
            });
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submitHandler(e) {
        this.setState({
            error: null,
            valerrors: null,
            success: null
        });
        e.preventDefault();
        axios.put("http://localhost:8000/api/admin/updateService/" + this.state._id, this.state)
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
                            <h3 className="card-title">Update service</h3>
                            {this.state.error && <p className="alert alert-danger">{this.state.error}</p>}
                            {this.state.success && <p className="alert alert-success">{this.state.success}</p>}
                            <form onSubmit={this.submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="_service_name">Service name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="_service_name"
                                        name="_service_name"
                                        placeholder="Enter service name"
                                        value={this.state._service_name}
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._service_name && (
                                            <p className="errors">{this.state.valerrors._service_name.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_service_type">Service type:</label>
                                    <select name="_service_type"
                                        className="form-control"
                                        onChange={this.changeHandler}>
                                        <option defaultValue="">Choose</option>
                                        {this.state._service_type === 1 ?
                                            <option selected value="1">Hotel</option> : 
                                            <option value="1">Hotel</option>                                          
                                        }
                                        {this.state._service_type === 2 ?
                                            <option selected value="2">Type Room</option> : 
                                            <option value="2">Type Room</option>                                          
                                        }
                                    </select>
                                    {this.state.valerrors &&
                                        this.state.valerrors._service_type && (
                                            <p className="errors">{this.state.valerrors._service_type.msg}</p>
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
                                        onChange={this.changeHandler}></textarea>
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._description && (
                                            <p className="errors">{this.state.valerrors._description.msg}</p>
                                        )}
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

export default UpdateService;