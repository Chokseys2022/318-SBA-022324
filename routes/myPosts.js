const express = require("express");
const router = express.Router();
const dessertPosts = require("../data/dessertPosts"); // Importing dessertPosts
const dessertUsers = require("../data/dessertUsers"); // Importing dessertUsers
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = dessertPosts.map((post) => ({
      href: `posts/${post.id}`,
      rel: post.id.toString(),
      type: "GET",
    }));
    res.json({ posts: dessertPosts, links });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.dessertType && req.body.flavor) {
      const user = dessertUsers.find((user) => user.id === req.body.userId); // Finding user in dessertUsers
      if (!user) {
        return next(error(404, "User not found"));
      }
      const post = {
        id: dessertPosts[dessertPosts.length - 1].id + 1,
        userId: req.body.userId,
        dessertType: req.body.dessertType,
        flavor: req.body.flavor,
      };
      dessertPosts.push(post);
      res.json(dessertPosts[dessertPosts.length - 1]);
    } else {
      next(error(400, "Insufficient Data"));
    }
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = dessertPosts.find((p) => p.id == req.params.id);
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
    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = dessertPosts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          dessertPosts[i][key] = req.body[key];
        }
        return true;
      }
    });
    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const postIndex = dessertPosts.findIndex((p) => p.id == req.params.id);
    if (postIndex !== -1) {
      const deletedPost = dessertPosts.splice(postIndex, 1)[0];
      res.json(deletedPost);
    } else {
      next();
    }
  });

module.exports = router;
