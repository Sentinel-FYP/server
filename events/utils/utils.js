const sendError = (io, socketId, message) => {
  try {
    if (socketId)
      io.to(socketId).emit("status:error", {
        message,
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendError };
