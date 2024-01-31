const { rooms } = require("../variables");
const EdgeDevice = require("../../models/EdgeDevice");
const mongoose = require("mongoose");

module.exports = (io) => {
  return (info) => {
    console.log("Edge confirmed cameras addition", info);

    addCameraInDB(info)
      .then(() => {
        if (rooms[info.deviceId]?.userSocketId) {
          io.to(rooms[info.deviceId].userSocketId).emit("cameras:added", info);
        } else {
          console.log("No user connected!");
        }
      })
      .catch((e) => console.log("Error adding cameras in DB", e));
  };
};

async function addCameraInDB(info) {
  try {
    let { deviceID, cameraName, localIP, RTSPChannel } = info;

    if (!deviceID || !cameraName || !localIP || !RTSPChannel) {
      throw new Error("Camera fields are Incomplete");
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID });

    if (!existingDevice) {
      throw new Error("Device with this Id does not exist");
    }

    let cameraExists =
      existingDevice.cameras.filter((cam) => cam.localIP === localIP).length === 1 ? true : false;

    if (cameraExists) {
      throw new Error("Camera with this IP already exists");
    }

    existingDevice.cameras = [
      ...existingDevice.cameras,
      { _id: new mongoose.Types.ObjectId(), cameraName, localIP, RTSPChannel },
    ];
    await existingDevice.save();
  } catch (error) {
    console.log("Cameras Adding Error", error);
    throw new Error("An error has occured while saving cameras to DB");
  }
}
