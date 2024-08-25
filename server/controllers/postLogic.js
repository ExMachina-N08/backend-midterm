const Post = require("../model/post");
const User = require("../model/user");

//post function
const createPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    // Find userId logic
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newPost = new Post({
      userId: user._id,
      title,
      content,
    });

    const savedPost = await newPost.save();
    res.status(201).json({
      post: {
        _id: savedPost._id,
        title: savedPost.title,
        content: savedPost.content,
        userId: user._id,
        username: user.username,
        createdAt: savedPost.createdAt,
        updatedAt: savedPost.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "userId",
      "username"
    );
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPost,
  getPost,
};
