const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("Edge sent one camera", info);
    if (rooms[info.deviceId]?.userSocketId) {
      io.to(rooms[info.deviceId].userSocketId).emit("camera:discovered:new", info);
    } else {
      console.log("No user connected!");
    }
  };
};
