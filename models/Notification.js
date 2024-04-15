const mongoose = require("mongoose");

let modelSchema = mongoose.Schema(
  {
    fromDevice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EdgeDevice",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    fromCamera: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camera",
    },
    type: {
      type: String,
      default: "Disconnection",
      enum: ["Anomaly", "Disconnection"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 2592000,
    },
  },
  { timestamps: true }
);

let Model = mongoose.model("Notification", modelSchema);
module.exports = Model;
