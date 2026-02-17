const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, departmentController.createDepartment);
router.get("/", authMiddleware, departmentController.getAllDepartments);
router.get("/:id", authMiddleware, departmentController.getDepartmentById);
router.put("/update/:id", authMiddleware, departmentController.updateDepartmentById);
router.delete("/delete/:id", authMiddleware, departmentController.deleteDepartmentById);

module.exports = router;
