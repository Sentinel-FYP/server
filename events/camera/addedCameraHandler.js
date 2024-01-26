const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("Edge confirmed cameras addition", info);
    if (rooms[info.deviceId]?.userSocketId) {
      io.to(rooms[info.deviceId].userSocketId).emit("cameras:added", info);
    } else {
      console.log("No user connected!");
    }
  };
};
