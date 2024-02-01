const createRoomHandler = require("./room/createRoomEventHandler");
const joinRoomHandler = require("./room/joinRoomEventHandler");
const answerHandler = require("./webrtc/answerEventHandler");
const offerHandler = require("./webrtc/offerEventHandler");
const disconnectHandler = require("./disconnectEventHandler");
const camerasDiscoveryHandler = require("./camera/camerasDiscoveryHandler");
const camerasDiscoveredHandler = require("./camera/camerasDiscoveredHandler");
const addCameraHandler = require("./camera/addCameraHandler");
const addedCameraHandler = require("./camera/addedCameraHandler");
const sendAlertHandler = require("./camera/sendAlertHandler");
const updateThumbnailHandler = require("./camera/updateThumbnailHandler");
const sendStreamEventHandler = require("./streaming/sendStreamEventHandler");
const startStreamEventHandler = require("./streaming/startStreamEventHandler");
const endStreamEventHandler = require("./streaming/endStreamEventHandler");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New Socket Connected with ID", socket.id);

    let device = { currentDeviceId: "" };

    // Edge will create room of deviceID
    socket.on("create room", createRoomHandler(socket, device));
    socket.on("room:create", createRoomHandler(socket, device));

    // User will join a room
    socket.on("join room", joinRoomHandler(socket, io));
    socket.on("room:join", joinRoomHandler(socket, io));

    // User will send offer to Edge
    socket.on("webrtc:offer", offerHandler(io));

    // Edge will send answer to user
    socket.on("webrtc:answer", answerHandler(io));

    // User will initiate a request to discover cameras
    // params: {deviceID}
    socket.on("cameras:discover", camerasDiscoveryHandler(io));

    // Edge will return discovered cameras
    // params: {deviceID}
    socket.on("cameras:discovered", camerasDiscoveredHandler(io));

    // User will initiate add camera event
    // params: {deviceID, localIP, login, password}
    socket.on("cameras:add", addCameraHandler(io));

    // Edge will initiate added camera event for confirmation
    // params: {deviceID, localIP}
    socket.on("cameras:added", addedCameraHandler(io));

    // Edge will initiate this event to update camera thumbnails
    // params: {deviceID, localIP, thumbnail}
    socket.on("cameras:thumbnail:update", updateThumbnailHandler(io));

    // User will initiate start stream event
    // params: {deviceID, localIP}
    socket.on("stream:start", startStreamEventHandler(io));

    // Streaming event handler, Edge will send base64 frames
    // params: {deviceID, localIP}
    socket.on("stream:send", sendStreamEventHandler(io));
    socket.on("stream", sendStreamEventHandler(io));

    // User will initiate end stream event
    // params: {deviceID, localIP}
    socket.on("stream:end", endStreamEventHandler(io));

    // Send Alert to User
    // params: {deviceID, localIP}
    socket.on("alert:send", sendAlertHandler(io));

    socket.on("disconnect", disconnectHandler(device));
  });
};
