const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
