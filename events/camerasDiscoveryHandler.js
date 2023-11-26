const { rooms } = require("./variables");

module.exports = (io) => {
  return (info) => {
    console.log("User initiated cameras discovery", info);
    io.to(rooms[info.deviceId].deviceSocketId).emit("cameras:discover", info);
  };
};
