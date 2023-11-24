module.exports = (type, message) => {
  const err = new Error(type);
  err.data = { message: message };

  // console.log("Socket Error", err);
  return err;
};
