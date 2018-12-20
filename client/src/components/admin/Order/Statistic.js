import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');
import '../../../css/admin/statistic.css'
class Statistic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _hotel_id: "",
            _order_hired: 0,
            _order_canceled: 0,
            _order_waiting: 0,
            _order_checked_out: 0,
            _order_out_of_date: 0,
        };
        this.state._hotel_id = this.props.match.params._id;
        this.getOrderHired();
        this.getOrderCanceled();
        this.getOrderWaiting();
        this.getOrderCheckedOut();
        this.getOrderOutOfDate();
        this.getOrderHired = this.getOrderHired.bind(this);
        this.getOrderCanceled = this.getOrderCanceled.bind(this);
        this.getOrderWaiting = this.getOrderWaiting.bind(this);
        this.getOrderCheckedOut = this.getOrderCheckedOut.bind(this);
        this.getOrderOutOfDate = this.getOrderOutOfDate.bind(this);
    }
    getOrderHired() {
        axios.post("http://localhost:8000/api/admin/countOrderHotel", querystring.stringify({
            '_status': 'Hired',
            '_hotel_id': this.state._hotel_id
        }))
            .then(result => {
                this.setState({
                    _order_hired: result.data.count
                });
            });
    }
    getOrderCanceled() {
        axios.post("http://localhost:8000/api/admin/countOrderHotel", querystring.stringify({
            '_status': 'Canceled',
            '_hotel_id': this.state._hotel_id
        }))
            .then(result => {
                this.setState({
                    _order_canceled: result.data.count
                });
            });
    }
    getOrderWaiting() {
        axios.post("http://localhost:8000/api/admin/countOrderHotel", querystring.stringify({
            '_status': 'Waiting',
            '_hotel_id': this.state._hotel_id
        }))
            .then(result => {
                this.setState({
                    _order_waiting: result.data.count
                });
            });
    }
    getOrderCheckedOut() {
        axios.post("http://localhost:8000/api/admin/countOrderHotel", querystring.stringify({
            '_status': 'Checked out',
            '_hotel_id': this.state._hotel_id
        }))
            .then(result => {
                this.setState({
                    _order_checked_out: result.data.count
                });
            });
    }
    getOrderOutOfDate() {
        axios.post("http://localhost:8000/api/admin/countOrderHotel", querystring.stringify({
            '_status': 'Out Of Date',
            '_hotel_id': this.state._hotel_id
        }))
            .then(result => {
                this.setState({
                    _order_out_of_date: result.data.count
                });
            });
    }
    render() {
        return (
            <div className="statistic">
                <div className="table-responsive-sm">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Total Calceled</th>
                                <th>Total Waiting</th>
                                <th>Total Hired</th>
                                <th>Total Checked out</th>
                                <th>Total Out of date</th>
                            </tr>
                        </thead>
                        <tbody >
                            <tr>
                                <td>{this.state._order_canceled}</td>
                                <td>{this.state._order_waiting}</td>
                                <td>{this.state._order_hired}</td>
                                <td>{this.state._order_checked_out}</td>
                                <td>{this.state._order_out_of_date}</td>                       
                            </tr>
                        </tbody>

                    </table>
                </div>
            </div>
        )
    }
}

export default Statistic;