import React, { Component } from 'react';
import axios from 'axios';
import '../../css/staff/login.css';
axios.defaults.withCredentials = true;
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _username: "",
            _password: "",
            error: null,
            valerrors: null
        }
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
            valerrors: null
        });
        e.preventDefault();
        axios.post("http://localhost:8000/api/staff/login", this.state)
            .then(res => {
                if (res.data.errors) {
                    return this.setState({ valerrors: res.data.errors });
                }
                if (res.data.success === false) {
                    return this.setState({ error: res.data.message });
                }
                return (window.location = "/staff");
            });
    }
    render() {
        return (
            <div className="login col-sm-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-header"></div>
                        <h4 className="card-title">Staff Login</h4>
                        {this.state.error && <p className="errors">{this.state.error}</p>}
                        <form onSubmit={this.submitHandler}>
                            <div className="form-group">
                                <label htmlFor="Username">Username</label>
                                <input
                                    className="form-control"
                                    type="username"
                                    placeholder="Enter username"
                                    name="_username"
                                    id="username"
                                    onChange={this.changeHandler} />
                                <br />
                                {this.state.valerrors &&
                                    this.state.valerrors._username && (
                                        <p className="errors">{this.state.valerrors._username.msg}</p>
                                    )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="Password">Password</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Enter password"
                                    name="_password"
                                    id="password"
                                    onChange={this.changeHandler} />
                                <br />
                                {this.state.valerrors &&
                                    this.state.valerrors._password && (
                                        <p className="errors">{this.state.valerrors._password.msg}</p>
                                    )}
                            </div>
                            <button type="submit" className="btn btn-primary">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;