const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

var StaffSchema = new Schema({
    _firstname: {
        type: String,
        required: true
    },
    _lastname: {
        type: String,
        required: true
    },
    _username: {
        type: String,
        require: true
    },
    _email: {
        type: String,
        required: true
    },
    _phone_number: {
        type: String,
        required: true
    },
    _password: {
        type: String,
        required: true
    },
    _hotel_id: {
        type: String,
        required: true
    },
    _staff_image: {
        type: String,
        require: true
    },
    _createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    _updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    _status: {
        type: String,
        require: true
    }
});

StaffSchema.methods.hashPassword = function (_password) {
    return bcrypt.hashSync(_password, 12);
};
StaffSchema.methods.comparePassword = function (_password, hashPassword) {
    return bcrypt.compareSync(_password, hashPassword);
};

module.exports = User = mongoose.model("Staff", StaffSchema);