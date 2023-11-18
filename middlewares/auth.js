const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(400).send({ message: "Provide an auth token" });

    const token = req.headers.authorization.split(" ")[1];

    decodedData = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedData;

    next();
  } catch (error) {
    console.log("Auth Error", error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = auth;
