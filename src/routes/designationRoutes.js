const express = require("express");
const router = express.Router();
const designationController = require("../controllers/designationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, designationController.createDesignation);
router.get("/", authMiddleware, designationController.getAllDesignations);
router.get("/:id", authMiddleware, designationController.getDesignationById);
router.put("/update/:id", authMiddleware, designationController.updateDesignationById);
router.delete("/delete/:id", authMiddleware, designationController.deleteDesignationById);

module.exports = router;
