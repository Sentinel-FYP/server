const express = require("express");
const AnomalyLog = require("../../models/AnomalyLog");

const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "/tmp/" });

const router = express.Router();

router.get("/api/anomalyLog/:deviceId", async (req, res) => {
  try {
    const fromDevice = req.params.deviceId;
    if (!fromDevice) return res.status(400).json({ message: "Device ID is required" });

    const anomalyLogs = await AnomalyLog.find({
      fromDevice: fromDevice,
    }).populate("fromDevice");

    if (anomalyLogs.length === 0) return res.status(200).json([]);
    if (anomalyLogs[0].fromDevice.owner != req.user.id)
      return res.status(403).json({
        message: "You are not authorized to access this device's logs",
      });

    res.status(200).json(anomalyLogs);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/api/anomalyLog", upload.single("thumbnail"), async (req, res) => {
  try {
    let anomaly = req.body;

    if (req.file) {
      let image = fs.readFileSync(req.file.path, "base64");

      // Deleting the file from FileSystem
      fs.rmSync(req.file.path);

      anomaly.thumbnail = image;
    } else {
      return res.status(400).json({ message: "Thumbnail is required!" });
    }

    const anomalyLog = await AnomalyLog.create(req.body);
    res.status(200).json(anomalyLog);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;
