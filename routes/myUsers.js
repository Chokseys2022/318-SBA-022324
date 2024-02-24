const express = require("express");
const router = express.Router();
const dessertUsers = require("../data/dessertUsers"); // Importing dessertUsers
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = dessertUsers.map((user) => ({
      // Updating links to users
      href: `users/${user.id}`,
      rel: user.id.toString(),
      type: "GET",
    }));
    res.json({ users: dessertUsers, links }); // Responding with users and links
  })
  .post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      const user = {
        id: dessertUsers[dessertUsers.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };
      dessertUsers.push(user);
      res.json(dessertUsers[dessertUsers.length - 1]);
    } else {
      next(error(400, "Insufficient Data"));
    }
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = dessertUsers.find((u) => u.id == req.params.id);
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
    if (user) res.json({ user, links });
    else next();
  })
  .patch((req, res, next) => {
    const user = dessertUsers.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          dessertUsers[i][key] = req.body[key];
        }
        return true;
      }
    });
    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const userIndex = dessertUsers.findIndex((u) => u.id == req.params.id);
    if (userIndex !== -1) {
      const deletedUser = dessertUsers.splice(userIndex, 1)[0];
      res.json(deletedUser);
    } else {
      next();
    }
  });

module.exports = router;
