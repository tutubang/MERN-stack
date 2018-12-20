//module
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
//config
const upload = require('../../config/upload');
// model
const Staff = require('../../models/Staff');
const Order = require('../../models/Order');

const logValidation = [
    check("_username")
        .not()
        .isEmpty()
        .withMessage("Username is required"),
    check("_password")
        .not()
        .isEmpty()
        .withMessage("Password is required")
];

function loginStaff(req, res) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ errors: errors.mapped() });
    }
    Staff.findOne({
        _username: req.body._username,
        _status: "active"
    }).then(function (staff) {
        if (!staff) {
            return res.send({ success: false, message: "User does not exist!" });
        }
        else if (!staff.comparePassword(req.body._password, staff._password)) {
            return res.send({ success: false, message: "Wrong password!" });
        } else {
            req.session.staff = staff;
            req.session.staffIsLoggedIn = true;
            return res.send({ success: true, message: "You are signed in:" });
        }
    })
        .catch(function (error) {
            console.log(error);
        });
}

//@route POST api/staff
router.post("/login", logValidation, loginStaff);

const changePassValidation = [
    check("_new_password")
        .not()
        .isEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters"),
    check("_password_con",
        "Password confirmation is required or should be the same as password"
    ).custom(function (value, { req }) {
        if (value !== req.body._new_password) {
            throw new Error("Password don't match");
        }
        return value;
    })
]

function changePassword(req, res) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ errors: errors.mapped() });
    }
    Staff.findById(req.body._staff_id)
        .then(function (staff) {
            if (staff.comparePassword(req.body._old_password, staff._password)) {
                var staff = new Staff({
                    _password: req.body._new_password,
                })
                staff._password = staff.hashPassword(staff._password);
                Staff.findByIdAndUpdate(req.body._staff_id, { _password: staff._password }, function (err, result) {
                    if (!err) {
                        req.session.staffIsLoggedIn = false;
                        return res.send({ success: true, message: "Change password success!" });
                    } else {
                        return res.send({ success: false, message: "Change password have error:" + err });
                    }
                });
            } else {
                return res.send({ success: false, message: "Your old password incorrect!" });
            }
        })
}
router.post("/changePassword", changePassValidation, changePassword);

router.get("/logout", (req, res) => {
    req.session.staffIsLoggedIn = false
    res.send({ isLoggedIn: false, message: "Logged out!" });
});

function isLoggedIn(req, res) {
    if (req.session.staffIsLoggedIn) {
        res.send({ isLoggedIn: true, accInfo: req.session.staff });
    } else {
        res.send({ isLoggedIn: false });
    }
}
router.get("/isloggedin", isLoggedIn);

function getTypeRoomsByHotel(req, res) {
    TypeRoom.find()
        .where('_hotel_id').equals(req.body._hotel_id)
        .then(results => {
            return res.send({ type_rooms: results })
        })
        .catch(error => {
            return res.send({ error })
        })
}
router.post("/getTypeRoomsByHotel", getTypeRoomsByHotel);

function getStaffsByHotel(req, res) {
    Staff.find()
        .where('_hotel_id').equals(req.body._hotel_id)
        .then(results => {
            return res.send({ staffs: results })
        })
        .catch(error => {
            return res.send({ error })
        })
}
router.post("/getStaffsByHotel", getStaffsByHotel);
//____________________________________________________________________
//Order handler____________________________________________________
function dateDiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}
function parseDate(str) {
    let ymd = str.split('-');
    return new Date(ymd[0], ymd[1] - 1, ymd[2]);
}

function getOrders(req, res) {
    var updateDate = new Date();
    if (req.body._status === "Waiting") {
        Order.find()
            .where('_hotel_id').equals(req.body._hotel_id)
            .where('_status').equals('Waiting')
            .then(results => {
                var today = new Date();
                var dd_today = today.getDate();
                var mm_today = today.getMonth() + 1;
                var yyyy_today = today.getFullYear();
                if (dd_today < 10) {
                    dd_today = '0' + dd_today;
                }
                if (mm_today < 10) {
                    mm_today = '0' + mm_today;
                }
                var date_now = yyyy_today + '-' + mm_today + '-' + dd_today;
                var order = [];
                for (let i = 0; i < results.length; i++) {
                    if (results[i]._check_in_date < date_now) {
                        order.push(results[i]);
                    }
                }
                for (let i = 0; i < order.length; i++) {
                    Order.findByIdAndUpdate(order[i]._id, { _updateAt: updateDate, _status: 'Canceled' }, function (err) {
                        if (err) {
                            return res.send({ success: false, message: "Handler have error: " + err });
                        }
                    })
                }
                Order.find()
                    .where('_hotel_id').equals(req.body._hotel_id)
                    .where('_status').equals('Waiting')
                    .sort({ _updateAt: "desc" })
                    .then(results => {
                        return res.send({ orders: results })
                    })
                    .catch(error => {
                        return res.send({ error })
                    })
            })
            .catch(error => {
                return res.send({ error })
            })
    } else if (req.body._status === "Canceled") {
        Order.find()
            .where('_hotel_id').equals(req.body._hotel_id)
            .where('_status').equals('Canceled')
            .sort({ _updateAt: "desc" })
            .then(results => {
                return res.send({ orders: results })
            })
            .catch(error => {
                return res.send({ error })
            })
    } else if (req.body._status === "Hired") {
        Order.find()
            .where('_hotel_id').equals(req.body._hotel_id)
            .where('_status').equals('Hired')
            .then(results => {
                var today = new Date();
                var dd_today = today.getDate();
                var mm_today = today.getMonth() + 1;
                var yyyy_today = today.getFullYear();
                if (dd_today < 10) {
                    dd_today = '0' + dd_today;
                }
                if (mm_today < 10) {
                    mm_today = '0' + mm_today;
                }
                var date_now = yyyy_today + '-' + mm_today + '-' + dd_today;
                var order = [];
                for (let i = 0; i < results.length; i++) {
                    if (results[i]._check_out_date < date_now) {
                        order.push(results[i]);
                    }
                }
                for (let i = 0; i < order.length; i++) {
                    var number_night = dateDiff(parseDate(order[i]._check_in_date), parseDate(date_now));
                    var price_room = order[i]._total_price / order[i]._number_night / order[i]._number_room;
                    var total_price_out_date = (number_night - order[i]._number_night) * price_room;
                    var new_total_price = total_price_out_date + order[i]._total_price
                    Order.findByIdAndUpdate(order[i]._id, { _updateAt: updateDate, _number_night: number_night, _total_price: new_total_price, _check_out_date: date_now, _status: 'Out of date' }, function (err) {
                        if (err) {
                            return res.send({ success: false, message: "Handler have error: " + err });
                        }
                    })
                }
                Order.find()
                    .where('_hotel_id').equals(req.body._hotel_id)
                    .where('_status').equals('Hired')
                    .sort({ _updateAt: "desc" })
                    .then(results => {
                        return res.send({ orders: results })
                    })
                    .catch(error => {
                        return res.send({ error })
                    })
            })
            .catch(error => {
                return res.send({ error })
            })
    } else if (req.body._status === "Checked out") {
        Order.find()
            .where('_hotel_id').equals(req.body._hotel_id)
            .where('_status').equals('Checked out')
            .sort({ _updateAt: "desc" })
            .then(results => {
                return res.send({ orders: results })
            })
            .catch(error => {
                return res.send({ error })
            })
    } else if (req.body._status === "Out of date") {
        Order.find()
            .where('_hotel_id').equals(req.body._hotel_id)
            .where('_status').equals('Out of date')
            .sort({ _updateAt: "desc" })
            .then(results => {
                return res.send({ orders: results })
            })
            .catch(error => {
                return res.send({ error })
            })
    }
}
router.post("/getOrders", getOrders);

function handlerOrders(req, res) {
    var updateDate = new Date();
    if (req.body._handler === "Confirm Hired") {
        Order.findByIdAndUpdate(req.body._order_id, { _updateAt: updateDate, _status: 'Hired', _staff_id: req.body._staff_id }, function (err) {
            if (!err)
                return res.send({ success: true, message: "Handler success!" });
            else
                return res.send({ success: false, message: "Handler have error: " + err });
        });
    } else if (req.body._handler === "Cancel") {
        Order.findByIdAndUpdate(req.body._order_id, { _updateAt: updateDate, _status: 'Canceled', _staff_id: req.body._staff_id }, function (err) {
            if (!err)
                return res.send({ success: true, message: "Handler success!" });
            else
                return res.send({ success: false, message: "Handler have error: " + err });
        });
    } else if (req.body._handler === "Check out") {
        Order.findByIdAndUpdate(req.body._order_id, { _updateAt: updateDate, _status: 'Checked out', _staff_id: req.body._staff_id }, function (err) {
            if (!err)
                return res.send({ success: true, message: "Handler success!" });
            else
                return res.send({ success: false, message: "Handler have error: " + err });
        });
    }
}
router.post("/handlerOrders", handlerOrders);

function searchOrders(req, res) {
    if (req.body._status === "Canceled") {
        Order.find({ _order_id: { $regex: req.body._order_id + '.*' } })
            .where('_status').equals("Canceled")
            .sort({ _updateAt: "desc" })
            .then(orders => {
                return res.send(orders);
            })
            .catch(error => {
                return res.send(error);
            })
    } else if (req.body._status === "Waiting") {
        Order.find({ _order_id: { $regex: req.body._order_id + '.*' } })
            .where('_status').equals("Waiting")
            .sort({ _updateAt: "desc" })
            .then(orders => {
                return res.send(orders);
            })
            .catch(error => {
                return res.send(error);
            })
    } else if (req.body._status === "Hired") {
        Order.find({ _order_id: { $regex: req.body._order_id + '.*' } })
            .where('_status').equals("Hired")
            .sort({ _updateAt: "desc" })
            .then(orders => {
                return res.send(orders);
            })
            .catch(error => {
                return res.send(error);
            })
    }
    else if (req.body._status === "Checked out") {
        Order.find({ _order_id: { $regex: req.body._order_id + '.*' } })
            .where('_status').equals("Checked out")
            .sort({ _updateAt: "desc" })
            .then(orders => {
                return res.send(orders);
            })
            .catch(error => {
                return res.send(error);
            })
    } else if (req.body._status === "Out of date") {
        Order.find({ _order_id: { $regex: req.body._order_id + '.*' } })
            .where('_status').equals("Out of date")
            .sort({ _updateAt: "desc" })
            .then(orders => {
                return res.send(orders);
            })
            .catch(error => {
                return res.send(error);
            })
    }

}
router.post("/searchOrders", searchOrders);

module.exports = router;