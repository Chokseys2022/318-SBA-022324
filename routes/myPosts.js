//myPosts.js

const express = require("express");
const router = express.Router();

// Importing the `posts` data array
const posts = require("../data/posts");
// Importing the `users` data array
const users = require("../data/users");

// Importing the `error` utility function
const error = require("../utilities/error");

// Route for handling GET and POST requests to '/posts'
router
  .route("/")
  .get((req, res) => {
    // Creating links for each post
    const links = posts.map((post) => ({
      href: `posts/${post.id}`,
      rel: post.id.toString(),
      type: "GET",
    }));

    // Responding with posts data and links
    res.json({ posts, links });
  })
  .post((req, res, next) => {
    // Validating request body for required fields
    if (req.body.userId && req.body.dessertType && req.body.flavor) {
      // Check if user exists
      const user = users.find((user) => user.id === req.body.userId);
      if (!user) {
        return next(error(404, "User not found"));
      }

      // Creating a new post object
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        dessertType: req.body.dessertType,
        flavor: req.body.flavor,
      };

      // Adding the new post to the posts array
      posts.push(post);
      // Responding with the newly created post
      res.json(posts[posts.length - 1]);
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
    const post = posts.find((p) => p.id == req.params.id);

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
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
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
    const postIndex = posts.findIndex((p) => p.id == req.params.id);

    // If post exists, delete it; otherwise, proceed to next middleware
    if (postIndex !== -1) {
      const deletedPost = posts.splice(postIndex, 1)[0];
      res.json(deletedPost);
    } else {
      next();
    }
  });

// Exporting the router for use in other modules
module.exports = router;
