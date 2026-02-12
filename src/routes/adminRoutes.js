const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.get("/", authMiddleware, adminController.getAllAdmins);
router.get("/:id", authMiddleware, adminController.getAdminById);
router.put("/update", authMiddleware, adminController.updateAdminById);
router.delete("/:id", authMiddleware, adminController.deleteAdminById);

module.exports = router;
