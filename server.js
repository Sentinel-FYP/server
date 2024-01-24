const express = require("express");
let app = express();

const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, { cors: true });
// io.use(require("./middlewares/socketAuth"));
require("./events")(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("morgan")(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/", require("./routes/api/userAuth"));

const auth = require("./middlewares/auth");

app.use("/", auth, require("./routes/api/edgeDevice"));
app.use("/", auth, require("./routes/api/anomalyLog"));

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

httpServer.listen(PORT, () => {
  console.log("Server Started on port", PORT);
});
