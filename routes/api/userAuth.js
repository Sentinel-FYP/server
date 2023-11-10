const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../../models/User");

dotenv.config();

const router = express.Router();

router.post("/api/signup", async (req, res) => {
  try {
    const { password } = req.body;
    let receivedUser = req.body;
    receivedUser.roles = ["user"];

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(403).json({ message: "User already Exists" });
    if (receivedUser.password !== receivedUser.confirmPassword)
      return res.status(403).json({ message: "Password do not match" });

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_FACTOR));

    receivedUser.password = await bcrypt.hash(password, salt);

    user = await User.create(receivedUser);
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    const userData = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    res.status(200).json({ user: userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid Credentials" });

    const isAdmin =
      user.roles.filter((role) => role === "admin").length === 1 ? true : false;

    const token = jwt.sign(
      { email: user.email, id: user._id, isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    const userData = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin,
    };

    res.status(200).json({ user: userData, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

module.exports = router;
