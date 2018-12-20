import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');

class InfoCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _full_name: "",
            _identity_card: "",
            _phone_number: "",
            _email: "",
            _createAt: "",
            customer: null,
            _customer_id: ""
        }
        this.state._customer_id = this.props.match.params.customer_id;
        this.getCustomerByID();
        this.getCustomerByID = this.getCustomerByID.bind(this);
    }
    getCustomerByID() {
        axios.post("http://localhost:8000/api/general/getDataById/" + this.state._customer_id, querystring.stringify({
            '_type': "customer"
        }))
            .then(result => {
                this.setState({
                    _full_name: result.data.customer._full_name,
                    _identity_card: result.data.customer._identity_card,
                    _phone_number: result.data.customer._phone_number,
                    _email: result.data.customer._email,
                    _createAt: result.data.customer._createAt
                })
            });
    }
    render() {
        return (
            <div className="row">
                <div className="col-sm-8 col-sm-offset-2">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <h3 className="card-title">Information a customer</h3>
                            <div className="form-group">
                                <label htmlFor="_full_name">Full name:</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="form-control"
                                    id="_full_name"
                                    name="_full_name"
                                    value={this.state._full_name} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_identity_card">Identity card:</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="form-control"
                                    id="_identity_card"
                                    name="_identity_card"
                                    value={this.state._identity_card} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_phone_number">Phone number:</label>
                                <input
                                    readOnly
                                    type="number"
                                    className="form-control"
                                    id="_phone_number"
                                    name="_phone_number"
                                    value={this.state._phone_number} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_email">Email:</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="form-control"
                                    id="_email"
                                    name="_email"
                                    value={this.state._email} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="_createAt">Create date:</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="form-control"
                                    id="_createAt"
                                    name="_createAt"
                                    value={new Date(this.state._createAt).toLocaleString()} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default InfoCustomer;