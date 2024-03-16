const mongoose = require("mongoose");

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
});

let Model = mongoose.model("EdgeDevice", modelSchema);
module.exports = Model;
