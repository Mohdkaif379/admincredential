const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message, code: err.code });
  }

  if (err && err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }

  return next(err);
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON format. Use valid JSON with double quotes."
    });
  }

  return next(err);
});

module.exports = app;
