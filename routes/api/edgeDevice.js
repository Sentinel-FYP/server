const express = require("express");

const EdgeDevice = require("../../models/EdgeDevice");

const router = express.Router();

router.get("/api/edgeDevices", async (req, res) => {
  try {
    let edgeDevices = await EdgeDevice.find({ owner: req.user.id }).populate(
      "owner"
    );
    res.status(200).json(edgeDevices);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// @params: deviceID
router.put("/api/edgeDevice/register", async (req, res) => {
  try {
    let edgeDevice = await EdgeDevice.findOne({
      deviceID: req.body.deviceID,
    });
    if (edgeDevice)
      return res.status(403).json({ message: "Device already registered" });

    edgeDevice = await EdgeDevice.create({
      deviceID: req.body.deviceID,
      owner: req.user.id,
    });

    res.status(200).json(edgeDevice);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});
