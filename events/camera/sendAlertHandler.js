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
    let { deviceID, localIP } = info;

    if (!deviceID || !localIP) {
      throw new Error("Device ID and Local Camera IP is required!");
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID }).populate("owner");

    if (!existingDevice) {
      throw new Error("Device with this Id does not exist");
    }

    let existingCamera = existingDevice.cameras.filter((cam) => cam.localIP === localIP)[0];
    if (!existingCamera) throw new Error("Camera does not exist");

    const deviceName = existingDevice.deviceName;
    const cameraName = existingCamera.cameraName;
    const userId = existingDevice?.owner?._id;

    sendNotification(
      `Anomaly detected on ${cameraName} Camera at ${deviceName}`,
      "Anomaly Detected",
      userId
    );
  } catch (error) {
    console.log("Notification sending Error", error);
  }
}
