const express = require("express");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  editTask,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.patch("/:taskId/status", authMiddleware, updateTask);
router.put("/:taskId", authMiddleware, editTask);
router.delete("/:taskId", authMiddleware, deleteTask);

module.exports = router;
