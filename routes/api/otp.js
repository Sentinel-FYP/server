const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const crypto = require("crypto");

const User = require("../../models/User");
const OTP = require("../../models/OTP");
const getSchemaError = require("../../utils/schemaError");

const sendEmail = require("../../utils/email");

dotenv.config();

const router = express.Router();

router.get("/api/otp", async (req, res) => {
  let { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }

  let user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({
      message: "User with this email does not exist",
    });

  let OTPRecord = await OTP.findOne({ userId: user._id });
  let randomOtp = Math.floor(Math.random() * 999999);
  if (!OTPRecord) {
    OTPRecord = await new OTP({
      userId: user._id,
      otp: randomOtp,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
  }

  console.log("Otp:", OTPRecord);

  const textToSend =
    `Here is your OTP ${OTPRecord.otp} . This OTP will expire in 1 hour.` +
    "\n\nRegards Team Sentinel";

  try {
    let emailResponse = await sendEmail(user.email, "Sentinel OTP", textToSend);
    console.log("Email Response =>", emailResponse);
    res.status(200).json({ message: "OTP sent Successfully" });
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res
      .status(500)
      .send({ message: schemaErrorMessage || error.message || "Something went wrong" });
  }
});

router.post("/api/otp/verify/email", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "User Id and OTP is needed" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "Invalid User ID" });

    const existingOTP = await OTP.findOne({
      userId: user._id,
      otp: otp,
    });
    if (!existingOTP) return res.status(400).json({ message: "Invalid OTP or expired" });

    user.isEmailVerified = true;
    await user.save();
    await existingOTP.deleteOne();

    res.status(200).json({ message: "Email verified sucessfully" });
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

router.post("/api/otp/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "User Email and OTP is needed" });
    }

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "Invalid User Email" });

    const existingOTP = await OTP.findOne({
      userId: user._id,
      otp: otp,
    });
    if (!existingOTP) return res.status(400).json({ message: "Invalid OTP or expired" });

    res
      .status(200)
      .json({ message: "OTP verified sucessfully", token: existingOTP.token, userId: user._id });
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

router.post("/api/otp/reset/password", async (req, res) => {
  try {
    let { userId, token, password } = req.body;

    if (!password || !userId || !token) {
      return res.status(400).json({ message: "User Id, Token and Password is needed" });
    }

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be 8 characters long" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "Invalid User ID" });

    const existingOTP = await OTP.findOne({
      userId: user._id,
      token: token,
    });
    if (!existingOTP) return res.status(400).json({ message: "Invalid Token or expired" });

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_FACTOR));
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    await existingOTP.deleteOne();

    res.status(200).json({ message: "Password changed sucessfully" });
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

module.exports = router;
