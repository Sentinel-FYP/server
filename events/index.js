const createRoomHandler = require("./room/createRoomEventHandler");
const joinRoomHandler = require("./room/joinRoomEventHandler");
const answerHandler = require("./webrtc/answerEventHandler");
const offerHandler = require("./webrtc/offerEventHandler");
const disconnectHandler = require("./disconnectEventHandler");
const camerasDiscoveryHandler = require("./camera/camerasDiscoveryHandler");
const camerasDiscoveredHandler = require("./camera/camerasDiscoveredHandler");
const newCameraHandler = require("./camera/newCameraHandler");
const addCameraHandler = require("./camera/addCameraHandler");
const deleteCameraHandler = require("./camera/camerasDeleteHandler");
const reconnectCameraHandler = require("./camera/camerasReconnectHandler");
const addedCameraHandler = require("./camera/addedCameraHandler");
const updateHandler = require("./camera/updateHandler");
const sendStreamEventHandler = require("./streaming/sendStreamEventHandler");
const startStreamEventHandler = require("./streaming/startStreamEventHandler");
const endStreamEventHandler = require("./streaming/endStreamEventHandler");
const getDiscoveredCamerasHandler = require("./camera/getDiscoveredCamerasHandler");
const sendAlertHandler = require("./utils/sendAlertHandler");
const errorHandler = require("./utils/errorHandler");

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

    // Edge will emit this event whenever new camera is found
    // params: {deviceID, ...camDetails}
    socket.on("camera:discovered:new", newCameraHandler(io));
    socket.on("cameras:discovered:new", newCameraHandler(io));

    // User will initiate an event to get already discovered cameras
    // params: {deviceID}
    socket.on("cameras:discovered:get", getDiscoveredCamerasHandler(io));

    // User will initiate add camera event
    // params: {deviceID, cameraName, cameraIP, username, password}
    socket.on("cameras:add", addCameraHandler(io));

    // User will initiate delete camera event
    // params: {deviceID, cameraID}
    socket.on("cameras:delete", deleteCameraHandler(io, socket));

    // User will initiate reconnect camera event
    // params: {deviceID, cameraID}
    socket.on("cameras:reconnect", reconnectCameraHandler(io, socket));

    // Edge will initiate added camera event for confirmation
    // params: {deviceID, cameraName, cameraIP, username, password, active, thumbnail}
    socket.on("cameras:added", addedCameraHandler(io));

    // Edge will initiate this event to update camera thumbnails
    // params: {deviceID, cameraName, cameraIP, thumbnail or active}
    socket.on("cameras:update", updateHandler(io));

    // User will initiate start stream event
    // params: {deviceID, cameraName, cameraIP}
    socket.on("stream:start", startStreamEventHandler(io));

    // Streaming event handler, Edge will send base64 frames
    // params: {deviceID, cameraName, cameraIP}
    socket.on("stream:send", sendStreamEventHandler(io));
    socket.on("stream", sendStreamEventHandler(io));

    // User will initiate end stream event
    // params: {deviceID, cameraName, cameraIP}
    socket.on("stream:end", endStreamEventHandler(io));

    // Send Alert to User
    // params: {deviceID, notificationTitle, notificationMessage}
    socket.on("alert:send", sendAlertHandler(io));

    // Edge will send any error occured to User
    // params: {deviceID}
    socket.on("status:error", errorHandler(io));

    socket.on("disconnect", disconnectHandler(device));
  });
};
