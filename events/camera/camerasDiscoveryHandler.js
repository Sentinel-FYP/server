const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("User initiated cameras discovery", info);
    if (rooms[info.deviceId]?.deviceSocketId) {
      io.to(rooms[info.deviceId].deviceSocketId).emit("cameras:discover", info);
    } else {
      console.log("No device connected!");
    }
  };
};
