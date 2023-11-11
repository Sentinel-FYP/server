const mongoose = require("mongoose");

let modelSchema = mongoose.Schema({
  deviceID: { type: String, unique: true, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

let Model = mongoose.model("EdgeDevice", modelSchema);
module.exports = Model;
