const { rooms } = require("../variables");

module.exports = (io) => {
  return (data) => {
    if (rooms[data.deviceId]?.userSocketId) {
      io.to(rooms[data.deviceId].userSocketId).emit("stream:send", data);
    } else {
      console.log("No user connected!");
    }
  };
};
