const express = require("express");
const { createUser, loginUser } = require("../controllers/user");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");
const { createAdmin, loginAdmin } = require("../controllers/admin");
const { createPost, getPost } = require("../controllers/postLogic");

const router = express.Router();

// Public routes-----------------------------

// Home route
router.use("/api", (req, res) => {
  res.send("Welcome to the home route!");
});

// User routes
router.post("/users/register", createUser);
router.post("/users/login", loginUser);

// Admin routes
router.post("/admin/register", createAdmin);
router.post("/admin/login", loginAdmin);

// Protected routes----------------------------

//create post
router.post("/:id/post", authentication, createPost);

//get post
router.get("/:id/post/:postId", authentication, getPost);

// Admin dashboard (only accessible by authenticated admin users)
router.get("/admin/dashboard", authentication, isAdmin, (req, res) => {
  res.status(200).json({ message: `Welcome, Admin User: ${req.user.email}` });
});

module.exports = router;
