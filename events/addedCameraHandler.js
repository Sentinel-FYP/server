const { rooms } = require("./variables");

module.exports = (io) => {
  return (info) => {
    console.log("Edge confirmed cameras addition", info);
    io.to(rooms[info.deviceId].userSocketId).emit("cameras:added", info);
  };
};
