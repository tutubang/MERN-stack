const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeRoomSchema = new Schema({
    _type_room_name: {
        type: String,
        required: true
    },
    _hotel_id: {
        type: String,
        required: true
    },
    _service_id: {
        type: String,
        required: true
    },
    _person_number: {
        type: Number,
        required: true
    },
    _number_room: {
        type: Number,
        required: true
    },
    _price: {
        type: Number,
        required: true,
    },
    _description: {
        type: String,
        required: true
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

module.exports = TypeRoom = mongoose.model('typeRoom', TypeRoomSchema);