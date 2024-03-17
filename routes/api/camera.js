const express = require("express");

const EdgeDevice = require("../../models/EdgeDevice");
const getSchemaError = require("../../utils/schemaError");
const Camera = require("../../models/Camera");
const router = express.Router();

router.get("/api/cameras", async (req, res) => {
  try {
    const { deviceID, offline } = req.query;
    const { rooms } = require("../../events/variables");
    if (!offline && !rooms[deviceID]) {
      return res.status(500).json({ message: "Device is offline" });
    }
    if (!deviceID) {
      return res.status(400).json({ message: "Device ID is required!" });
    }
    const edgeDevice = await EdgeDevice.findOne({
      deviceID,
    });
    if (!edgeDevice) {
      return res.status(404).json({ message: "Device not found" });
    }

    let cameras = await Camera.find({ device: edgeDevice._id });
    res.status(200).json(cameras);
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res
      .status(500)
      .send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

router.post("/api/cameras", async (req, res) => {
  try {
    let { deviceID, cameraName, cameraIP } = req.body;

    if (!deviceID || !cameraName || !cameraIP) {
      return res
        .status(400)
        .json({ message: "Device Id, Camera Name and Camera IP is required!" });
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID });

    if (!existingDevice) {
      return res
        .status(400)
        .json({ message: "Device with this Id does not exist" });
    }
    const newCamera = await Camera.create({
      ...req.body,
      device: existingDevice._id,
    });
    console.log(newCamera);
    res.status(200).json(newCamera);
  } catch (error) {
    const schemaErrorMessage = getSchemaError(error);
    res
      .status(500)
      .send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

router.delete("/api/cameras/:id", async (req, res) => {
  try {
    const cameraID = req.params.id;
    const result = await Camera.deleteOne({ _id: cameraID });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Camera not found" });
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res
      .status(500)
      .send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

module.exports = router;
