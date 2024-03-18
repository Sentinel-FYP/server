const EdgeDevice = require("../../models/EdgeDevice");
const sendNotification = require("../../utils/onesignal");

module.exports = (io) => {
  return (info) => {
    console.log("Edge sent alert", info);
    sendAlertToUser(info);
  };
};

async function sendAlertToUser(info) {
  try {
    let { deviceID, notificationTitle, notificationMessage } = info;

    if (!deviceID) {
      throw new Error("Device ID is required!");
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID }).populate("owner");

    if (!existingDevice) {
      throw new Error("Device with this Id does not exist");
    }

    const userId = existingDevice?.owner?._id;

    sendNotification(notificationMessage, notificationTitle, userId);
  } catch (error) {
    console.log("Notification sending Error", error.message);
  }
}
