const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const sendEmail = async (email, subject, text) => {
  return transporter.sendMail({
    from: '"Team Sentinel" ' + process.env.GMAIL, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
  });
};

module.exports = sendEmail;
