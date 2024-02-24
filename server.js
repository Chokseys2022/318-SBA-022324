// Importing necessary modules: Express for creating the application,
// bodyParser for parsing incoming request bodies,
// users and posts routes for handling user and post-related requests,
// and the error utility function for generating custom errors.
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/users");
const posts = require("./routes/posts");
const error = require("./utilities/error");

// Creating an Express application instance.
const app = express();

// Setting the port number for the server to listen on.
const port = 3000;

// Middleware to parse incoming request bodies as JSON or URL-encoded data.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Middleware for logging incoming requests and their data.
app.use((req, res, next) => {
  // Getting the current time.
  const time = new Date();

  // Logging the request method, URL, and time.
  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );

  // Logging request data if it exists.
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }

  // Proceeding to the next middleware.
  next();
});

// Array containing valid API keys.
apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// Middleware to check for API keys.
app.use("/api", function (req, res, next) {
  // Getting the API key from the query parameters.
  var key = req.query["api-key"];

  // Checking for the absence of a key.
  if (!key) next(error(400, "API Key Required"));

  // Checking for key validity.
  if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));

  // Valid key! Storing it in req.key for route access.
  req.key = key;
  next();
});

// Using the users and posts routes for handling corresponding endpoints.
app.use("/api/users", users);
app.use("/api/posts", posts);

// Adding HATEOAS links for the root endpoint.
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "/api",
        rel: "api",
        type: "GET",
      },
    ],
  });
});

// Adding HATEOAS links for the '/api' endpoint.
app.get("/api", (req, res) => {
  res.json({
    links: [
      {
        href: "api/users",
        rel: "users",
        type: "GET",
      },
      {
        href: "api/users",
        rel: "users",
        type: "POST",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "GET",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "POST",
      },
    ],
  });
});

// Middleware to handle 404 errors.
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling middleware to handle all errors.
app.use((err, req, res, next) => {
  // Setting the response status code based on the error status or defaulting to 500.
  res.status(err.status || 500);
  // Sending a JSON response with the error message.
  res.json({ error: err.message });
});

// Starting the server and listening on the specified port.
app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});
