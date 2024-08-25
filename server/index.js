const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const router = require("./router/user");

//app config
dotenv.config();
const app = express();
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send(`Server is running`);
});

//middleware
app.use(express.json());
app.use("/api", router);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`running on Port ${PORT}`);
});
