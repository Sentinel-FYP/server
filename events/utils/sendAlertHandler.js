const { rooms } = require("../variables");
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
    let { deviceID, cameraIP, notificationTitle, notificationMessage } = info;

    if (!deviceID || !cameraIP) {
      throw new Error("Device ID and Camera IP is required!");
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID }).populate("owner");

    if (!existingDevice) {
      throw new Error("Device with this Id does not exist");
    }

    let existingCamera = existingDevice.cameras.filter((cam) => cam.cameraIP === cameraIP)[0];
    if (!existingCamera) throw new Error("Camera does not exist");

    const userId = existingDevice?.owner?._id;

    sendNotification(notificationMessage, notificationTitle, userId);
  } catch (error) {
    console.log("Notification sending Error", error);
  }
}
