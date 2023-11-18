const mongoose = require("mongoose");

let modelSchema = mongoose.Schema(
  {
    occurredAt: Date,
    endedAt: Date,
    fromDevice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EdgeDevice",
    },
    clipFileName: String,
  },
  { timestamps: true }
);

let Model = mongoose.model("AnomalyLog", modelSchema);
module.exports = Model;
