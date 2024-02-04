const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("User initiated cameras discovery", info);
    if (rooms[info.deviceID]?.deviceSocketId) {
      io.to(rooms[info.deviceID].deviceSocketId).emit("cameras:discover", info);
    } else {
      console.log("No device connected!");
    }
  };
};
