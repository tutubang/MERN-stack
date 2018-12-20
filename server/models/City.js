const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    _city_name: {
        type: String,
        require: true
    },
    _top_destination: {
        type: Boolean,
        require: true
    },
    _description: {
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

module.exports = City = mongoose.model('city', CitySchema);