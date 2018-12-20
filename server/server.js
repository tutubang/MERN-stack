const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const general = require('./routes/api/general');
const admin = require('./routes/api/admin');
const customer = require('./routes/api/customer');
const staff = require('./routes/api/staff');
const app = express();

//Bodyparser Middleware
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//DB config
const db = require('./config/keys').mongoURL;
mongoose.connect(db, { useNewUrlParser: true }, function (err) {
	if (!err)
		console.log('MongoDB connection successed!');
	else
		console.log('Error in DB connection: ' + err);
});

app.use(
	cors({
		origin: [
			"http://localhost:8080"
		],
		methods: [
			"GET",
			"HEAD",
			"POST",
			"DELETE",
			"PUT",
			"PATCH",
			"OPTIONS"
		],
		credentials: true
	})
);

app.use(session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 * 30}
}));

//Use routes
app.use('/api/admin', admin);
app.use('/api/general', general);
app.use('/api/customer', customer);
app.use('/api/staff', staff);
const port = process.env.PORT || 8000;
app.listen(port, () => console.log('Server started on port:' + port));
