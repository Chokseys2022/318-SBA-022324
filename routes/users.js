const express = require("express");
const router = express.Router();

// Importing the `users` data array
const users = require("../data/users");

// Importing the `error` utility function
const error = require("../utilities/error");

// Route for handling GET and POST requests to '/users'
router.route("/")
  .get((req, res) => {
    // Creating links for each user
    const links = users.map(user => ({
      href: `users/${user.id}`,
      rel: user.id.toString(),
      type: "GET",
    }));

    // Responding with users data and links
    res.json({ users, links });
  })
  .post((req, res, next) => {
    // Validating request body for required fields
    if (req.body.name && req.body.username && req.body.email) {
      // Checking if username is already taken
      if (users.find(u => u.username === req.body.username)) {
        // If username is taken, proceed to error middleware
        next(error(409, "Username Already Taken"));
      }

      // Creating a new user object
      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      // Adding the new user to the users array
      users.push(user);
      // Responding with the newly created user
      res.json(users[users.length - 1]);
    } else {
      // If request body lacks required fields, proceed to error middleware
      next(error(400, "Insufficient Data"));
    }
  });

// Route for handling GET, PATCH, and DELETE requests to '/users/:id'
router.route("/:id")
  .get((req, res, next) => {
    // Finding the user with the specified id
    const user = users.find(u => u.id == req.params.id);

    // Creating links for updating and deleting the user
    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    // If user exists, respond with user data and links; otherwise, proceed to next middleware
    if (user) res.json({ user, links });
    else next();
  })
  .patch((req, res, next) => {
    // Finding and updating the user with the specified id
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    // If user exists, respond with updated user; otherwise, proceed to next middleware
    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    // Finding and deleting the user with the specified id
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    // If user exists, respond with deleted user; otherwise, proceed to next middleware
    if (user) res.json(user);
    else next();
  });

// Exporting the router for use in other modules
module.exports = router;
