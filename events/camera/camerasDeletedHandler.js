const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("Edge sent camera deletion confirmation", info);
    if (rooms[info.deviceID]?.userSocketId) {
      io.to(rooms[info.deviceID].userSocketId).emit("cameras:deleted", {
        ...info,
      });
    } else {
      console.log("No user connected!");
    }
  };
};
