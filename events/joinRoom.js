const variables = require("./variables");

module.exports = (socket) => {
  return (info) => {
    if (!variables.rooms[info.deviceId]) {
      // Room does not exist for current device. So device offline
    } else {
      console.log("User joined a room. Data =>", info);
      // Joining room
      variables.rooms[info.deviceId].userSocketId = socket.id;
      io.to(variables.rooms[info.deviceId].deviceSocketId).emit("userJoined", info);
    }
  };
};
