const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("Edge sent one camera", info);
    if (rooms[info.deviceID]?.userSocketId) {
      io.to(rooms[info.deviceID].userSocketId).emit("camera:discovered:new", info);
    } else {
      console.log("No user connected!");
    }
  };
};
