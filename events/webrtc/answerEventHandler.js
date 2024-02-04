const { rooms } = require("../variables");

module.exports = (io) => {
  return (data) => {
    console.log("Server Received answer:", data);
    console.log("Sending to user with Id => ", rooms[data.deviceID]?.userSocketId);
    if (rooms[data.deviceID]?.userSocketId) {
      io.to(rooms[data.deviceID].userSocketId).emit("webrtc:answer", data);
    } else {
      console.log("No user connected!");
    }
  };
};
