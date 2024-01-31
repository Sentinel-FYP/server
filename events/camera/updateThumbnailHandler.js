const { rooms } = require("../variables");
const EdgeDevice = require("../../models/EdgeDevice");

module.exports = (io) => {
  return (info) => {
    console.log("Edge sent thumbnail update", info);

    updateThumbnailInDB(info);
  };
};

async function updateThumbnailInDB(info) {
  try {
    let { deviceID, localIP, thumbnail } = info;

    if (!deviceID || !localIP || !thumbnail) {
      throw new Error("Camera fields are Incomplete");
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID });

    if (!existingDevice) {
      throw new Error("Device with this Id does not exist");
    }

    let existingCamera = existingDevice.cameras.filter((cam) => cam.localIP === localIP)[0];
    if (!existingCamera) throw new Error("Camera does not exist");

    existingCamera = { ...existingCamera, thumbnail };
    existingDevice.cameras = existingDevice.cameras.map((cam) =>
      cam.localIP === localIP ? { ...cam, thumbnail } : cam
    );

    await existingDevice.save();
    console.log("Camera Updated");
  } catch (error) {
    console.log("Cameras Updating Error", error);
  }
}
