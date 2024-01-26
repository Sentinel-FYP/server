const { rooms } = require("../variables");

module.exports = (io) => {
  return (data) => {
    if (rooms[data.deviceId]?.deviceSocketId) {
      io.to(rooms[data.deviceId].deviceSocketId).emit("stream:start", data);
    } else {
      console.log("No device connected!");
    }
  };
};
