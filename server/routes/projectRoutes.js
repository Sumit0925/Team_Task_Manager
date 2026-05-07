const express = require("express");

const {
  createProject,
  getProjects,
  addMember,
  removeMember,
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.post("/add-member", authMiddleware, addMember);
router.post("/remove-member", authMiddleware, removeMember);

module.exports = router;
