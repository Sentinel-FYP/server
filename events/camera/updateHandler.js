const Camera = require("../../models/Camera");
const { rooms } = require("../variables");
const getSchemaError = require("../../utils/schemaError");

module.exports = (io) => {
  return async (info) => {
    console.log("Edge sent update", info);
    try {
      let updatedCam = await updateCameraInDB(info);
      console.log("Camera Updated");
      if (rooms[info.deviceID]?.userSocketId) {
        io.to(rooms[info.deviceID].userSocketId).emit(
          "cameras:update",
          updatedCam
        );
      } else {
        console.log("No user connected!");
      }
    } catch (error) {
      const schemaErrorMessage = getSchemaError(error);
      console.log(
        "Cameras Updating Error",
        schemaErrorMessage || error.message
      );
    }
  };
};

async function updateCameraInDB(info) {
  try {
    let { cameraID } = info;

    if (!cameraID) {
      throw new Error("Camera ID is required!");
    }

    let newCam = await Camera.findOneAndUpdate({ _id: cameraID }, info, {
      returnNewDocument: true,
    });
    return newCam;
  } catch (error) {
    throw error;
  }
}
