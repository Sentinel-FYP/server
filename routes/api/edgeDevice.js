const express = require("express");

const EdgeDevice = require("../../models/EdgeDevice");

const isAdmin = require("../../middlewares/isAdmin");
const { default: mongoose } = require("mongoose");
const getSchemaError = require("../../utils/schemaError");

const router = express.Router();

router.get("/api/edgeDevices", async (req, res) => {
  try {
    let edgeDevices = await EdgeDevice.find({ owner: req.user.id }).populate("owner");
    res.status(200).json(edgeDevices);
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

router.get("/api/edgeDevices/:deviceID", async (req, res) => {
  try {
    let edgeDevices = await EdgeDevice.find({ deviceID: req.params.deviceID }).populate("owner");
    res.status(200).json(edgeDevices);
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

router.post("/api/edgeDevices", isAdmin, async (req, res) => {
  try {
    let deviceID = req.body.deviceID;

    if (!deviceID) {
      return res.status(400).json({ message: "Device Id is required!" });
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID });

    if (existingDevice) {
      return res.status(400).json({ message: "Device with this Id already exists" });
    }

    const edgeDevice = await EdgeDevice.create(req.body);
    res.status(200).json(edgeDevice);
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

router.post("/api/edgeDevices/cameras", async (req, res) => {
  try {
    let { deviceID, cameraName, cameraIP } = req.body;

    if (!deviceID || !cameraName || !cameraIP) {
      return res.status(400).json({ message: "Device Id, Camera Name and Camera IP is required!" });
    }

    let existingDevice = await EdgeDevice.findOne({ deviceID });

    if (!existingDevice) {
      return res.status(400).json({ message: "Device with this Id does not exist" });
    }

    let cameraExists =
      existingDevice.cameras.filter((cam) => cam.cameraIP === cameraIP).length === 1 ? true : false;

    if (cameraExists) {
      return res.status(400).json({ message: "Camera with this IP already exists" });
    }

    existingDevice.cameras = [
      ...existingDevice.cameras,
      { _id: new mongoose.Types.ObjectId(), cameraName, cameraIP },
    ];
    console.log(existingDevice);
    await existingDevice.save();
    res.status(200).json(existingDevice);
  } catch (error) {
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

// @params: deviceID
router.put("/api/edgeDevices/register", async (req, res) => {
  try {
    let edgeDevice = await EdgeDevice.findOne({
      deviceID: req.body.deviceID,
    }).populate("owner");

    if (!edgeDevice) return res.status(404).json({ message: "Device does not exist" });

    if (edgeDevice.owner) return res.status(403).json({ message: "Device already registered" });

    edgeDevice.owner = req.user.id;
    edgeDevice.save();
    res.status(200).json(edgeDevice);
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

module.exports = router;
