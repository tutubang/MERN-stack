import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');

class ChangePass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            _old_password: "",
            _new_password: "",
            _password_con: "",
            error: null,
            valerrors: null,
            success: null
        };
        this.state._id = this.props.match.params.staff_id;
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
        axios.post("http://localhost:8000/api/staff/changePassword", querystring.stringify({
            '_staff_id': this.state._id,
            '_old_password': this.state._old_password,
            '_new_password': this.state._new_password,
            '_password_con': this.state._password_con,
        }))
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
                            <h3 className="card-title">Change password</h3>
                            {this.state.error && <p className="alert alert-danger">{this.state.error}</p>}
                            {this.state.success && <p className="alert alert-success">{this.state.success}</p>}
                            <form onSubmit={this.submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="_old_password">Old password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="_old_password"
                                        name="_old_password"
                                        placeholder="Enter old password"
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._old_password && (
                                            <p className="errors">{this.state.valerrors._old_password.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_new_password">New password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="_new_password"
                                        name="_new_password"
                                        placeholder="Enter new password"
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._new_password && (
                                            <p className="errors">{this.state.valerrors._new_password.msg}</p>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="_password_con">Re-enter password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="_password_con"
                                        name="_password_con"
                                        placeholder="Re-enter password"
                                        onChange={this.changeHandler} />
                                    <br />
                                    {this.state.valerrors &&
                                        this.state.valerrors._password_con && (
                                            <p className="errors">{this.state.valerrors._password_con.msg}</p>
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

export default ChangePass;