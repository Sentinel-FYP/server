module.exports = (io) => {
  return (info) => {
    console.log("User initiated cameras addition", info);
    io.to(rooms[info.deviceId].deviceSocketId).emit("cameras:add", info);
  };
};
