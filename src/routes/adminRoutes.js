const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/adminUploadMiddleware");

router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.get("/", authMiddleware, adminController.getAllAdmins);
router.get("/profile", authMiddleware, adminController.getAdminById);
router.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  adminController.updateAdminById
);
router.post(
  "/profile-image",
  authMiddleware,
  upload.single("profile_image"),
  adminController.uploadProfileImage
);
router.delete("/:id", authMiddleware, adminController.deleteAdminById);

module.exports = router;
