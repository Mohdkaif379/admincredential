const express = require("express");
const router = express.Router();

const staffController = require("../controllers/staffController");
const authMiddleware = require("../middlewares/authMiddleware");
const staffUpload = require("../middlewares/staffUploadMiddleware");

router.post(
  "/create",
  authMiddleware,
  staffUpload.single("profile_image"),
  staffController.createStaff
);
router.get("/", authMiddleware, staffController.getAllStaff);
router.get("/profile/:id", authMiddleware, staffController.getStaffById);
router.put(
  "/update/:id",
  authMiddleware,
  staffUpload.single("profile_image"),
  staffController.updateStaffById
);
router.delete("/delete/:id", authMiddleware, staffController.deleteStaffById);

module.exports = router;
