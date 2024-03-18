const express = require("express");

const EdgeDevice = require("../../models/EdgeDevice");
const Notification = require("../../models/Notification");
const ObjectId = require("mongoose").Types.ObjectId;

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

router.delete("/api/notifications", async (req, res) => {
  try {
    const notificationIDs = req.body.notificationIDs;
    if (!notificationIDs || !notificationIDs.length)
      return res.status(400).json({ message: "Notification IDs are required" });

    let unknownNotificationIds = [];
    let unaccessableNotificationIds = [];
    let notificationsToDelete = [];

    let notificationPromises = notificationIDs.map(async (notificationID) => {
      if (!ObjectId.isValid(notificationID)) {
        unknownNotificationIds.push(notificationID);
        return;
      }

      let notification = await Notification.findOne({
        _id: notificationID,
      }).populate("fromDevice", "deviceID deviceName owner");

      if (!notification) unknownNotificationIds.push(notificationID);
      else if (notification.fromDevice.owner != req.user.id)
        unaccessableNotificationIds.push(notificationID);
      else notificationsToDelete.push(notificationID);
    });

    await Promise.all(notificationPromises);

    if (unknownNotificationIds.length)
      return res
        .status(404)
        .json({ message: `Notification with id ${unknownNotificationIds[0]} does not exist` });

    if (unaccessableNotificationIds.length)
      return res.status(404).json({
        message: `You are unauthorized to modify the notification with id ${unaccessableNotificationIds[0]}`,
      });

    await Notification.deleteMany({ _id: { $in: notificationsToDelete } });

    res.status(200).json({ message: "Logs Deleted Successfully!" });
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
