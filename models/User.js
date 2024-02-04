const mongoose = require("mongoose");
let modelSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  roles: [],
});
let Model = mongoose.model("User", modelSchema);
module.exports = Model;
