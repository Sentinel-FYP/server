const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../../models/User");
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

module.exports = router;
