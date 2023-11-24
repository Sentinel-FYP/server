const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const createSocketError = require("../utils/createSocketError");

dotenv.config();

// Recommended way to get token while using socket io
// console.log("Auth Token", socket.handshake.auth.token);

const auth = (socket, next) => {
  try {
    if (!socket.handshake.query.token) {
      const error = createSocketError("MISSING_TOKEN", "Token is missing!");
      next(error);
    } else {
      const token = socket.handshake.query.token;
      jwt.verify(token, process.env.SECRET_KEY, function (err) {
        if (err) {
          const error = createSocketError("INVALID_TOKEN", "Token is invalid!");
          next(error);
        } else {
          next();
        }
      });
    }
  } catch (error) {
    console.log("Socket Auth Error", error);

    const err = createSocketError("SERVER_ERROR", error.message || "An Error has occured!");
    next(err);
  }
};

module.exports = auth;
