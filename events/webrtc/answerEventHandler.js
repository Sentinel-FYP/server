const { rooms } = require("../variables");

module.exports = (io) => {
  return (data) => {
    console.log("Server Received answer:", data);
    console.log("Sending to user with Id => ", rooms[data.deviceId].userSocketId);
    io.to(rooms[data.deviceId].userSocketId).emit("answer", data);
  };
};
