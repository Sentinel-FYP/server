const mongoose = require("mongoose");

let modelSchema = mongoose.Schema(
  {
    occurredAt: Date,
    endedAt: Date,
    fromDevice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EdgeDevice",
    },
  },
  { timestamps: true }
);
