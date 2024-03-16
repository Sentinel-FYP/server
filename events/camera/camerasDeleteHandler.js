const { rooms } = require("../variables");
const Camera = require("../../models/Camera");

module.exports = (io) => {
  return (info) => {
    console.log("User initated cameras deletion", info);
    deleteCamera(info)
      .then(() => {
        if (rooms[info.deviceID]?.deviceSocketId) {
          io.to(rooms[info.deviceID].deviceSocketId).emit("cameras:delete", {
            ...info,
          });
        } else {
          console.log("No device connected!");
        }
      })
      .catch((e) => console.log("Error adding cameras in DB:", e.message));
  };
};

const deleteCamera = async (info) => {
  try {
    const cameraID = info.cameraID;
    if (!cameraID) {
      console.log("Camera ID is required");
      return;
    }
    const result = await Camera.deleteOne({ _id: cameraID });
    if (result.deletedCount === 0) {
      console.log("Camera not found");
    }
  } catch (error) {
    console.log(error);
  }
};
