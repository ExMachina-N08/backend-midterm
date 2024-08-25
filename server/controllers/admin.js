const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    // Save admin
    const savedUser = await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({
      message: "Admin registered successfully",

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
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Create token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      message: "Admin Login successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
};
