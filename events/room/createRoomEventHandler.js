const { rooms } = require("../variables");

module.exports = (socket, device) => {
  return (info) => {
    device.currentDeviceId = info.deviceID;
    if (!rooms[info.deviceID]) {
      console.log("Edge created a room with ID", info.deviceID);
      // Room does not exist for current device. So create it
      rooms[info.deviceID] = { deviceSocketId: socket.id };
    } else {
      console.log("Room already exists");
    }
  };
};
