const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { username, email, password, age, role } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      age,
      role,
    });

    // Save the user to database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(201).json({
      message: "User registered successfully",

      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        age: savedUser.age,
        role: savedUser.role,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//login logic
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    //Refresh token
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    await user.save();
    res.json({
      message: "User Login successfully",
      token,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, age, role } = req.body;
  try {
    // Find the user by id
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the password if it's being updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update all fields
    user.username = username;
    user.email = email;
    user.age = age;
    user.role = role;

    // Save updated user to the database
    const updatedUser = await user.save();

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//patch user
const patchUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, age, role } = req.body;
  try {
    // Find the user by id
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields provided in the request
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (age) user.age = age;
    if (role) user.role = role;

    // Save updated user to the database
    const updatedUser = await user.save();

    res.json({
      message: "User partially updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the user by id and delete
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  patchUser,
};
