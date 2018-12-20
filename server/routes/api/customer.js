//module
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
const transporter = require('../../config/sendEmail');
var randomNumber = require('random-number');
// model
const City = require('../../models/City');
const Service = require('../../models/Service');
const Hotel = require('../../models/Hotel');
const TypeRoom = require('../../models/TypeRoom');
const Review = require('../../models/Review');
const Customer = require('../../models/Customer');
const Order = require('../../models/Order');
const Staff = require('../../models/Staff');

//______________________________________________
function getDataById(req, res) {
  if (req.body._type === "city") {
    City.find(req.params._id, function (err, result) {
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
}
router.post("/getDataByIdAndStatus/:_id", getDataById);

//________________________________________________
function getHotelsByCityId(req, res) {
  if (req.body._address === "undefined") {
    Hotel.find()
      .where('_city_id').equals(req.body._city_id)
      .where('_status').equals('active')
      .then(result => {
        var _image = {};
        var files = {};
        for (let i = 0; i < result.length; i++) {
          _image[result[i]._id] = result[i]._images.split(",");
        }
        for (var key in _image) {
          for (let i = 0; i < _image[key].length; i++) {
            files[key] = fs.readFileSync(_image[key][i]);
          }
        }
        return res.send({ hotels: result, images: files })
      })
      .catch(error => {
        return res.send(error);
      })
  } else {
    Hotel.find({ _address: { $regex: '.*' + req.body._address + '.*' } })
      .where('_city_id').equals(req.body._city_id)
      .where('_status').equals('active')
      .then(result => {
        var _image = {};
        var files = {};
        for (let i = 0; i < result.length; i++) {
          _image[result[i]._id] = result[i]._images.split(",");
        }
        for (var key in _image) {
          for (let i = 0; i < _image[key].length; i++) {
            files[key] = fs.readFileSync(_image[key][i]);
          }
        }
        return res.send({ hotels: result, images: files })
      })
      .catch(error => {
        return res.send(error);
      })
  }
}
router.post("/getHotelsByCityId", getHotelsByCityId);
//__________________________________________________
function getCityName(req, res) {
  City.findById(req.body._city_id, function (err, result) {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
}
router.post("/getCityById", getCityName);

function getTypeRoomsByHotel(req, res) {
  TypeRoom.find()
    .where('_hotel_id').equals(req.body._hotel_id)
    .where('_status').equals('active')
    .then(results => {
      var _image = {};
      var files = {};
      for (let i = 0; i < results.length; i++) {
        _image[results[i]._id] = results[i]._images.split(",");
      }
      for (var key in _image) {
        for (let i = 0; i < _image[key].length; i++) {
          files[key] = fs.readFileSync(_image[key][i]);
        }
      }
      return res.send({ type_rooms: results, images: files })
    })
    .catch(error => {
      return res.send({ error })
    })
}
router.post("/getTypeRoomsByHotel", getTypeRoomsByHotel);

function getAllServices(req, res) {
  Service.find()
    .where('_service_type').equals(req.body.service_type)
    .where('_status').equals('active')
    .then(results => {
      return res.send({ services: results });
    })
    .catch(error => {
      return res.send({ error });
    })
}
router.post("/getAllServices", getAllServices);

const reivewValidation = [
  check("_full_name")
    .not()
    .isEmpty()
    .withMessage("Please enter full name."),
  check("_email")
    .not()
    .isEmpty()
    .withMessage("Please choose email."),
  check("_content")
    .not()
    .isEmpty()
    .withMessage("Please enter content.")
];

function addReviewHotel(req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  var review = new Review({
    _full_name: req.body._full_name,
    _hotel_id: req.body._hotel_id,
    _email: req.body._email,
    _content: req.body._content,
    _status: "active"
  });
  review.save()
    .then((customer) => {
      Hotel.findById(customer._hotel_id, function (err, hotel) {
        var mailSendAdmin = {
          from: 'greenhousehotelsystem@gmail.com',
          to: 'greenhousehotelsystem@gmail.com',
          subject: 'Customer reviews the hotel',
          html: '<h1 style="color: #4790cd;">There was a customer sent the review to ' + hotel._hotel_name + '</h1>' + '\n' + '<p style="color: #000;"><b>Name customer: ' + customer._full_name + '</b></p>' + '\n' + '<p style="color: #000;"><b>Content: ' + customer._content + '</b></p>' + '\n' + '<p style="color: #000;"><b>Please check the review in the system.</b></p>'
        };
        transporter.sendMail(mailSendAdmin, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      });
      return res.send({ success: true, message: "Thank for your review!" });
    })
    .catch(err => {
      return res.send({ success: false, message: "Review have error: " + err });
    });
}
router.post("/addReviewHotel", reivewValidation, addReviewHotel);

function getNumberRoomTypeRoom(req, res) {
  if (req.body._hotel_id !== undefined) {
    var start_date = req.body._start_date;
    var end_date = req.body._end_date;
    Order.find({ _status: { $in: ['Waiting', 'Hired', 'Out of date'] } })
      .where('_hotel_id').equals(req.body._hotel_id)
      .then(orders => {
        var list_array_order_avaible = [];
        for (let j = 0; j < orders.length; j++) {
          if (start_date > orders[j]._check_out_date || end_date < orders[j]._check_in_date ||
            (start_date < orders[j]._check_out_date) && (end_date < orders[j]._check_in_date) ||
            (end_date > orders[j]._check_in_date) && (start_date > orders[j]._check_out_date)) {
          } else {
            list_array_order_avaible.push(orders[j])
          }
        }
        var list_object_order = {};
        list_array_order_avaible.forEach(function (key) {
          if (list_object_order.hasOwnProperty(key._type_room_id)) {
            list_object_order[key._type_room_id] = list_object_order[key._type_room_id] + key._number_room;
          } else {
            list_object_order[key._type_room_id] = key._number_room;
          }
        });
        var final_number_room = [];
        for (var prop in list_object_order) {
          final_number_room.push({ _type_room_id: prop, _number_room: list_object_order[prop] });
        }
        TypeRoom.find()
          .where('_hotel_id').equals(req.body._hotel_id)
          .where('_status').equals('active')
          .then(typeRooms => {
            var list_number_room = {};
            for (let i = 0; i < typeRooms.length; i++) {
              list_number_room[typeRooms[i]._id] = typeRooms[i]._number_room;
            }
            final_number_room.forEach(function (key) {
              if (list_number_room.hasOwnProperty(key._type_room_id)) {
                list_number_room[key._type_room_id] = list_number_room[key._type_room_id] - key._number_room;
              }
            });
            return res.send(list_number_room);
          })
          .catch(err => {
            return res.send(err);
          })
      })
      .catch(err => {
        return res.send(err);
      })
  } else if (req.body._type_room_id !== undefined) {
    var start_date = req.body._start_date;
    var end_date = req.body._end_date;
    if (start_date === "") {
      return res.send({ error: true, message: "Start date have error!" })
    } else if (end_date === "") {
      return res.send({ error: true, message: "End date have error!" })
    } else {
      Order.find({ _status: { $in: ['Waiting', 'Hired', 'Out of date'] } })
        .where('_type_room_id').equals(req.body._type_room_id)
        .then(orders => {
          var list_array_order_avaible = [];
          for (let j = 0; j < orders.length; j++) {
            if (start_date > orders[j]._check_out_date || end_date < orders[j]._check_in_date ||
              (start_date < orders[j]._check_out_date) && (end_date < orders[j]._check_in_date) ||
              (end_date > orders[j]._check_in_date) && (start_date > orders[j]._check_out_date)) {
            } else {
              list_array_order_avaible.push(orders[j])
            }
          }
          var list_object_order = {};
          list_array_order_avaible.forEach(function (key) {
            if (list_object_order.hasOwnProperty(key._type_room_id)) {
              list_object_order[key._type_room_id] = list_object_order[key._type_room_id] + key._number_room;
            } else {
              list_object_order[key._type_room_id] = key._number_room;
            }
          });
          var final_number_room = [];
          for (var prop in list_object_order) {
            final_number_room.push({ _type_room_id: prop, _number_room: list_object_order[prop] });
          }
          TypeRoom.find()
            .where('_id').equals(req.body._type_room_id)
            .where('_status').equals('active')
            .then(typeRooms => {
              var list_number_room = {};
              for (let i = 0; i < typeRooms.length; i++) {
                list_number_room[typeRooms[i]._id] = typeRooms[i]._number_room;
              }
              final_number_room.forEach(function (key) {
                if (list_number_room.hasOwnProperty(key._type_room_id)) {
                  list_number_room[key._type_room_id] = list_number_room[key._type_room_id] - key._number_room;
                }
              });
              return res.send(list_number_room);
            })
            .catch(err => {
              return res.send(err);
            })
        })
        .catch(err => {
          return res.send(err);
        })
    }
  }
}
router.post("/getNumberRoomTypeRoom", getNumberRoomTypeRoom);

const bookRoomValidation = [
  check("_full_name")
    .not()
    .isEmpty()
    .withMessage("Please enter full name."),
  check("_email")
    .not()
    .isEmpty()
    .withMessage("Please enter email."),
  check("_phone_number")
    .not()
    .isEmpty()
    .withMessage("Please enter phone number."),
  check("_identity_card")
    .not()
    .isEmpty()
    .withMessage("Please enter phone number."),
]
function bookRoom(req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  var customer = new Customer({
    _full_name: req.body._full_name,
    _identity_card: req.body._identity_card,
    _phone_number: req.body._phone_number,
    _email: req.body._email,
  });
  customer.save()
    .then((customer) => {
      var gen = randomNumber.generator({
        min: 100000,
        max: 999999,
        integer: true
      })
      var order = new Order({
        _order_id: gen(),
        _check_in_date: req.body._check_in_date,
        _check_out_date: req.body._check_out_date,
        _number_night: req.body._number_night,
        _number_room: req.body._number_room,
        _total_price: req.body._total_price,
        _customer_id: customer._id,
        _hotel_id: req.body._hotel_id,
        _type_room_id: req.body._type_room_id,
        _staff_id: "",
        _note: req.body._note,
        _status: "Waiting"
      });
      order.save()
        .then((order) => {
          var mailSendCustomer = {
            from: 'greenhousehotelsystem@gmail.com',
            to: customer._email,
            subject: 'Booking information',
            html: '<h1 style="color: #4790cd;">Please respond to order information</h1>' + '\n' + '<p style="color: #000;"><b>Service code: ' + order._order_id + '</b></p>' + '\n' + '<p style="color: #000;"><b>You have booked ' + order._number_room + ' room with ' + order._number_night + ' night stay at ' + 'the hotel' + '</b></p>' + '\n' + '<p style="color: #000;"><b>Check-in date is ' + order._check_in_date + ' and check-out date is ' + order._check_out_date + '</b></p>' + '\n' + '<p style="color: #000;"><b>Thank you for using services of GreenHouse.</b></p>' + '\n' + '<p style="color: #000;"><b>Currently, GreenHouse has received and processed your request, but after many attempts to contact us, we have not received any feedback from you.</b></p>' + '\n' + '<b style="color: #000;"><p>Please check the phone number ' + customer._phone_number + ' to ensure that the information you have provided is correct and contact us again 0869 773 517 for assistance to complete the booking.</b></p>' + '\n' + '<p style="color: #000;"><b>Thank you.</b></p>' + '\n' + '<p style="color: #000;"><b>Customer care GreenHouse.</b></p>'
          };
          transporter.sendMail(mailSendCustomer, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          Staff.find()
            .where('_hotel_id').equals("5b87d240fec8075f24eeb0e2")
            .where('_status').equals('active')
            .then(staffs => {
              var list_email_staff = "";
              var total_length = staffs.length;
              for (let i = 0; i < staffs.length; i++) {
                if (i === (total_length - 1)) {
                  list_email_staff = list_email_staff + staffs[i]._email;
                } else {
                  list_email_staff = staffs[i]._email + ",";
                }
              }
              var mailSendStaff = {
                from: 'greenhousehotelsystem@gmail.com',
                to: list_email_staff,
                subject: 'Room rental request',
                html: '<h1 style="color: #4790cd;">There was a room rental request sent to your hotel</h1>' + '\n' + '<p style="color: #000;"><b>Service code ' + order._order_id + '</b></p>' + '\n' + '<p style="color: #000;"><b>Please check the request in the system.</b></p>'
              };
              transporter.sendMail(mailSendStaff, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            })
            .catch(err => {
              console.log(err);
            })
          return res.send({ success: true, message: "Thank you for using our service. Please check your email to see the code details you have set!" });
        })
        .catch(err => {
          return res.send({ success: false, message: "Have some error from order: " + err });
        });
    })
    .catch(err => {
      return res.send({ success: false, message: "Have some error from customer: " + err });
    });

}
router.post("/bookRoom", bookRoomValidation, bookRoom);

function getCityTopDestination(req, res) {
  City.find()
    .where('_status').equals('active')
    .where('_top_destination').equals(true)
    .then(cities => {
      var _image = {};
      var files = {};
      for (let i = 0; i < cities.length; i++) {
        _image[cities[i]._id] = cities[i]._images;
      }
      for (var key in _image) {
        files[key] = fs.readFileSync(_image[key]);
      }
      return res.send({ cities, images: files });
    })
    .catch(error => {
      return res.send({ error });
    });
}
router.get("/getCityTopDestination", getCityTopDestination);

function test(req, res) {
  Staff.find()
    .where('_hotel_id').equals("5b87d240fec8075f24eeb0e2")
    .where('_status').equals('active')
    .then(staffs => {
      var list_email_staff = "";
      var total_length = staffs.length;
      for (let i = 0; i < staffs.length; i++) {
        if (i === (total_length - 1)) {
          list_email_staff = list_email_staff + staffs[i]._email;
        } else {
          list_email_staff = staffs[i]._email + ",";
        }
      }
    })
    .catch(err => {
      console.log(err);
    })
}
router.get("/test", test);
module.exports = router;