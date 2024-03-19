const express = require("express");
const AnomalyLog = require("../../models/AnomalyLog");
const EdgeDevice = require("../../models/EdgeDevice");
const Camera = require("../../models/Camera");

const multer = require("multer");
const fs = require("fs");
const getSchemaError = require("../../utils/schemaError");
const {
  s3,
  createPresignedUrl,
  createCloudFrontURL,
} = require("../../utils/aws");

const upload = multer({ dest: "/tmp/" });

const router = express.Router();

// async function getLogs(req, res) {
//   try {
//     const fromDevice = req.params.deviceID;
//     if (!fromDevice)
//       return res.status(400).json({ message: "Device ID is required" });

//     const anomalyLogs = await AnomalyLog.find({
//       fromDevice: fromDevice,
//     })
//       .populate(["fromDevice", "fromCamera"])
//       .sort({ createdAt: -1 });

//     if (anomalyLogs.length === 0) return res.status(200).json([]);
//     if (anomalyLogs[0].fromDevice.owner != req.user.id)
//       return res.status(403).json({
//         message: "You are not authorized to access this device's logs",
//       });

//     res.status(200).json(anomalyLogs);
//   } catch (error) {
//     console.log(error);
//     const schemaErrorMessage = getSchemaError(error);
//     res
//       .status(500)
//       .send({ message: schemaErrorMessage || "Something went wrong" });
//   }
// }

// router.get("/api/anomalyLog/:deviceID", getLogs);
// router.get("/api/edgeDevices/:deviceID/anomalyLogs", getLogs);

router.get("/api/anomalyLogs", async (req, res) => {
  try {
    const devices = await EdgeDevice.find({ owner: req.user.id }).select("_id");

    const anomalyLogs = await AnomalyLog.find({ fromDevice: { $in: devices } })
      .populate("fromDevice")
      .populate("fromCamera", "-thumbnail")
      .sort({ createdAt: -1 });
    res.status(200).json(anomalyLogs);
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res
      .status(500)
      .send({ message: schemaErrorMessage || "Something went wrong" });
  }
});
async function postLog(req, res) {
  try {
    let anomaly = req.body;
    let fromDevice = anomaly.fromDevice;
    let fromCamera = anomaly.fromCamera;
    let thumbnail = req.files?.thumbnail[0];
    let video = req.files?.video[0];

    if (!thumbnail)
      return res.status(400).json({ message: "Thumbnail is required!" });
    if (!video) return res.status(400).json({ message: "Video is required!" });
    const camera = await Camera.findOne({ _id: fromCamera });

    if (!camera)
      return res.status(400).json({ message: "Camera does not exist!" });

    let videoStream = fs.readFileSync(video.path);

    // Upload Video to S3 Bucket
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fromDevice + "/" + video.originalname,
      Body: videoStream,
      ContentType: video.mimetype,
    };

    const s3UploadResponse = await s3.upload(params).promise();
    anomaly.videoUri = s3UploadResponse.Key;

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
    res
      .status(500)
      .send({ message: schemaErrorMessage || "Something went wrong" });
  }
}

// router.post("/api/anomalyLog", upload.single("thumbnail"), async (req, res) => {
router.post(
  "/api/anomalyLog",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  postLog
);

router.post(
  "/api/anomalyLogs",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  postLog
);

router.get("/api/anomalyLogs/:anomalyLogID", async (req, res) => {
  try {
    const anomalyLogID = req.params.anomalyLogID;
    if (!anomalyLogID)
      return res.status(400).json({ message: "Anomaly Log ID is required" });

    let anomalyLog = await AnomalyLog.findOne({
      _id: anomalyLogID,
    })
      .populate("fromDevice")
      .populate("fromCamera", "-thumbnail")
      .lean();

    if (!anomalyLog)
      return res
        .status(404)
        .json({ message: "Anomaly Log with this ID does not exist!" });
    if (anomalyLog.fromDevice.owner != req.user.id)
      return res.status(403).json({
        message: "You are not authorized to access this device's logs",
      });

    // let videoUri = await createPresignedUrl(anomalyLog.videoUri);
    let videoUri = createCloudFrontURL(anomalyLog.videoUri);
    anomalyLog = { ...anomalyLog, videoUri };

    res.status(200).json(anomalyLog);
  } catch (error) {
    console.log(error);
    const schemaErrorMessage = getSchemaError(error);
    res
      .status(500)
      .send({ message: schemaErrorMessage || "Something went wrong" });
  }
});

module.exports = router;
