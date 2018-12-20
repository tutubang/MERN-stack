const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'greenhousehotelsystem@gmail.com',
        pass: 'tutubangyb96'
    }
});

module.exports = transporter;