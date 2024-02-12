const express = require("express");
const AnomalyLog = require("../../models/AnomalyLog");

const multer = require("multer");
const fs = require("fs");
const getSchemaError = require("../../utils/schemaError");
const { s3, createPresignedUrl } = require("../../utils/aws");

const upload = multer({ dest: "/tmp/" });

const router = express.Router();

router.get("/api/anomalyLog/:deviceID", async (req, res) => {
  try {
    const fromDevice = req.params.deviceID;
    if (!fromDevice) return res.status(400).json({ message: "Device ID is required" });

    const anomalyLogs = await AnomalyLog.find({
      fromDevice: fromDevice,
    }).populate("fromDevice");

    if (anomalyLogs.length === 0) return res.status(200).json([]);
    if (anomalyLogs[0].fromDevice.owner != req.user.id)
      return res.status(403).json({
        message: "You are not authorized to access this device's logs",
      });

    const logsPromises = anomalyLogs.map(async (log) => ({
      ...log,
      videoUri: await createPresignedUrl(log.videoUri),
    }));
    const logs = await Promise.all(logsPromises);

    res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

// router.post("/api/anomalyLog", upload.single("thumbnail"), async (req, res) => {
router.post(
  "/api/anomalyLog",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let anomaly = req.body;
      let fromDevice = anomaly.fromDevice;

      let thumbnail = req.files.thumbnail[0];
      let video = req.files.video[0];

      if (!thumbnail) return res.status(400).json({ message: "Thumbnail is required!" });
      if (!video) return res.status(400).json({ message: "Video is required!" });

      // Upload Video to S3 Bucket
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fromDevice + "/" + video.originalname,
        Body: video.buffer,
        ContentType: video.mimetype,
      };

      const s3UploadResponse = await s3.upload(params).promise();
      anomaly.videoUri = s3UploadResponse.Location;

      let image = fs.readFileSync(thumbnail.path, "base64");
      anomaly.thumbnail = image;

      // Deleting the file from FileSystem
      fs.rmSync(thumbnail.path);
      fs.rmSync(video.path);

      const anomalyLog = await AnomalyLog.create(req.body);
      res.status(200).json(anomalyLog);
    } catch (error) {
      console.log(error);
      const schemaErrorMessage = getSchemaError(error);
      res.status(500).send({ message: schemaErrorMessage || "Something went wrong" });
    }
  }
);

module.exports = router;
