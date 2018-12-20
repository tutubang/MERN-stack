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
const City = require('../../models/City');
const Service = require('../../models/Service');
const Hotel = require('../../models/Hotel');
const TypeRoom = require('../../models/TypeRoom');
const Review = require('../../models/Review');
const Customer = require('../../models/Customer');
//___________________________________________

function getDataByStatus(req, res) {
    if (req.body._type === "city") {
        City.find()
            .where('_status').equals('active')
            .sort({ _city_name: 1 })
            .then(cities => {
                res.json(cities);
            })
            .catch(error => {
                res.json(error);
            });
    } else if (req.body._type === "service") {
        if (req.body._type_service === "hotel") {
            Service.find()
                .where('_status').equals('active')
                .where('_service_type').equals(1)
                .sort({ _service_name: 1 })
                .then(services => {
                    res.json(services);
                })
                .catch(error => {
                    res.json(error);
                });
        } else if (req.body._type_service === "type_room") {
            Service.find()
                .where('_status').equals('active')
                .where('_service_type').equals(2)
                .sort({ _service_name: 1 })
                .then(services => {
                    res.json(services);
                })
                .catch(error => {
                    res.json(error);
                });
        }
    } else if (req.body._type === "hotel") {
        Hotel.find()
            .where('_status').equals('active')
            .sort({ _hotel_name: 1 })
            .then(hotels => {
                res.json(hotels);
            })
            .catch(error => {
                res.json(error);
            });
    } else if (req.body._type === "type_room") {
        TypeRoom.find()
            .where('_status').equals('active')
            .sort({ _type_room_name: 1 })
            .then(type_rooms => {
                res.json(type_rooms);
            })
            .catch(error => {
                res.json(error);
            });
    }
}
router.post("/getDataByStatus", getDataByStatus);

//___________________________________________________________

function getDataById(req, res) {
    if (req.body._type === "city") {
        City.findById(req.params._id, function (err, result) {
            if (err) { return res.send("Have error: " + err); }
            else {
                fs.readFile(result._images, function (err, file) {
                    if (err)
                        return res.send("Have error: " + err);
                    return res.send({ city: result, image: file });
                });
            }
        });
    }
    else if (req.body._type === "service") {
        Service.findById(req.params._id, function (err, result) {
            if (err) { return res.send("Have error: " + err); }
            else {
                return res.send({ service: result });
            }
        });
    }
    else if (req.body._type === "hotel") {
        if (!ObjectID.isValid(req.params._id))
            return res.status(400).send('No record with given id: ${req.params.id}');
        Hotel.findById(req.params._id, function (err, result) {
            if (err) { return res.send("Have error in find: " + err); }
            else {
                var _image_path = result._images.split(",");
                var files = [];
                for (let i = 0; i < _image_path.length; i++) {
                    var dataFile = fs.readFileSync(_image_path[i]);
                    files.push(dataFile);
                }
                return res.send({ hotel: result, image: files });
            }
        });
    }
    else if (req.body._type === "type_room") {
        if (!ObjectID.isValid(req.params._id))
            return res.status(400).send('No record with given id: ${req.params.id}');
        TypeRoom.findById(req.params._id, function (err, result) {
            if (err) { return res.send("Have error in find: " + err); }
            else {
                fs.readFile(result._images, function (err, file) {
                    if (err)
                        return res.send("Have error: " + err);
                    return res.send({ type_room: result, image: file });
                });
            }
        });
    }
    else if (req.body._type === "staff") {
        Staff.findById(req.params._id, function (err, result) {
            if (err) { return res.send("Have error: " + err); }
            else {
                fs.readFile(result._staff_image, function (err, file) {
                    if (err)
                        return res.send("Have error: " + err);
                    return res.send({ staff: result, image: file });
                });
            }
        });
    }
    else if (req.body._type === "customer") {
        Customer.findById(req.params._id, function (err, result) {
            if (err) { return res.send("Have error: " + err); }
            else {
                return res.send({ customer: result });
            }
        });
    }
}
router.post("/getDataById/:_id", getDataById);

//___________________________________________________________

function showAllData(req, res) {
    if (req.body._type === "city") {
        City.find()
            .sort({ _createAt: "desc" })
            .then(cities => {
                res.json(cities);
            })
            .catch(error => {
                res.json(error);
            });
    } else if (req.body._type === "service") {
        Service.find()
            .sort({ _createAt: "desc" })
            .then(services => {
                res.json(services);
            })
            .catch(error => {
                res.json(error);
            });
    }
    else if (req.body._type === "hotel") {
        Hotel.find()
            .sort({ _createAt: "desc" })
            .then(hotels => {
                City.find()
                    .sort({ _createAt: "desc" })
                    .then(cities => {
                        res.json({ hotels, cities });
                    })
                    .catch(error => {
                        res.json(error);
                    });
            })
            .catch(error => {
                res.json(error);
            });
    }
    else if (req.body._type === "type_room") {
        TypeRoom.find()
            .sort({ _createAt: "desc" })
            .then(type_rooms => {
                Hotel.find()
                    .sort({ _createAt: "desc" })
                    .then(hotels => {
                        res.json({ type_rooms, hotels });
                    })
                    .catch(error => {
                        res.json(error);
                    });
            })
            .catch(error => {
                res.json(error);
            });
    } else if (req.body._type === "staff") {
        Staff.find()
            .sort({ _createAt: "desc" })
            .then(staffs => {
                Hotel.find()
                    .sort({ _createAt: "desc" })
                    .then(hotels => {
                        res.json({ hotels, staffs });
                    })
                    .catch(error => {
                        res.json(error);
                    });
            })
            .catch(error => {
                res.json(error);
            });
    } else if (req.body._type === "review") {
        Review.find()
            .where('_hotel_id').equals(req.body._hotel_id)
            .sort({ _updateAt: "desc" })
            .then(reviews => {
                res.json({ reviews });
            })
            .catch(error => {
                res.json(error);
            });
    } else if (req.body._type === "customer") {
        Customer.find()
            .then(customers => {
                res.json({ customers });
            })
            .catch(error => {
                res.json(error);
            });
    }
}
router.post("/showAllData", showAllData);

//____________________________________________________________

function getTypeRomeByHotel(req, res) {
    TypeRoom.find()
        .where('_hotel_id').equals(req.body._hotel_id)
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.json(error);
        })
}
router.post("/getTypeRomeByHotel", getTypeRomeByHotel);
//_______________________________________________________________

function getReviewByHotel(req, res) {
    Review.find()
        .where('_hotel_id').equals(req.body._hotel_id)
        .where('_status').equals('active')
        .sort({ _createAt: "desc" })
        .then(results => {
            return res.send({ reviews: results });
        })
        .catch(error => {
            return res.send({ error });
        })
}
router.post("/getReviewByHotel", getReviewByHotel);

function countReviewHotel(req, res) {
    Review.countDocuments({ _hotel_id: req.body._hotel_id, _status: 'active' }, function (err, count) {
        if (err) {
            return res.send({ err });
        } else {
            return res.send({ count });
        }
    });
}
router.post("/countReviewHotel", countReviewHotel);

function countAllReviewHotel(req, res) {
    Hotel.find()
        .where('_status').equals('active')
        .then(async hotels => {
            let count = {};
            for (let i = 0; i < hotels.length; i++) {
                count[hotels[i]._id] = await count_document_promise(hotels[i]._id)
            }
            return res.send({ count });
        })
        .catch(error => {
            return res.send(error);
        })
}

function count_document_promise(_id) {
    return new Promise(resolve => {
        Review.countDocuments({ _hotel_id: _id, _status: 'active' }, function (err, count) {
            resolve(count)
        });
    })
}
router.get("/countAllReviewHotel", countAllReviewHotel);

module.exports = router;