const Project = require("../models/Project");
const mongoose = require("mongoose");

//* Helper: validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

//* Create Project
const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Valid project name is required",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      createdBy: req.user.id,
      members: [{ user: req.user.id, role: "admin" }],
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//* Get User Projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user.id,
    })
      .populate("members.user", "userName email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Projects fetched successfully",
      projects: projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//* Add Member
const addMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!isValidId(projectId) || !isValidId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid IDs",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isAdmin = project.members.some(
      (m) => m.user.toString() === req.user.id && m.role === "admin",
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === userId,
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User already a member",
      });
    }

    project.members.push({ user: userId, role: "member" });
    await project.save();

    res.json({
      success: true,
      message: "Member added successfully",
      project: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//* Remove Member
const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!isValidId(projectId) || !isValidId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid IDs",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isAdmin = project.members.some(
      (m) => m.user.toString() === req.user.id && m.role === "admin",
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (userId === req.user.id) {
      return res.status(400).json({
        message: "Admin cannot remove themselves",
      });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== userId,
    );

    await project.save();

    res.json({
      success: true,
      message: "Member removed successfully",
      project: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  addMember,
  removeMember,
};
