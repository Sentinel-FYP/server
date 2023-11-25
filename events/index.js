const createRoomHandler = require("./createRoomEventHandler");
const joinRoomHandler = require("./joinRoomEventHandler");
const answerHandler = require("./answerEventHandler");
const disconnectHandler = require("./disconnectEventHandler");
const camerasDiscoveryHandler = require("./camerasDiscoveryHandler");
const camerasDiscoveredHandler = require("./camerasDiscoveredHandler");
const addCameraHandler = require("./addCameraHandler");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New Socket Connected with ID", socket.id);

    let device = { currentDeviceId: "" };

    // Edge will create room of deviceId
    socket.on("create room", createRoomHandler(socket, device));
    // User will join a room
    socket.on("join room", joinRoomHandler(socket, io));
    socket.on("answer", answerHandler(io));

    // User will initiate a request to discover cameras
    // params: {deviceId}
    socket.on("cameras:discover", camerasDiscoveryHandler(io));

    // Edge will return discovered cameras
    // params: {deviceId}
    socket.on("cameras:discovered", camerasDiscoveredHandler(io));

    // User will initiate add camera event
    // params: {deviceId, cameraId, login, password}
    socket.on("cameras:add", addCameraHandler(io));

    socket.on("disconnect", disconnectHandler(device));
  });
};
