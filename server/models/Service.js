const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema ({
    _service_name: {
        type: String,
        require: true
    },
    _service_type: { // 1 is Hotel, 2 is Type Room
        type: Number,
        require: true
    },
    _description: {
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

module.exports = Service = mongoose.model('service', ServiceSchema);