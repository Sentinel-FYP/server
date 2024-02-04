const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("User requested already discovered cameras", info);
    if (rooms[info.deviceID]?.deviceSocketId) {
      io.to(rooms[info.deviceID].deviceSocketId).emit("cameras:discoverd:get", info);
    } else {
      console.log("No device connected!");
    }
  };
};
