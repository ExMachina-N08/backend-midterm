const mongoose = require("mongoose");
const User = require("./user");
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

postSchema.index({ userId: 1 });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
