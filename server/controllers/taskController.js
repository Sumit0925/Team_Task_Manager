const Task = require("../models/Task");
const Project = require("../models/Project");
const mongoose = require("mongoose");

// Helper
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

//* Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, projectId, assignedTo } =
      req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Valid task title is required",
      });
    }

    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
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
        message: "Only admin can create tasks",
      });
    }

    if (assignedTo) {
      const isMember = project.members.some(
        (m) => m.user.toString() === assignedTo,
      );

      if (!isMember) {
        return res.status(400).json({
          success: false,
          message: "User not in project",
        });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      dueDate,
      priority,
      project: projectId,
      assignedTo,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//* Get Tasks (only user's projects)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "userName email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Tasks fetched successfully",
      tasks: tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//* Update Task Status
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    // const { taskId, status } = req.body;
    const { status } = req.body;

    if (!isValidId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    //* Status Validation
    const validStatus = ["todo", "in-progress", "done"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    //* Allow assigned user OR project admin
    const project = await Project.findById(task.project);
    const isAdmin = project?.members.some(
      (m) => m.user.toString() === req.user.id && m.role === "admin",
    );
    const isAssigned = task.assignedTo?.toString() === req.user.id;

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    task.status = status;
    await task.save();

    res.json({
      success: true,
      message: "Task updated successfully",
      task: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//* Edit Task
const editTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, dueDate, priority, assignedTo } = req.body;

    if (!isValidId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(taskId).populate("project");
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    //*Only admin can edit task
    const project = await Project.findById(task.project._id);

    const isAdmin = project.members.some(
      (m) => m.user.toString() === req.user.id && m.role === "admin",
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admin can edit task",
      });
    }

    //* Validate assigned user (if changing)
    if (assignedTo) {
      const isMember = project.members.some(
        (m) => m.user.toString() === assignedTo,
      );

      if (!isMember) {
        return res.status(400).json({
          success: false,
          message: "User not in project",
        });
      }

      task.assignedTo = assignedTo;
    }

    //*Update fields only if provided
    if (title) task.title = title.trim();
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;

    await task.save();

    res.json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//* Delete a Task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!isValidId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(taskId).populate("project");
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project._id);

    const isAdmin = project.members.some(
      (m) => m.user.toString() === req.user.id && m.role === "admin",
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete task",
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({
      success: true,
      message: "Task deleted successfully",
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
  createTask,
  getTasks,
  updateTask,
  editTask,
  deleteTask,
};
