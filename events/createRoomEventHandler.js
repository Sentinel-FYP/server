const { rooms } = require("./variables");

module.exports = (socket, device) => {
  return (info) => {
    device.currentDeviceId = info.deviceId;
    if (!rooms[info.deviceId]) {
      console.log("Edge created a room with ID", info.deviceId);
      // Room does not exist for current device. So create it
      rooms[info.deviceId] = { deviceSocketId: socket.id };
    } else {
      console.log("Room already exists");
    }
  };
};
