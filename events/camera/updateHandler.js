const EdgeDevice = require("../../models/EdgeDevice");
const { rooms } = require("../variables");
const getSchemaError = require("../../utils/schemaError");

module.exports = (io) => {
  return async (info) => {
    console.log("Edge sent update", info);

    try {
      let updatedCam = await updateCameraInDB(info);
      console.log("Camera Updated");
      if (rooms[info.deviceID]?.userSocketId) {
        io.to(rooms[info.deviceID].userSocketId).emit("cameras:update", updatedCam);
      } else {
        console.log("No user connected!");
      }
    } catch (error) {
      const schemaErrorMessage = getSchemaError(error);
      console.log("Cameras Updating Error", schemaErrorMessage || error.message);
    }
  };
};

async function updateCameraInDB(info) {
  try {
    let { deviceID, cameraName } = info;

    if (!deviceID || !cameraName) {
      throw new Error("Device ID and Camera Name is required!");
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID });

    if (!existingDevice) {
      throw new Error("Device with this Id does not exist");
    }

    let existingCamera = existingDevice.cameras.filter((cam) => cam.cameraName === cameraName)[0];
    if (!existingCamera) throw new Error("Camera does not exist");

    let newCam;
    existingDevice.cameras = existingDevice.cameras.map((cam) => {
      newCam = { ...cam };

      if (cam.cameraName === cameraName) {
        newCam = { ...newCam, ...info };
      }

      return newCam;
    });

    await existingDevice.save();

    // Returning the new camera object after updating it.
    existingDevice = existingDevice.toObject();
    newCam = existingDevice.cameras.filter((cam) => cam.cameraName === cameraName)[0];

    return newCam;
  } catch (error) {
    throw error;
  }
}
