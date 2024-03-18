const express = require("express");

const EdgeDevice = require("../../models/EdgeDevice");
const Notification = require("../../models/Notification");

const getSchemaError = require("../../utils/schemaError");

const router = express.Router();

router.get("/api/notifications", async (req, res) => {
  try {
    const devices = await EdgeDevice.find({ owner: req.user.id }).select("_id");

    const notifications = await Notification.find({ fromDevice: { $in: devices } })
      .populate("fromDevice", "deviceID deviceName")
      // .populate("fromCamera", "-thumbnail")
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

async function postNotification(deviceID, title, message) {
  try {
    const notification = await Notification.create({ fromDevice: deviceID, title, message });
    console.log("Notification Saved", notification);
  } catch (error) {
    const schemaErrorMessage = getSchemaError(error);
    console.log(schemaErrorMessage || error);
  }
}

module.exports = { router, postNotification };
