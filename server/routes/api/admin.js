//module
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
//config
const upload = require('../../config/upload');

// model
const Admin = require('../../models/Admin');
const Staff = require('../../models/Staff');
const City = require('../../models/City');
const Service = require('../../models/Service');
const Hotel = require('../../models/Hotel');
const TypeRoom = require('../../models/TypeRoom');
const Review = require('../../models/Review');
const Order = require('../../models/Order');
//___________________________________________
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

function loginAdmin(req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  Admin.findOne({
    _username: req.body._username,
    _status: "active"
  }).then(function (admin) {
    if (!admin) {
      return res.send({ success: false, message: "User does not exist!" });
    }
    else if (!admin.comparePassword(req.body._password, admin._password)) {
      return res.send({ success: false, message: "Wrong password!" });
    } else {
      req.session.admin = admin;
      req.session.adminIsLoggedIn = true;
      return res.send({ success: true, message: "You are signed in:" });
    }
  })
    .catch(function (error) {
      console.log(error);
    });
}

//@route POST api/admin
router.post("/login", logValidation, loginAdmin);
//__________________________________________________

router.post('/register', function (req, res) {
  var admin = new Admin({
    _username: req.body._username,
    _password: req.body._password,
    _status: "active"
  });

  admin._password = admin.hashPassword(admin._password);
  admin.save().then(admin => {
    return res.json(admin);
  }).catch(err => res.send(err));
});
//__________________________________________________
function isLoggedIn(req, res) {
  if (req.session.adminIsLoggedIn) {
    res.send({ isLoggedIn: true, accInfo: req.session.admin._username });
  } else {
    res.send({ isLoggedIn: false });
  }
}
router.get("/isloggedin", isLoggedIn);
//_______________________________________________________

router.get("/logout", (req, res) => {
  req.session.adminIsLoggedIn = false
  res.send({ isLoggedIn: false, message: "Logged out!" });
});

//_____________________________________________________________
// register account for staff
const staffValidator = [
  check("_email")
    .not()
    .isEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email should be an email address!"),
  check("_phone_number")
    .not()
    .isEmpty()
    .withMessage("Phone number is required"),
  check("_hotel_id")
    .not()
    .isEmpty()
    .withMessage("Hotel is required"),
  check("_staff_image")
    .isEmpty()
    .withMessage("Image is required"),
  check("_firstname")
    .not()
    .isEmpty()
    .withMessage("Name is required!")
    .isLength({ min: 2 })
    .withMessage("Name should be at least 2 letters!")
    .matches(/^([A-z]|\s)+$/)
    .withMessage("Name cannot have numbers"),
  check("_lastname")
    .not()
    .isEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name should be at least 2 letters")
    .matches(/^([A-z]|\s)+$/)
    .withMessage("Firstname cannot have numbers"),
  check("_username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .isLength({ min: 2 })
    .withMessage("Username should be at least 2 letters"),
  check("_password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters"),
  check("_password_con",
    "Password confirmation is required or should be the same as password"
  ).custom(function (value, { req }) {
    if (value !== req.body._password) {
      throw new Error("Password don't match");
    }
    return value;
  })
];

function staffRegister(req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  Staff.findOne({
    _email: req.body._email,
    _username: req.body._username
  }).then(function (result) {
    if (result) {
      return res.send({ success: false, message: "Staff existed!" });
    } else {
      var staff = new Staff({
        _firstname: req.body._firstname,
        _lastname: req.body._lastname,
        _username: req.body._username,
        _email: req.body._email,
        _phone_number: req.body._phone_number,
        _password: req.body._password,
        _hotel_id: req.body._hotel_id,
        _staff_image: req.file.path,
        _status: "active"
      });
      staff._password = staff.hashPassword(staff._password);
      staff.save().then(() => {
        return res.send({ success: true, message: "Add new success." });
      })
        .catch(err => {
          return res.send({ success: false, message: "Add new have error: " + err });
        });
    }
  });
}
router.post("/addStaff", upload.single("_staff_image"), staffValidator, staffRegister);
//_________________________________________________________
const updateStaffValidation = [
  check("_email")
    .not()
    .isEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email should be an email address!"),
  check("_phone_number")
    .not()
    .isEmpty()
    .withMessage("Phone number is required"),
  check("_hotel_id")
    .not()
    .isEmpty()
    .withMessage("Hotel is required"),
  check("_firstname")
    .not()
    .isEmpty()
    .withMessage("Name is required!")
    .isLength({ min: 2 })
    .withMessage("Name should be at least 2 letters!")
    .matches(/^([A-z]|\s)+$/)
    .withMessage("Name cannot have numbers"),
  check("_lastname")
    .not()
    .isEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name should be at least 2 letters")
    .matches(/^([A-z]|\s)+$/)
    .withMessage("Firstname cannot have numbers"),
  check("_username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .isLength({ min: 2 })
    .withMessage("Username should be at least 2 letters"),
];

function updateStaff(req, res) {
  var date_now = new Date();
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send('No record with given id: ${req.params.id}');
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  if (req.file === undefined) {
    var staff = {
      _firstname: req.body._firstname,
      _lastname: req.body._lastname,
      _username: req.body._username,
      _email: req.body._email,
      _phone_number: req.body._phone_number,
      _hotel_id: req.body._hotel_id,
      _updatedAt: date_now
    }
    Staff.findByIdAndUpdate(req.params._id, { $set: staff },
      function (err) {
        if (!err)
          return res.send({ success: true, message: "Update staff successfully!" });
        else
          return res.send({ success: false, message: "Update staff have error: " + err });
      });
  } else {
    var staff = {
      _firstname: req.body._firstname,
      _lastname: req.body._lastname,
      _username: req.body._username,
      _email: req.body._email,
      _phone_number: req.body._phone_number,
      _hotel_id: req.body._hotel_id,
      _staff_image: req.file.path,
      _updateAt: date_now
    }
    Staff.findById(req.params._id, function (err, results) {
      if (err)
        return res.send({ success: false, message: "Update a staff have error: " + err })
      fs.unlink('./' + results._images, (err) => {
        if (err)
          return res.send({ success: false, message: "Update a staff have error: " + err })
      });
    });
    Staff.findByIdAndUpdate(req.params._id, { $set: staff },
      function (err) {
        if (!err)
          return res.send({ success: true, message: "Update staff successfully!" });
        else
          return res.send({ success: false, message: "Update staff have error: " + err });
      });
  }
}
router.put("/updateStaff/:_id", upload.single("_new_staff_image"), updateStaffValidation, updateStaff);
//_________________________________________________________
// City Handler____________________________________________

const cityValidation = [
  check("_city_name")
    .not()
    .isEmpty()
    .withMessage("Please enter city name."),
  check("_description")
    .not()
    .isEmpty()
    .withMessage("Please enter description."),
  check("_city_image")
    .isEmpty()
    .withMessage("Please enter images."),
  check("_city_name").custom(value => {
    return City.findOne({ _city_name: value }).then(function (user) {
      if (user) {
        throw new Error("This city is already in use");
      }
    });
  })
];

function addCity(req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  var city = new City({
    _city_name: req.body._city_name,
    _top_destination: req.body._top_destination,
    _description: req.body._description,
    _images: req.file.path,
    _status: "active"
  });
  city.save()
    .then(() => {
      return res.send({ success: true, message: "Add new success." });
    })
    .catch(err => {
      return res.send({ success: false, message: "Add new have error: " + err });
    });
}
router.post("/addCity", upload.single('_city_image'), cityValidation, addCity);

//_____________________________________________________________

const updateCityValidation = [
  check("_city_name")
    .not()
    .isEmpty()
    .withMessage("Please enter city name."),
  check("_description")
    .not()
    .isEmpty()
    .withMessage("Please enter description.")
];

function updateCity(req, res) {
  var date_now = new Date();
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send('No record with given id: ${req.params.id}');
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  if (req.file === undefined) {
    var city = {
      _city_name: req.body._city_name,
      _top_destination: req.body._top_destination,
      _description: req.body._description,
      _updateAt: date_now
    }
    City.findByIdAndUpdate(req.params._id, { $set: city },
      function (err) {
        if (!err)
          return res.send({ success: true, message: "Update city successfully!" });
        else
          return res.send({ success: false, message: "Update city have error: " + err });
      });
  } else {
    var city = {
      _city_name: req.body._city_name,
      _top_destination: req.body._top_destination,
      _description: req.body._description,
      _images: req.file.path,
      _updateAt: date_now
    }
    City.findById(req.params._id, function (err, results) {
      if (err)
        return res.send({ success: false, message: "Update a city have error: " + err })
      fs.unlink('./' + results._images, (err) => {
        if (err)
          return res.send({ success: false, message: "Update a city have error: " + err })
      });
    });
    City.findByIdAndUpdate(req.params._id, { $set: city },
      function (err) {
        if (!err)
          return res.send({ success: true, message: "Update city successfully!" });
        else
          return res.send({ success: false, message: "Update city have error: " + err });
      });
  }
}
router.put('/updateCity/:_id', upload.single("_new_city_image"), updateCityValidation, updateCity);
//__________________________________________________________
//Service handler____________________________________________

const serviceValidation = [
  check("_service_name")
    .not()
    .isEmpty()
    .withMessage("Please enter service name."),
  check("_service_type")
    .not()
    .isEmpty()
    .withMessage("Please choose service type."),
  check("_description")
    .not()
    .isEmpty()
    .withMessage("Please enter description."),
  check("_service_name").custom(value => {
    return Service.findOne({ _service_name: value }).then(function (user) {
      if (user) {
        throw new Error("This service is already in use.");
      }
    });
  })
];

function addService(req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  var service = new Service({
    _service_name: req.body._service_name,
    _service_type: req.body._service_type,
    _description: req.body._description,
    _status: "active"
  });
  service.save()
    .then(() => {
      return res.send({ success: true, message: "Add new success." });
    })
    .catch(err => {
      return res.send({ success: false, message: "Add new have error: " + err });
    });
}
router.post("/addService", serviceValidation, addService);
//______________________________________________________________

function updateService(req, res) {
  var date_now = new Date();
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send('No record with given id: ${req.params.id}');
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  var service = {
    _service_name: req.body._service_name,
    _service_type: req.body._service_type,
    _description: req.body._description,
    _updateAt: date_now
  };
  Service.findByIdAndUpdate(req.params._id, { $set: service },
    function (err) {
      if (!err)
        return res.send({ success: true, message: "Update service successfully!" });
      else
        return res.send({ success: false, message: "Update service have error: " + err });
    });
}
router.put("/updateService/:_id", serviceValidation, updateService);

//_______________________________________________________________
//Hotel handler__________________________________________________

const HotelValidation = [
  check("_hotel_name")
    .not()
    .isEmpty()
    .withMessage("Please enter service name."),
  check("_city_id")
    .not()
    .isEmpty()
    .withMessage("Please choose city name."),
  check("_star")
    .not()
    .isEmpty()
    .withMessage("Please enter star."),
  check("_phone_number")
    .not()
    .isEmpty()
    .withMessage("Please enter phone number."),
  check("_address")
    .not()
    .isEmpty()
    .withMessage("Please enter address."),
  check("_description")
    .not()
    .isEmpty()
    .withMessage("Please enter description."),
  check("_check_in_time")
    .not()
    .isEmpty()
    .withMessage("Please choose check in time."),
  check("_check_out_time")
    .not()
    .isEmpty()
    .withMessage("Please choose check out time."),
  check("_regulations_check_in")
    .not()
    .isEmpty()
    .withMessage("Please enter regulations check in."),
  check("_other_rule")
    .not()
    .isEmpty()
    .withMessage("Please enter other rule."),
  check("_service_id")
    .not()
    .isEmpty()
    .withMessage("Please enter service name."),
  check("_hotel_images")
    .isEmpty()
    .withMessage("Please enter images.")
];

function addHotel(req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  var path = [];
  for (i = 0; i < req.files.length; i++) {
    path.push(req.files[i].path);
  }
  var hotel = new Hotel({
    _hotel_name: req.body._hotel_name,
    _city_id: req.body._city_id,
    _service_id: req.body._service_id,
    _star: req.body._star,
    _phone_number: req.body._phone_number,
    _address: req.body._address,
    _description: req.body._description,
    _check_in_time: req.body._check_in_time,
    _check_out_time: req.body._check_out_time,
    _regulations_check_in: req.body._regulations_check_in,
    _other_rule: req.body._other_rule,
    _images: path,
    _status: "active"
  });
  Hotel.findOne({
    _hotel_name: req.body._hotel_name,
    _address: req.body._address, _city_id: req.body._city_id
  }).then(function (result) {
    if (result) {
      return res.send({ success: false, message: "Hotel existed!" });
    } else {
      hotel.save()
        .then(() => {
          return res.send({ success: true, message: "Add new success." });
        })
        .catch(err => {
          return res.send({ success: false, message: "Add new have error: " + err });
        });
    }
  });
}
router.post("/addHotel", upload.array("_hotel_images", 10), HotelValidation, addHotel);

//____________________________________________________________________________

const updateHotelValidation = [
  check("_hotel_name")
    .not()
    .isEmpty()
    .withMessage("Please enter service name."),
  check("_city_id")
    .not()
    .isEmpty()
    .withMessage("Please choose city name."),
  check("_star")
    .not()
    .isEmpty()
    .withMessage("Please enter star."),
  check("_phone_number")
    .not()
    .isEmpty()
    .withMessage("Please enter phone number."),
  check("_address")
    .not()
    .isEmpty()
    .withMessage("Please enter address."),
  check("_description")
    .not()
    .isEmpty()
    .withMessage("Please enter description."),
  check("_check_in_time")
    .not()
    .isEmpty()
    .withMessage("Please choose check in time."),
  check("_check_out_time")
    .not()
    .isEmpty()
    .withMessage("Please choose check out time."),
  check("_regulations_check_in")
    .not()
    .isEmpty()
    .withMessage("Please enter regulations check in."),
  check("_other_rule")
    .not()
    .isEmpty()
    .withMessage("Please enter other rule."),
  check("_service_id")
    .not()
    .isEmpty()
    .withMessage("Please enter service name."),
];

function updateHotel(req, res) {
  var date_now = new Date();
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send('No record with given id: ${req.params.id}');
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  if (req.files.length !== 0) {
    var path = [];
    for (i = 0; i < req.files.length; i++) {
      path.push(req.files[i].path);
    }
    var hotel = {
      _hotel_name: req.body._hotel_name,
      _city_id: req.body._city_id,
      _service_id: req.body._service_id,
      _star: req.body._star,
      _phone_number: req.body._phone_number,
      _address: req.body._address,
      _description: req.body._description,
      _check_in_time: req.body._check_in_time,
      _check_out_time: req.body._check_out_time,
      _regulations_check_in: req.body._regulations_check_in,
      _other_rule: req.body._other_rule,
      _images: path,
      _updateAt: date_now
    }
    Hotel.findById(req.params._id, function (err, results) {
      if (err) {
        return res.send({ success: false, message: "Update a hotel have error: " + err });
      }
      else {
        var _image_path = results._images.split(",");
        for (let i = 0; i < _image_path.length; i++) {
          fs.unlink('./' + _image_path[i], (err) => {
            if (err)
              return res.send({ success: false, message: "Update a hotel have error: " + err })
          });
        }
      }
    });
    Hotel.findByIdAndUpdate(req.params._id, { $set: hotel }, function (err) {
      if (!err)
        return res.send({ success: true, message: "Update hotel successfully!" });
      else
        return res.send({ success: false, message: "Update hotel have error: " + err });
    });
  } else {
    var hotel = {
      _hotel_name: req.body._hotel_name,
      _city_id: req.body._city_id,
      _service_id: req.body._service_id,
      _star: req.body._star,
      _phone_number: req.body._phone_number,
      _address: req.body._address,
      _description: req.body._description,
      _check_in_time: req.body._check_in_time,
      _check_out_time: req.body._check_out_time,
      _regulations_check_in: req.body._regulations_check_in,
      _other_rule: req.body._other_rule,
      _updateAt: date_now
    }
    Hotel.findByIdAndUpdate(req.params._id, { $set: hotel },
      function (err) {
        if (!err)
          return res.send({ success: true, message: "Update Hotel successfully!" });
        else
          return res.send({ success: false, message: "Update Hotel have error: " + err });
      });
  }
}
router.put('/updateHotel/:_id', upload.array("_new_hotel_images", 10), updateHotelValidation, updateHotel);
//_______________________________________________________________
//Type room handler______________________________________________

const TypeRoomValidation = [
  check("_type_room_name")
    .not()
    .isEmpty()
    .withMessage("Please enter type room name."),
  check("_hotel_id")
    .not()
    .isEmpty()
    .withMessage("Please choose hotel name."),
  check("_service_id")
    .not()
    .isEmpty()
    .withMessage("Please enter service name."),
  check("_person_number")
    .not()
    .isEmpty()
    .withMessage("Please enter person number."),
  check("_number_room")
    .not()
    .isEmpty()
    .withMessage("Please enter number room."),
  check("_price")
    .not()
    .isEmpty()
    .withMessage("Please enter price."),
  check("_description")
    .not()
    .isEmpty()
    .withMessage("Please enter description."),
  check("_type_room_image")
    .isEmpty()
    .withMessage("Please choose images.")
];

function addTypeRoom(req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  var type_room = new TypeRoom({
    _type_room_name: req.body._type_room_name,
    _hotel_id: req.body._hotel_id,
    _service_id: req.body._service_id,
    _person_number: req.body._person_number,
    _number_room: req.body._number_room,
    _price: req.body._price,
    _description: req.body._description,
    _images: req.file.path,
    _status: "active"
  });
  TypeRoom.findOne({
    _type_room_name: req.body._type_room_name,
    _hotel_id: req.body._hotel_id
  }).then(function (result) {
    if (result) {
      return res.send({ success: false, message: "Type room existed!" });
    } else {
      type_room.save()
        .then(() => {
          return res.send({ success: true, message: "Add new success." });
        })
        .catch(err => {
          return res.send({ success: false, message: "Add new have error: " + err });
        });
    }
  });
}
router.post("/addTypeRoom", upload.single("_type_room_image"), TypeRoomValidation, addTypeRoom);
//___________________________________________________________
const updateTypeRoomValidation = [
  check("_type_room_name")
    .not()
    .isEmpty()
    .withMessage("Please enter type room name."),
  check("_hotel_id")
    .not()
    .isEmpty()
    .withMessage("Please choose hotel name."),
  check("_service_id")
    .not()
    .isEmpty()
    .withMessage("Please enter service name."),
  check("_person_number")
    .not()
    .isEmpty()
    .withMessage("Please enter person number."),
  check("_number_room")
    .not()
    .isEmpty()
    .withMessage("Please enter number number."),
  check("_price")
    .not()
    .isEmpty()
    .withMessage("Please enter price."),
  check("_description")
    .not()
    .isEmpty()
    .withMessage("Please enter description."),
];

function updateTypeRoom(req, res) {
  var date_now = new Date();
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send('No record with given id: ${req.params.id}');
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  if (req.file === undefined) {
    var type_room = {
      _type_room_name: req.body._type_room_name,
      _hotel_id: req.body._hotel_id,
      _service_id: req.body._service_id,
      _person_number: req.body._person_number,
      _number_room: req.body._number_room,
      _price: req.body._price,
      _description: req.body._description,
      _updateAt: date_now
    }
    TypeRoom.findByIdAndUpdate(req.params._id, { $set: type_room },
      function (err) {
        if (!err)
          return res.send({ success: true, message: "Update type room successfully!" });
        else
          return res.send({ success: false, message: "Update type room have error: " + err });
      });
  } else {
    var type_room = {
      _type_room_name: req.body._type_room_name,
      _hotel_id: req.body._hotel_id,
      _service_id: req.body._service_id,
      _person_number: req.body._person_number,
      _number_room: req.body._number_room,
      _price: req.body._price,
      _description: req.body._description,
      _images: req.file.path,
      _updateAt: date_now
    }

    TypeRoom.findById(req.params._id, function (err, results) {
      if (err)
        return res.send({ success: false, message: "Update a type room have error: " + err })
      fs.unlink('./' + results._images, (err) => {
        if (err)
          return res.send({ success: false, message: "Update a type room have error: " + err })
      });
    });
    TypeRoom.findByIdAndUpdate(req.params._id, { $set: type_room },
      function (err) {
        if (!err)
          return res.send({ success: true, message: "Update type room successfully!" });
        else
          return res.send({ success: false, message: "Update type room have error: " + err });
      });
  }
}
router.put("/updateTypeRoom/:_id", upload.single("_new_type_room_image"), updateTypeRoomValidation, updateTypeRoom);

//_______________________________________________________________
//Processed for all__________________________________________
function cityStatusHandler(req, res, city_id) {
  City.findById(req.params._id, function (err, result) {
    if (err) { return res.send("Have error: " + err); }
    else {
      var status;
      if (result._status === "active") {
        status = "deactive";
      } else if (result._status === "deactive") {
        status = "active";
      }
      City.findByIdAndUpdate(city_id, { $set: { _status: status } }, function (err, result) {
        if (!err) {
          hotelStatusHandler(req, res, result._id, status);
          return res.send({ success: true, message: "Change status successfully!" });
        }
        else {
          return res.send({ success: false, message: "Change status have error: " + err });
        }
      });
    }
  });
}

function hotelStatusHandler(req, res, city_id, status) {
  if (city_id === null) {
    Hotel.findById(req.params._id, function (err, result) {
      if (err) { return res.send("Have error: " + err); }
      else {
        let status;
        if (result._status === "active") {
          status = "deactive";
        } else if (result._status === "deactive") {
          status = "active";
        }
        Hotel.findByIdAndUpdate(result._id, { $set: { _status: status } }, function (err, result) {
          if (!err)
            return res.send({ success: true, message: "Change status successfully!" });
          else
            return res.send({ success: false, message: "Change status have error: " + err });
        });
      }
    });
  } else {
    Hotel.find({ _city_id: city_id }, function (err, result) {
      if (err) { return res.send("Have error: " + err); }
      else {
        if (result._status !== status) {
          result.map(hotel => {
            Hotel.findById(hotel._id, function (err, result) {
              if (err) { return res.send("Have error: " + err); }
              else {
                Hotel.findByIdAndUpdate(result._id, { $set: { _status: status } }, (err, result) => { });
                staffStatusHandler(req, res, result._id, status);
                typeRoomStatusHandler(req, res, result._id, status);
              }
            });
          });
        }
      }
    });
  }
}
function typeRoomStatusHandler(req, res, hotel_id, status) {
  if (hotel_id === null) {
    TypeRoom.findById(req.params._id, function (err, result) {
      if (err) { return res.send("Have error: " + err); }
      else {
        var status;
        if (result._status === "active") {
          status = "deactive";
        } else if (result._status === "deactive") {
          status = "active";
        }
        TypeRoom.findByIdAndUpdate(req.params._id, { $set: { _status: status } }, function (err, result) {
          if (!err)
            return res.send({ success: true, message: "Change status successfully!" });
          else
            return res.send({ success: false, message: "Change status have error: " + err });
        });
      }
    });
  } else {
    TypeRoom.find({ _hotel_id: hotel_id }, function (err, result) {
      if (err) { return res.send("Have error: " + err); }
      else {
        if (result._status !== status) {
          result.map(type_room => {
            TypeRoom.findById(type_room._id, function (err, result) {
              if (err) { return res.send("Have error: " + err); }
              else {
                TypeRoom.findByIdAndUpdate(result._id, { $set: { _status: status } }, (err, result) => { });
              }
            });
          });
        }
      }
    });
  }
}
function staffStatusHandler(req, res, hotel_id, status) {
  if (hotel_id === null) {
    Staff.findById(req.params._id, function (err, result) {
      if (err) { return res.send("Have error: " + err); }
      else {
        var status;
        if (result._status === "active") {
          status = "deactive";
        } else if (result._status === "deactive") {
          status = "active";
        }
        Staff.findByIdAndUpdate(req.params._id, { $set: { _status: status } }, function (err, result) {
          if (!err)
            return res.send({ success: true, message: "Change status successfully!" });
          else
            return res.send({ success: false, message: "Change status have error: " + err });
        });
      }
    });
  } else {
    Staff.find({ _hotel_id: hotel_id }, function (err, result) {
      if (err) { return res.send("Have error: " + err); }
      else {
        if (result._status !== status) {
          result.map(staff => {
            Staff.findById(staff._id, function (err, result) {
              if (err) { return res.send("Have error: " + err); }
              else {
                Staff.findByIdAndUpdate(result._id, { $set: { _status: status } }, (err, result) => { });
              }
            });
          });
        }
      }
    });
  }
}

function statusHandler(req, res) {
  if (req.body._type === "city") {
    cityStatusHandler(req, res, req.params._id);
  }
  else if (req.body._type === "hotel") {
    hotelStatusHandler(req, res, null, null);
  }
  else if (req.body._type === "type_room") {
    typeRoomStatusHandler(req, res, null, null);
  }
  else if (req.body._type === "staff") {
    staffStatusHandler(req, res, null, null);
  }
  else if (req.body._type === "service") {
    Service.findById(req.params._id, function (err, result) {
      if (err) { return res.send("Have error: " + err); }
      else {
        var status;
        if (result._status === "active") {
          status = "deactive";
        } else if (result._status === "deactive") {
          status = "active";
        }
        Service.findByIdAndUpdate(req.params._id, { $set: { _status: status } }, function (err, result) {
          if (!err)
            return res.send({ success: true, message: "Change status successfully!" });
          else
            return res.send({ success: false, message: "Change status have error: " + err });
        });
      }
    });
  }
  else if (req.body._type === "review") {
    Review.findById(req.params._id, function (err, result) {
      if (err) { return res.send("Have error: " + err); }
      else {
        var status;
        if (result._status === "active") {
          status = "deactive";
        } else if (result._status === "deactive") {
          status = "active";
        }
        var date_now = new Date();
        Review.findByIdAndUpdate(req.params._id, { $set: { _status: status, _updateAt: date_now } }, function (err, result) {
          if (!err)
            return res.send({ success: true, message: "Change status successfully!" });
          else
            return res.send({ success: false, message: "Change status have error: " + err });
        });
      }
    });
  }
}
router.post("/statusHandler/:_id", statusHandler);

//_______________________________________________________

function searchDataByName(req, res) {
  if (req.body._type === "city") {
    City.find({ _city_name: { $regex: req.body._city_name + '.*' } }, function (err, result) {
      if (!err)
        return res.send(result);
      else
        return res.send({ success: false, message: "Have error: " + err });
    });
  }
  else if (req.body._type === "service") {
    Service.find({ _service_name: { $regex: req.body._service_name + '.*' } }, function (err, result) {
      if (!err)
        return res.send(result);
      else
        return res.send({ success: false, message: "Have error: " + err });
    });
  }
  else if (req.body._type === "hotel") {
    Hotel.find({ _hotel_name: { $regex: req.body._hotel_name + '.*' } }, function (err, result) {
      if (!err)
        return res.send(result);
      else
        return res.send({ success: false, message: "Have error: " + err });
    });
  }
  else if (req.body._type === "type_room") {
    Hotel.find({ _hotel_name: { $regex: req.body._hotel_name + '.*' } }, function (err, hotels) {
      var hotel_id = [];
      for (let i = 0; i < hotels.length; i++) {
        hotel_id.push(hotels[i]._id);
      }
      TypeRoom.find({ _hotel_id: hotel_id }, function (err, type_rooms) {
        if (!err) {
          return res.send(type_rooms);
        }
      });
    });
  }
  else if (req.body._type === "staff") {
    Staff.find({ _firstname: { $regex: req.body._firstname + '.*' } }, function (err, result) {
      if (!err)
        return res.send(result);
      else
        return res.send({ success: false, message: "Have error: " + err });
    });
  }
  else if (req.body._type === "review") {
    Review.find({ _email: { $regex: req.body._email + '.*' } }, function (err, result) {
      if (!err)
        return res.send(result);
      else
        return res.send({ success: false, message: "Have error: " + err });
    });
  }
}
router.post("/searchDataByName", searchDataByName);

//____________________________________________________________
function countOrderHotel(req, res) {
  if (req.body._status === "Hired") {
    Order.countDocuments({ _hotel_id: req.body._hotel_id, _status: 'Hired' }, function (err, count) {
      if (err) {
        return res.send({ err });
      } else {
        return res.send({ count });
      }
    });
  } else if (req.body._status === "Canceled") {
    Order.countDocuments({ _hotel_id: req.body._hotel_id, _status: 'Canceled' }, function (err, count) {
      if (err) {
        return res.send({ err });
      } else {
        return res.send({ count });
      }
    });
  } else if (req.body._status === "Waiting") {
    Order.countDocuments({ _hotel_id: req.body._hotel_id, _status: 'Waiting' }, function (err, count) {
      if (err) {
        return res.send({ err });
      } else {
        return res.send({ count });
      }
    });
  } else if (req.body._status === "Checked out") {
    Order.countDocuments({ _hotel_id: req.body._hotel_id, _status: 'Checked out' }, function (err, count) {
      if (err) {
        return res.send({ err });
      } else {
        return res.send({ count });
      }
    });
  } else if (req.body._status === "Out of date") {
    Order.countDocuments({ _hotel_id: req.body._hotel_id, _status: 'Out of date' }, function (err, count) {
      if (err) {
        return res.send({ err });
      } else {
        return res.send({ count });
      }
    });
  }

}
router.post("/countOrderHotel", countOrderHotel);


module.exports = router;