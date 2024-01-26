const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("Edge send cameras", info);
    if (rooms[info.deviceId]?.userSocketId) {
      io.to(rooms[info.deviceId].userSocketId).emit("cameras:discovered", info);
    } else {
      console.log("No user connected!");
    }
  };
};
