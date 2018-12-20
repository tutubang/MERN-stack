const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    _full_name: {
        type: String,
        require: true
    },
    _hotel_id: {
        type: String,
        require: true
    },
    _email: {
        type: String,
        require: true
    },
    _content: {
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

module.exports = Review = mongoose.model('review', ReviewSchema);