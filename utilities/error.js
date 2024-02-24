// This function generates a custom error object with a specified status code and message.
function error(status, msg) {
  // Creating a new Error object with the provided message
  var err = new Error(msg);
  // Setting the status property of the error object to the provided status code
  err.status = status;
  // Returning the error object
  return err;
}

// Exporting the error function for use in other modules
module.exports = error;
