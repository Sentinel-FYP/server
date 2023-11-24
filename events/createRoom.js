const variables = require("./variables");

module.exports = (socket) => {
  return (info) => {
    variables.currentDeviceId = info.deviceId;
    if (!variables.rooms[info.deviceId]) {
      console.log("Edge created a room with ID", info.deviceId);
      // Room does not exist for current device. So create it
      variables.rooms[info.deviceId] = { deviceSocketId: socket.id };
    }
  };
};
