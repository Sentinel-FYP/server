const variables = require("./variables");
const EdgeDevice = require("../models/EdgeDevice");

const sendNotification = require("../utils/onesignal");
const { postNotification: storeNotification } = require("../routes/api/notification");

module.exports = (device) => {
  return async () => {
    if (variables.rooms[device.currentDeviceId]) {
      delete variables.rooms[device.currentDeviceId];

      let existingDevice = await EdgeDevice.findOne({ deviceID: device.currentDeviceId });

      if (!existingDevice) {
        console.log("Device with this Id does not exist");
      } else {
        let disconnectTitle = "Edge Device Disconnected!";
        let disconnectMsg = `Edge device ${existingDevice.deviceName} has been disconnected. Ensure it's connectivity to the internet and Reconnect using the mobile device.`;

        storeNotification(existingDevice._id, null, disconnectTitle, disconnectMsg);
        sendNotification(disconnectMsg, disconnectTitle, existingDevice.owner);
      }
    }

    console.log(
      "Disconnect",
      device.currentDeviceId ? "Device: " + device.currentDeviceId : "User"
    );
  };
};
