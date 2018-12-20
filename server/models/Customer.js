const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    _full_name: {
        type: String,
        required: true
    },
    _identity_card: {
        type: String,
        required: true
    },
    _phone_number: {
        type: String,
        required: true
    },
    _email: {
        type: String,
        required: true
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
    }
})

module.exports = Customer = mongoose.model('customer', CustomerSchema);