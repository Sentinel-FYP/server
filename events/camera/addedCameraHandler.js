const { rooms } = require("../variables");
const EdgeDevice = require("../../models/EdgeDevice");
const mongoose = require("mongoose");

module.exports = (io) => {
  return (info) => {
    console.log("Edge confirmed cameras addition", info);

    addCameraInDB(info)
      .then(() => {
        if (rooms[info.deviceID]?.userSocketId) {
          io.to(rooms[info.deviceID].userSocketId).emit("cameras:added", info);
        } else {
          console.log("No user connected!");
        }
      })
      .catch((e) => console.log("Error adding cameras in DB:", e.message));
  };
};

async function addCameraInDB(info) {
  try {
    let { deviceID, cameraName, cameraIP, username, password, active, thumbnail } = info;

    if (!deviceID || !cameraName || !cameraIP || !username || !password) {
      throw new Error("Camera fields are Incomplete");
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID });

    if (!existingDevice) {
      throw new Error("Device with this Id does not exist");
    }

    let cameraExists =
      existingDevice.cameras.filter((cam) => cam.cameraName === cameraName).length === 1
        ? true
        : false;

    if (cameraExists) {
      throw new Error("Camera with this Name already exists");
    }

    existingDevice.cameras = [
      ...existingDevice.cameras,
      {
        _id: new mongoose.Types.ObjectId(),
        cameraName,
        cameraIP,
        username,
        password,
        active,
        thumbnail,
      },
    ];
    await existingDevice.save();
  } catch (error) {
    throw new Error(error.message);
  }
}
