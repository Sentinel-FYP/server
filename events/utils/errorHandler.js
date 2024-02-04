const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("Edge sent error", info);
    if (rooms[info.deviceId]?.userSocketId) {
      io.to(rooms[info.deviceId].userSocketId).emit("status:error", info);
    } else {
      console.log("No user connected!");
    }
  };
};
