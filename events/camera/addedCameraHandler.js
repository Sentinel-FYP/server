const { rooms } = require("../variables");
const EdgeDevice = require("../../models/EdgeDevice");
const Camera = require("../../models/Camera");

module.exports = (io) => {
  return (info) => {
    console.log("Edge confirmed cameras addition", info);

    addCameraInDB(info)
      .then((cameraID) => {
        if (rooms[info.deviceID]?.userSocketId) {
          io.to(rooms[info.deviceID].userSocketId).emit("cameras:added", info);
        } else {
          console.log("No user connected!");
        }
        if (rooms[info.deviceID]?.deviceSocketId) {
          io.to(rooms[info.deviceID].deviceSocketId).emit("cameras:added", {
            cameraID,
            ...info,
          });
        } else {
          console.log("No device connected!");
        }
      })
      .catch((e) => console.log("Error adding cameras in DB:", e.message));
  };
};

async function addCameraInDB(info) {
  try {
    let {
      deviceID,
      cameraName,
      cameraIP,
      username,
      password,
      path,
      active,
      thumbnail,
    } = info;

    if (!deviceID || !cameraName || !cameraIP) {
      throw new Error("Camera fields are Incomplete");
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID });

    if (!existingDevice) {
      throw new Error("Device with this Id does not exist");
    }
    const newCamera = await Camera.create({
      cameraName,
      cameraIP,
      username,
      password,
      path,
      active,
      thumbnail,
      device: existingDevice._id,
    });
    console.log(newCamera);
    return newCamera._id;
  } catch (error) {
    throw new Error(error.message);
  }
}
