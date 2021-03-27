const nodemailer = require('nodemailer');


transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.USEREMAIL, // generated ethereal user
        pass: process.env.PASSWORDEMAIL, // generated ethereal password
    },
});

transporter.verify().then(() => {
    console.log('ready for send emails');
})

module.exports = { transporter };