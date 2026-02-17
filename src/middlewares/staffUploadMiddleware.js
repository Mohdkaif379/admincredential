const multer = require("multer");
const { createCloudinaryStorage } = require("../config/cloudinary");

const storage = createCloudinaryStorage("staff");

function fileFilter(req, file, cb) {
  if (file && typeof file.mimetype === "string" && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }
  return cb(new Error("Only image files are allowed"));
}

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
