const mongoose = require("mongoose");

let modelSchema = mongoose.Schema({
  cameraName: { type: String, required: true },
  cameraIP: { type: String, required: true },
  username: { type: String, default: "" },
  password: { type: String, default: "" },
  path: { type: String, default: "" },
  thumbnail: { type: String },
  active: { type: Boolean, default: true },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EdgeDevice",
    required: true,
  },
});

let Model = mongoose.model("Camera", modelSchema);
module.exports = Model;
