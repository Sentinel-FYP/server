const { rooms } = require("../variables");

module.exports = (io) => {
  return (data) => {
    if (rooms[data.deviceId]?.deviceSocketId) {
      io.to(rooms[data.deviceId].deviceSocketId).emit("stream:end", data);
    } else {
      console.log("No device connected!");
    }
  };
};
