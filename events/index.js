const createRoomEvent = require("./createRoom");
const joinRoomEvent = require("./joinRoom");
const variables = require("./variables");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New Socket Connected with ID", socket.id);

    // Edge will create room of deviceId
    socket.on("create room", createRoomEvent(socket));

    // User will join a room
    socket.on("join room", joinRoomEvent(socket));

    socket.on("answer", (data) => {
      console.log("Server Received answer:", data);
      console.log(rooms[data.deviceId].userSocketId);
      io.to(rooms[data.deviceId].userSocketId).emit("answer", data);
    });

    socket.on("disconnect", () => {
      if (variables.rooms[variables.currentDeviceId]) {
        delete variables.rooms[variables.currentDeviceId];
      }

      console.log(
        "Disconnect",
        variables.currentDeviceId ? "Device: " + variables.currentDeviceId : "User"
      );
    });
  });
};
