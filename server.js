const express = require("express");
let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", require("./routes/api/userAuth"));

app.use(require("./middlewares/auth"));

app.use("/", require("./routes/api/edgeDevice"));

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo ...."))
  .catch((error) => console.log(error.message));

app.listen(PORT, () => {
  console.log("Server Started on port", PORT);
});
