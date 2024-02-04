const { rooms } = require("../variables");

module.exports = (io) => {
  return (data) => {
    if (rooms[data.deviceID]?.userSocketId) {
      io.to(rooms[data.deviceID].userSocketId).emit("stream:send", data);
    } else {
      console.log("No user connected!");
    }
  };
};
