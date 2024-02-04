const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("Edge sent error", info);
    if (rooms[info.deviceID]?.userSocketId) {
      io.to(rooms[info.deviceID].userSocketId).emit("status:error", info);
    } else {
      console.log("No user connected!");
    }
  };
};
