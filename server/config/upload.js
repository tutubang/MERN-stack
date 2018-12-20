const multer = require('multer');
const City = require('../models/City');
const Hotel = require('../models/Hotel');
const TypeRoom = require('../models/TypeRoom');
const Staff = require('../models/Staff');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    },

});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "_city_image") {
        City.findOne({ _city_name: req.body._city_name }).then(function (user) {
            if (user) {
                cb(null, false);
            }
            else if (req.body._city_name === '' || req.body._description === '') {
                cb(null, false);
            }
            else {
                cb(null, true);
            }
        });
    } else if (file.fieldname === "_new_city_image") {
        if (req.body._city_name === '' || req.body._description === '') {
            cb(null, false);
        }
        else {
            cb(null, true);
        }
    } else if (file.fieldname === "_hotel_images") {
        Hotel.findOne({
            _hotel_name: req.body._hotel_name,
            _address: req.body._address, _city_id: req.body._city_id
        }).then(function (result) {
            if (result) {
                cb(null, false);
            }
            else if (req.body._hotel_name === '' ||
                req.body._description === '' ||
                req.body._city_id === '' ||
                req.body._service_id === '' ||
                req.body._service_id === undefined ||
                req.body._star === '' ||
                req.body._phone_number === '' ||
                req.body._check_in_time === '' ||
                req.body._check_out_time === '' ||
                req.body._regulations_check_in === '' ||
                req.body._other_rule === '' ||
                req.body._address === '') {
                cb(null, false);
            }
            else {
                cb(null, true);
            }
        });
    } else if (file.fieldname === "_new_hotel_images") {
        if (req.body._hotel_name === '' ||
            req.body._description === '' ||
            req.body._city_id === '' ||
            req.body._service_id === '' ||
            req.body._service_id === undefined ||
            req.body._star === '' ||
            req.body._phone_number === '' ||
            req.body._check_in_time === '' ||
            req.body._check_out_time === '' ||
            req.body._regulations_check_in === '' ||
            req.body._other_rule === '' ||
            req.body._address === '') {
            cb(null, false);
        }
        else {
            cb(null, true);
        }

    } else if (file.fieldname === "_type_room_image") {
        TypeRoom.findOne({
            _type_room_name: req.body._type_room_name,
            _hotel_id: req.body._hotel_id
        }).then(function (result) {
            if (result) {
                cb(null, false);
            }
            else if (req.body._type_room_name === '' ||
                req.body._description === '' ||
                req.body._hotel_id === '' ||
                req.body._service_id === '' ||
                req.body._person_number === '' ||
                req.body._number_room === '' ||
                req.body._price === '') {
                cb(null, false);
            }
            else {
                cb(null, true);
            }
        });
    } else if (file.fieldname === "_new_type_room_image") {
        if (req.body._type_room_name === '' ||
            req.body._description === '' ||
            req.body._hotel_id === '' ||
            req.body._service_id === '' ||
            req.body._person_number === '' ||
            req.body._number_room === '' ||
            req.body._price === '') {
            cb(null, false);
        }
        else {
            cb(null, true);
        }

    }
    else if (file.fieldname === "_staff_image") {
        Staff.findOne({ _email: req.body._email, _username: req.body._username }).then(function (data) {
            if (data) {
                cb(null, false);
            }
            else if (req.body._firstname === '' ||
                req.body._lastname === '' ||
                req.body._username === '' ||
                req.body._email === '' ||
                req.body._phone_number === '' ||
                req.body._password === '' ||
                req.body._password_con === '' ||
                req.body._hotel_id === '' ||
                req.body._password !== req.body._password_con) {
                cb(null, false);
            }
            else {
                cb(null, true);
            }
        });
    } else if (file.fieldname === "_new_staff_image") {
        if (req.body._firstname === '' ||
            req.body._lastname === '' ||
            req.body._username === '' ||
            req.body._email === '' ||
            req.body._phone_number === '' ||
            req.body._password === '' ||
            req.body._password_con === '' ||
            req.body._hotel_id === '' ||
            req.body._password !== req.body._password_con) {
            cb(null, false);
        }
        else {
            cb(null, true);
        }
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

module.exports = upload;