const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

//create Schema
const AdminSchema = new Schema({
    _username: {
        type: String,
        require: true
    },
    _password: {
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

AdminSchema.methods.hashPassword = function (_password) {
    return bcrypt.hashSync(_password, 12);
};

AdminSchema.methods.comparePassword = function (_password, hashPassword) {
    return bcrypt.compareSync(_password, hashPassword);
};
module.exports = Admin = mongoose.model('admin', AdminSchema);