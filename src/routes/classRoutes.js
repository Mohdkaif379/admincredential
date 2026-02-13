const express = require("express");
const router = express.Router();

const classController = require("../controllers/classController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, classController.create);
router.get("/", authMiddleware, classController.getAll);
router.get("/profile/:id", authMiddleware, classController.getById);
router.put("/update/:id", authMiddleware, classController.updateById);
router.delete("/delete/:id", authMiddleware, classController.deleteById);

module.exports = router;

