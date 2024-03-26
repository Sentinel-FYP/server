const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const sendEmail = (email, subject, text) => {
  console.log(email, subject, text);
  transporter
    .sendMail({
      from: '"Team Sentinel" ' + process.env.GMAIL, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    })
    .then((info) => {
      console.log("Email => ", { info });
    })
    .catch((e) => console.log("Email Error", e));
};

module.exports = sendEmail;
