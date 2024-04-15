const express = require("express");

const EdgeDevice = require("../../models/EdgeDevice");
const Notification = require("../../models/Notification");
const ObjectId = require("mongoose").Types.ObjectId;

const getSchemaError = require("../../utils/schemaError");

const router = express.Router();

router.get("/api/notifications", async (req, res) => {
  try {
    const pageNumber = req.query.pageNumber || 1;
    const logsPerPage = req.query.logsPerPage || 10;
    const skipCount = (pageNumber - 1) * logsPerPage;

    const devices = await EdgeDevice.find({ owner: req.user.id }).select("_id");

    const notifications = await Notification.find({ fromDevice: { $in: devices } })
      .skip(skipCount)
      .limit(logsPerPage)
      .populate("fromDevice")
      .populate("fromCamera", "-thumbnail")
      .sort({ createdAt: -1 });

    const today = new Date();

    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const previousWeek = new Date(yesterday);
    previousWeek.setDate(yesterday.getDate() - 7);

    let groupedNotifications = [
      { title: "Today", data: [] },
      { title: "Yesterday", data: [] },
      { title: "Previous Week", data: [] },
      { title: "Older", data: [] },
    ];

    notifications.forEach((log) => {
      if (log.createdAt >= today) {
        groupedNotifications[0].data.push(log);
      } else if (log.createdAt >= yesterday && log.createdAt < today) {
        groupedNotifications[1].data.push(log);
      } else if (log.createdAt >= previousWeek && log.createdAt < yesterday) {
        groupedNotifications[2].data.push(log);
      } else if (log.createdAt < previousWeek) {
        groupedNotifications[3].data.push(log);
      }
    });

    res.status(200).json(groupedNotifications);
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

    res.status(200).json({ message: "Notifications Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

router.delete("/api/notifications/clear", async (req, res) => {
  try {
    const devices = await EdgeDevice.find({ owner: req.user.id }).select("_id");
    await Notification.deleteMany({ fromDevice: { $in: devices } });
    res.status(200).json({ message: "Notifications Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

async function postNotification(deviceID, cameraID, title, message) {
  try {
    const notification = await Notification.create({
      fromDevice: deviceID,
      fromCamera: cameraID,
      title,
      message,
    });
    console.log("Notification Saved", notification);
  } catch (error) {
    const schemaErrorMessage = getSchemaError(error);
    console.log(schemaErrorMessage || error);
  }
}

module.exports = { router, postNotification };
