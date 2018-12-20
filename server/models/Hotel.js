const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
    _hotel_name: {
        type: String,
        require: true
    },
    _city_id: {
        type: String,
        required: true
    },
    _service_id: {
        type: String,
        required: true
    },
    _star: {
        type: Number,
        required: true
    },
    _phone_number: {
        type: Number,
        required: true
    },
    _address: {
        type: String,
        require: true
    },
    _description: {
        type: String,
        require: true
    },
    _check_in_time: {
        type: String,
        require: true
    },
    _check_out_time: {
        type: String,
        require: true
    },
    _regulations_check_in: {
        type: String,
        require: true
    },
    _other_rule: {
        type: String,
        require: true
    },
    _images: {
        type: String,
        require: true
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
        require: true
    }
});

module.exports = Hotel = mongoose.model('hotel', HotelSchema);