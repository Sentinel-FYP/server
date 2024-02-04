const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("Edge send cameras", info);
    if (rooms[info.deviceID]?.userSocketId) {
      io.to(rooms[info.deviceID].userSocketId).emit("cameras:discovered", info);
    } else {
      console.log("No user connected!");
    }
  };
};
