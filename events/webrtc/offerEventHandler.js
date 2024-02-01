const { rooms } = require("../variables");

module.exports = (io) => {
  return (data) => {
    console.log("Server Received offer:", data);
    console.log("Sending to edge with Id => ", rooms[data.deviceId]?.deviceSocketId);
    if (rooms[data.deviceId]?.deviceSocketId) {
      io.to(rooms[data.deviceId].deviceSocketId).emit("webrtc:offer", data);
    } else {
      console.log("No device connected!");
    }
  };
};
