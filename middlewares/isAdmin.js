const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "This action can only be performed by an admin" });
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = auth;
