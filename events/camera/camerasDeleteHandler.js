const { rooms } = require("../variables");
const Camera = require("../../models/Camera");
const EdgeDevice = require("../../models/EdgeDevice");

const { sendError } = require("../utils/utils");
module.exports = (io, socket) => {
  return (info) => {
    console.log("User initated cameras deletion", info);
    if (rooms[info.deviceID]?.deviceSocketId) {
      deleteCamera(info)
        .then(() => {
          io.to(rooms[info.deviceID].deviceSocketId).emit("cameras:delete", {
            ...info,
          });

          io.to(rooms[info.deviceID].userSocketId).emit("cameras:deleted", {
            ...info,
          });
        })
        .catch((e) => {
          console.log("Error deleting cameras in DB:", e.message);
          sendError(io, socket?.id, "Error deleting cameras in DB");
        });
    } else {
      console.log("No device connected!");
      sendError(io, socket?.id, "No device connected!");
    }
  };
};

const deleteCamera = async (info) => {
  try {
    const { cameraID, deviceID } = info;
    if (!cameraID) {
      console.log("Camera ID is required");
      return;
    }

    // const result = await Camera.deleteOne({ _id: cameraID });
    // if (result.deletedCount === 0) {
    //   console.log("Camera not found");
    // }

    const device = await EdgeDevice.findOne({ deviceID: deviceID });
    if (!device) {
      console.log("Device not found");
      return;
    }

    const camera = await Camera.findOne({ _id: cameraID });
    if (!camera) {
      console.log("Camera not found");
      return;
    }

    if (camera.device?.toString() !== device._id?.toString()) {
      console.log("Invalid Permissions!");
      return;
    }

    camera.deleted = true;
    await camera.save();
  } catch (error) {
    console.log(error);
  }
};
