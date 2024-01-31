const createRoomHandler = require("./room/createRoomEventHandler");
const joinRoomHandler = require("./room/joinRoomEventHandler");
const answerHandler = require("./webrtc/answerEventHandler");
const disconnectHandler = require("./disconnectEventHandler");
const camerasDiscoveryHandler = require("./camera/camerasDiscoveryHandler");
const camerasDiscoveredHandler = require("./camera/camerasDiscoveredHandler");
const addCameraHandler = require("./camera/addCameraHandler");
const addedCameraHandler = require("./camera/addedCameraHandler");
const updateThumbnailHandler = require("./camera/updateThumbnailHandler");
const sendStreamEventHandler = require("./streaming/sendStreamEventHandler");
const startStreamEventHandler = require("./streaming/startStreamEventHandler");
const endStreamEventHandler = require("./streaming/endStreamEventHandler");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New Socket Connected with ID", socket.id);

    let device = { currentDeviceId: "" };

    // Edge will create room of deviceId
    socket.on("create room", createRoomHandler(socket, device));
    socket.on("room:create", createRoomHandler(socket, device));

    // User will join a room
    socket.on("join room", joinRoomHandler(socket, io));
    socket.on("room:join", joinRoomHandler(socket, io));

    // Edge will send answer to user
    socket.on("answer", answerHandler(io));

    // User will initiate a request to discover cameras
    // params: {deviceId}
    socket.on("cameras:discover", camerasDiscoveryHandler(io));

    // Edge will return discovered cameras
    // params: {deviceId}
    socket.on("cameras:discovered", camerasDiscoveredHandler(io));

    // User will initiate add camera event
    // params: {deviceId, cameraIP, login, password}
    socket.on("cameras:add", addCameraHandler(io));

    // Edge will initiate added camera event for confirmation
    // params: {deviceId, cameraIP}
    socket.on("cameras:added", addedCameraHandler(io));

    // Edge will initiate this event to update camera thumbnails
    // params: {deviceId, cameraIP, thumbnail}
    socket.on("cameras:thumbnail:update", updateThumbnailHandler(io));

    // User will initiate start stream event
    // params: {deviceId, cameraIP}
    socket.on("stream:start", startStreamEventHandler(io));

    // Streaming event handler, Edge will send base64 frames
    // params: {deviceId, cameraIP}
    socket.on("stream:send", sendStreamEventHandler(io));
    socket.on("stream", sendStreamEventHandler(io));

    // User will initiate end stream event
    // params: {deviceId, cameraIP}
    socket.on("stream:end", endStreamEventHandler(io));

    socket.on("disconnect", disconnectHandler(device));
  });
};
