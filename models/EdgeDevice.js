const mongoose = require("mongoose");

let modelSchema = mongoose.Schema({
  deviceID: { type: String, unique: true, required: true },
  deviceName: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  cameras: [],
});

let Model = mongoose.model("EdgeDevice", modelSchema);
module.exports = Model;
