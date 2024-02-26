const mongoose = require("mongoose");

let CameraSchema = mongoose.Schema({
  cameraName: { type: String, required: true },
  cameraIP: { type: String, required: true },
  username: { type: String, default: "" },
  password: { type: String, default: "" },
  thumbnail: { type: String },
  active: { type: Boolean, default: true },
});

let modelSchema = mongoose.Schema({
  deviceID: { type: String, unique: true, required: true },
  deviceName: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  category: {
    type: String,
    default: "Other",
    enum: ["Home", "Office", "School", "Shop", "Crib", "Outdoor", "Other"],
  },

  cameras: [CameraSchema],
});

let Model = mongoose.model("EdgeDevice", modelSchema);
module.exports = Model;
