const mongoose = require("mongoose");

let CameraSchema = mongoose.Schema({
  cameraName: { type: String, required: true },
  cameraIP: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  thumbnail: { type: String },
  active: { type: Boolean, default: false },
});

let modelSchema = mongoose.Schema({
  deviceID: { type: String, unique: true, required: true },
  deviceName: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  cameras: [CameraSchema],
});

let Model = mongoose.model("EdgeDevice", modelSchema);
module.exports = Model;
