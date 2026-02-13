const fs = require("fs");
const path = require("path");
const multer = require("multer");

const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads");
const STUDENT_UPLOAD_DIR = path.join(UPLOAD_ROOT, "students");

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDirExists(STUDENT_UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STUDENT_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeExt = ext && ext.length <= 10 ? ext : "";
    cb(null, `student_${Date.now()}${safeExt}`);
  }
});

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

