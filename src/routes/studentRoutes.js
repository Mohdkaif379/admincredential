const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, studentController.createStudent);
router.get("/", authMiddleware, studentController.getAllStudents);
router.get("/profile/:id", authMiddleware, studentController.getStudentById);
router.put("/update/:id", authMiddleware, studentController.updateStudentById);
router.delete("/delete/:id", authMiddleware, studentController.deleteStudentById);

module.exports = router;

