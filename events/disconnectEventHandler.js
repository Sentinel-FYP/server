const variables = require("./variables");

module.exports = (device) => {
  return () => {
    if (variables.rooms[device.currentDeviceId]) {
      delete variables.rooms[device.currentDeviceId];
    }

    console.log(
      "Disconnect",
      device.currentDeviceId ? "Device: " + device.currentDeviceId : "User"
    );
  };
};
