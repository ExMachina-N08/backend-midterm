const Post = require("../model/post");
const User = require("../model/user");

const findUserById = async (userId) => User.findById(userId);

const createPostResponse = (post, username) => ({
  _id: post._id,
  title: post.title,
  content: post.content,
  userId: post.userId,
  username: username,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

const createPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const savedPost = await new Post({
      userId: user._id,
      title,
      content,
    }).save();

    res
      .status(201)
      .json({ post: createPostResponse(savedPost, user.username) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPost = async (req, res) => {
  const { postId } = req.params;
  const { email } = req.query;

  try {
    const post = await Post.findById(postId).populate(
      "userId",
      "username email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (email && post.userId.email !== email)
      return res
        .status(403)
        .json({ message: "You are not authorized to view this post" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editPost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this post" });

    if (title || content) {
      if (title) post.title = title;
      if (content) post.content = content;
      const updatedPost = await post.save();
      return res
        .status(200)
        .json({
          message: "Post updated successfully",
          post: createPostResponse(updatedPost, req.user.username),
        });
    }

    res.status(400).json({ message: "No fields to update" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPost,
  getPost,
  editPost,
};
