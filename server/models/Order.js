const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    _order_id: {
        type: String,
        required: true
    },
    _check_in_date: {
        type: String,
        required: true
    },
    _check_out_date: {
        type: String,
        required: true
    },
    _number_night: {
        type: Number,
        required: true
    },
    _number_room: {
        type: Number,
        required: true
    },
    _total_price: {
        type: Number,
        required: true
    },
    _customer_id: {
        type: String,
        required: true
    },
    _hotel_id: {
        type: String,
        required: true
    },
    _type_room_id: {
        type: String,
        required: true
    },
    _staff_id: {
        type: String
    },
    _note: {
        type: String
    },
    _createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    _updateAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    _status: {
        type: String,
        required: true
    }
})

module.exports = Order = mongoose.model('order', OrderSchema);