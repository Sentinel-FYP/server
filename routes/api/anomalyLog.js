const express = require("express");
const AnomalyLog = require("../../models/AnomalyLog");

const router = express.Router();

router.get("/api/anomalyLogs", async (req, res) => {
  try {
    const fromDevice = req.body.fromDevice;
    const anomalyLogs = AnomalyLog.find({ fromDevice: fromDevice }).populate(
      "fromDevice"
    );
    if (anomalyLogs.fromDevice.owner != req.user.id)
      return res.status(403).json({
        message: "You are not authorized to access this device's logs",
      });
    res.status(200).json(anomalyLogs);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/api/anomalyLogs", async (req, res) => {
  try {
    const anomalyLog = await AnomalyLog.create({
      occurredAt: req.body.occurredAt,
      endedAt: req.body.endedAt,
      fromDevice: req.body.fromDevice,
    });
    res.status(200).json(anomalyLog);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});
