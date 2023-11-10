const mongoose = require("mongoose");
let modelSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  roles: [],
});
let Model = mongoose.model("User", modelSchema);
module.exports = Model;
