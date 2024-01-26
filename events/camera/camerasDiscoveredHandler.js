const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("Edge send cameras", info);
    io.to(rooms[info.deviceId].userSocketId).emit("cameras:discovered", info);
  };
};
