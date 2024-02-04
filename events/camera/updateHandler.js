const EdgeDevice = require("../../models/EdgeDevice");
const getSchemaError = require("../../utils/schemaError");

module.exports = () => {
  return (info) => {
    console.log("Edge sent update", info);

    updateCameraInDB(info);
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

    console.log("Prev:", existingDevice);

    existingDevice.cameras = existingDevice.cameras.map((cam) => {
      let newCam = { ...cam };

      if (cam.cameraName === cameraName) {
        // if (thumbnail) {
        //   newCam = { ...newCam, thumbnail };
        // }

        // if (active !== undefined) {
        //   newCam = { ...newCam, active };
        // }

        newCam = { ...newCam, ...info };
      }

      return newCam;
    });

    console.log("Updated:", existingDevice);

    await existingDevice.save();
    console.log("Camera Updated");
  } catch (error) {
    const schemaErrorMessage = getSchemaError(error);
    console.log("Cameras Updating Error", schemaErrorMessage || error.message);
  }
}
