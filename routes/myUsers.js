//myUsers.js

const express = require("express");
const router = express.Router();

// Importing the `dessertPosts` data array
const dessertPosts = require("../data/posts");
// Importing the `error` utility function
const error = require("../utilities/error");

// Route for handling GET and POST requests to '/posts'
router
  .route("/")
  .get((req, res) => {
    // Creating links for each post
    const links = dessertPosts.map((post) => ({
      href: `posts/${post.id}`,
      rel: post.id.toString(),
      type: "GET",
    }));

    // Responding with posts data and links
    res.json({ posts: dessertPosts, links });
  })
  .post((req, res, next) => {
    // Validating request body for required fields
    if (req.body.userId && req.body.dessertType && req.body.flavor) {
      // Creating a new post object
      const post = {
        id: dessertPosts[dessertPosts.length - 1].id + 1,
        userId: req.body.userId,
        dessertType: req.body.dessertType,
        flavor: req.body.flavor,
      };

      // Adding the new post to the dessertPosts array
      dessertPosts.push(post);
      // Responding with the newly created post
      res.json(dessertPosts[dessertPosts.length - 1]);
    } else {
      // If request body lacks required fields, proceed to error middleware
      next(error(400, "Insufficient Data"));
    }
  });

// Route for handling GET, PATCH, and DELETE requests to '/posts/:id'
router
  .route("/:id")
  .get((req, res, next) => {
    // Finding the post with the specified id
    const post = dessertPosts.find((p) => p.id == req.params.id);

    // Creating links for updating and deleting the post
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

    // If post exists, respond with post data and links; otherwise, proceed to next middleware
    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    // Finding and updating the post with the specified id
    const post = dessertPosts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          dessertPosts[i][key] = req.body[key];
        }
        return true;
      }
    });

    // If post exists, respond with updated post; otherwise, proceed to next middleware
    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    // Finding and deleting the post with the specified id
    const postIndex = dessertPosts.findIndex((p) => p.id == req.params.id);

    // If post exists, delete it; otherwise, proceed to next middleware
    if (postIndex !== -1) {
      const deletedPost = dessertPosts.splice(postIndex, 1)[0];
      res.json(deletedPost);
    } else {
      next();
    }
  });

// Exporting the router for use in other modules
module.exports = router;
