function getSchemaError(error) {
  let msg = "";
  if (error) {
    if (error.name === "ValidationError") {
      msg = Object.values(error.errors)[0]?.message;
      console.log("Schema Error: ", msg);
    }
  }

  return msg;
}

module.exports = getSchemaError;
