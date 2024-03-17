const { rooms } = require("../variables");
const { sendError } = require("../utils/utils");

module.exports = (io, socket) => {
  return (info) => {
    console.log("User initated cameras reconnection", info);
    if (rooms[info.deviceID]?.deviceSocketId) {
      io.to(rooms[info.deviceID].deviceSocketId).emit("cameras:reconnect", {
        ...info,
      });
    } else {
      console.log("No device connected!");
      sendError(io, socket?.id, "No device connected!");
    }
  };
};
