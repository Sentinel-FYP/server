const { rooms } = require("../variables");

module.exports = (io) => {
  return (data) => {
    if (rooms[data.deviceID]?.deviceSocketId) {
      io.to(rooms[data.deviceID].deviceSocketId).emit("stream:end", data);
    } else {
      console.log("No device connected!");
    }
  };
};
