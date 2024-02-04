const { rooms } = require("../variables");

module.exports = (io) => {
  return (info) => {
    console.log("User initiated cameras addition", info);
    if (rooms[info.deviceID]?.deviceSocketId) {
      io.to(rooms[info.deviceID].deviceSocketId).emit("cameras:add", info);
    } else {
      console.log("No device connected!");
    }
  };
};
