const express = require("express");
const httpModule = require("http");
const socket = require("socket.io");
const morgan = require("morgan");
const mongoose = require("mongoose");

const { router: notificationRouter } = require("./routes/api/notification");
const edgeDeviceRouter = require("./routes/api/edgeDevice");
const anomalyLogRouter = require("./routes/api/anomalyLog");
const userRouter = require("./routes/api/user");
const cameraRouter = require("./routes/api/camera");
const otpRouter = require("./routes/api/otp");
const authRouter = require("./routes/api/auth");

let app = express();
const httpServer = httpModule.createServer(app);

const io = socket(httpServer, { cors: true });
// io.use(require("./middlewares/socketAuth"));
require("./events")(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/", authRouter);
app.use("/", otpRouter);

const auth = require("./middlewares/auth");

app.use("/", auth, edgeDeviceRouter);
app.use("/", auth, anomalyLogRouter);
app.use("/", auth, notificationRouter);
app.use("/", auth, userRouter);
app.use("/", auth, cameraRouter);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo ...."))
  .catch((error) => console.log(error.message));

httpServer.listen(PORT, () => {
  console.log("Server Started on port", PORT);
});
