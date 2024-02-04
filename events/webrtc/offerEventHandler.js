const { rooms } = require("../variables");

module.exports = (io) => {
  return (data) => {
    console.log("Server Received offer:", data);
    console.log("Sending to edge with Id => ", rooms[data.deviceID]?.deviceSocketId);
    if (rooms[data.deviceID]?.deviceSocketId) {
      io.to(rooms[data.deviceID].deviceSocketId).emit("webrtc:offer", data);
    } else {
      console.log("No device connected!");
    }
  };
};
