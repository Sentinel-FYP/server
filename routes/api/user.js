const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../../models/User");
const OTP = require("../../models/OTP");
const getSchemaError = require("../../utils/schemaError");

dotenv.config();

const router = express.Router();

router.put("/api/users/:userID", async (req, res) => {
  try {
    let receivedUser = req.body;
    let userID = req.params.userID;

    if (!receivedUser.email || !receivedUser.firstName || !receivedUser.lastName) {
      return res.status(400).json({ message: "First name, last name and email is required!" });
    }

    let user = await User.findOne({ _id: userID });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    if (receivedUser.email) {
      if (receivedUser.email !== user.email) {
        // User wants to update email
        let exist = await User.findOne({ email: receivedUser.email });
        if (exist) return res.status(400).json({ message: "This email is already occupied!" });
      }
    }

    let updatedUser = await User.findOneAndUpdate({ _id: userID }, receivedUser, {
      new: true,
    });

    // const salt = await bcrypt.genSalt(parseInt(process.env.SALT_FACTOR));
    // receivedUser.password = await bcrypt.hash(password, salt);

    const userData = {
      userID: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    };

    res.status(200).json({ user: userData });
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

router.post("/api/otp/send", async (req, res) => {
  let { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }

  let user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({
      message: "User with this email does not exist",
    });

  let OTP = await OTP.findOne({ userId: user._id });
  let randomOtp = Math.floor(Math.random() * 999999);
  if (!OTP) {
    OTP = await new OTP({
      userId: user._id,
      otp: randomOtp,
    }).save();
  }

  console.log("Otp:", OTP.otp);

  const textToSend =
    `Here is your OTP ${OTP.otp} . This link will expire in 1 hour.` + "\n\nRegards Team Sentinel";

  sendEmail(user.email, "Sentinel OTP", textToSend);

  res.status(200).json({ message: "OTP sent Successfully" });
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
    res.status(500).json({ message: "An error has occured" });
  }
});

router.post("/api/otp/reset/password", async (req, res) => {
  try {
    let { userId, otp, password } = req.body;

    if (!password || !userId || !otp) {
      return res.status(400).json({ message: "User Id, OTP and Password is needed" });
    }

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be 8 characters long" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "Invalid User ID" });

    const existingOTP = await OTP.findOne({
      userId: user._id,
      otp: otp,
    });
    if (!existingOTP) return res.status(400).json({ message: "Invalid OTP or expired" });

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_FACTOR));
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    await existingOTP.deleteOne();

    res.status(200).json({ message: "Password changed sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error has occured" });
  }
});

module.exports = router;
