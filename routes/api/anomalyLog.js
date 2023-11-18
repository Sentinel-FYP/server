const express = require("express");
const AnomalyLog = require("../../models/AnomalyLog");

const router = express.Router();

router.get("/api/anomalyLog", async (req, res) => {
  try {
    const fromDevice = req.body.fromDevice;
    if (!fromDevice)
      return res.status(400).json({ message: "Device ID is required" });
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

router.post("/api/anomalyLog", async (req, res) => {
  try {
    const anomalyLog = await AnomalyLog.create(req.body);
    res.status(200).json(anomalyLog);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;
