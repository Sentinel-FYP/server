const { rooms } = require("../variables");

module.exports = (io) => {
  return (data) => {
    console.log(rooms, data);
    if (rooms[data.deviceId].deviceSocketId) {
      io.to(rooms[data.deviceId].deviceSocketId).emit("stream:start", data);
    }
  };
};
