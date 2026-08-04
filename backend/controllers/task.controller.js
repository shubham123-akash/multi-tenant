import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import ProjectMember from "../models/projectMember.model.js";
import User from "../models/user.model.js";
import { createActivityLog } from "../utils/createActivityLog.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate,
      estimatedHours,
    } = req.body;

    // ======================================
    // Required Fields
    // ======================================

    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Title, Project and Assigned User are required.",
      });
    }

    // ======================================
    // Check Project
    // ======================================

    const project = await Project.findOne({
      _id: projectId,
      tenantId: req.user.tenantId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // ======================================
    // Project must be ACTIVE
    // ======================================

    if (project.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Tasks can only be created for ACTIVE projects.",
      });
    }

    // ======================================
    // Logged-in user must be Project Manager
    // ======================================

    const manager = await ProjectMember.findOne({
      tenantId: req.user.tenantId,
      projectId,
      userId: req.user.userId,
      role: "MANAGER",
      status: "ACTIVE",
    });

    if (!manager) {
      return res.status(403).json({
        success: false,
        message: "Only Project Managers can create tasks.",
      });
    }

    // ======================================
    // Assigned User Exists
    // ======================================

    const user = await User.findOne({
      _id: assignedTo,
      tenantId: req.user.tenantId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found.",
      });
    }

    // ======================================
    // Manager cannot assign task to himself
    // ======================================

    if (assignedTo.toString() === req.user.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Project Managers cannot assign tasks to themselves.",
      });
    }

    // ======================================
    // Assigned User must belong to project
    // ======================================

    const member = await ProjectMember.findOne({
      tenantId: req.user.tenantId,
      projectId,
      userId: assignedTo,
      status: "ACTIVE",
    });

    if (!member) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to this project.",
      });
    }

    // ======================================
    // Only Project Members can receive tasks
    // ======================================

    if (member.role !== "MEMBER") {
      return res.status(400).json({
        success: false,
        message: "Tasks can only be assigned to Project Members.",
      });
    }

    // ======================================
    // Create Task
    // ======================================

    const task = await Task.create({
      tenantId: req.user.tenantId,
      projectId,
      title,
      description,
      assignedTo,
      createdBy: req.user.userId,
      priority: priority || "MEDIUM",
      dueDate,
      estimatedHours: estimatedHours || 0,
    });

    // ======================================
    // Populate Task
    // ======================================

    const populatedTask = await Task.findById(task._id)
      .populate("projectId", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    // ======================================
    // Activity Log
    // ======================================

    await createActivityLog({
      action: "TASK_CREATED",
      entityType: "TASK",
      entityId: task._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId,
    });

    // ======================================
    // Response
    // ======================================

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task: populatedTask,
    });

  } catch (error) {
    console.error("Create Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};







export const getAllTasks = async (req, res) => {
  try {

    let tasks = [];

    // ==========================================
    // If logged-in user is a PROJECT MANAGER
    // ==========================================

    const managedProjects = await ProjectMember.find({
      tenantId: req.user.tenantId,
      userId: req.user.userId,
      role: "MANAGER",
      status: "ACTIVE",
    }).select("projectId");

    if (managedProjects.length > 0) {

      const projectIds = managedProjects.map(
        project => project.projectId
      );

      tasks = await Task.find({
        tenantId: req.user.tenantId,
        projectId: { $in: projectIds },
        isDeleted: false,
      })
        .populate("projectId", "name status")
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

    }

    // ==========================================
    // Otherwise return only assigned tasks
    // ==========================================

    else {

      tasks = await Task.find({
        tenantId: req.user.tenantId,
        assignedTo: req.user.userId,
        isDeleted: false,
      })
        .populate("projectId", "name status")
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

    }

    return res.status(200).json({
      success: true,
      totalTasks: tasks.length,
      tasks,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks.",
    });

  }
};





export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // ======================================
    // Find Task
    // ======================================

    const task = await Task.findOne({
      _id: id,
      tenantId: req.user.tenantId,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // ======================================
    // Check Project Manager Permission
    // ======================================

    const manager = await ProjectMember.findOne({
      tenantId: req.user.tenantId,
      projectId: task.projectId,
      userId: req.user.userId,
      role: "MANAGER",
      status: "ACTIVE",
    });

    if (!manager) {
      return res.status(403).json({
        success: false,
        message: "Only Project Managers can delete tasks.",
      });
    }

    // ======================================
    // Soft Delete
    // ======================================

    task.isDeleted = true;

    await task.save();

    // ======================================
    // Activity Log
    // ======================================

    await createActivityLog({
      action: "TASK_DELETED",
      entityType: "TASK",
      entityId: task._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId,
    });

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};





export const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================
    // Find Task
    // ==========================

    const task = await Task.findOne({
      _id: id,
      tenantId: req.user.tenantId,
      isDeleted: false,
    })
      .populate("projectId", "name status")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // ==========================
    // Check if logged-in user
    // is Project Manager
    // ==========================

    const manager = await ProjectMember.findOne({
      tenantId: req.user.tenantId,
      projectId: task.projectId._id,
      userId: req.user.userId,
      role: "MANAGER",
      status: "ACTIVE",
    });

    // ==========================
    // Manager can access any task
    // ==========================

    if (manager) {
      return res.status(200).json({
        success: true,
        task,
      });
    }

    // ==========================
    // Member can access only
    // their own task
    // ==========================

    if (task.assignedTo._id.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this task.",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });

  } catch (error) {

    console.error("Get Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });

  }
};









export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      estimatedHours,
    } = req.body;

    // =====================================
    // Find Task
    // =====================================

    const task = await Task.findOne({
      _id: id,
      tenantId: req.user.tenantId,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // =====================================
    // Check Logged-in User is Manager
    // =====================================

    const manager = await ProjectMember.findOne({
      tenantId: req.user.tenantId,
      projectId: task.projectId,
      userId: req.user.userId,
      role: "MANAGER",
      status: "ACTIVE",
    });

    if (!manager) {
      return res.status(403).json({
        success: false,
        message: "Only Project Manager can update tasks.",
      });
    }

    // =====================================
    // Validate Assigned User
    // =====================================

    if (assignedTo) {

      const user = await User.findOne({
        _id: assignedTo,
        tenantId: req.user.tenantId,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found.",
        });
      }

      // User must belong to the project

      const member = await ProjectMember.findOne({
        tenantId: req.user.tenantId,
        projectId: task.projectId,
        userId: assignedTo,
        status: "ACTIVE",
      });

      if (!member) {
        return res.status(400).json({
          success: false,
          message: "User is not a member of this project.",
        });
      }

      task.assignedTo = assignedTo;
    }

    // =====================================
    // Update Fields
    // =====================================

    if (title !== undefined)
      task.title = title;

    if (description !== undefined)
      task.description = description;

    if (priority !== undefined)
      task.priority = priority;

    if (dueDate !== undefined)
      task.dueDate = dueDate;

    if (estimatedHours !== undefined)
      task.estimatedHours = estimatedHours;

    await task.save();

    // =====================================
    // Populate Response
    // =====================================

    const updatedTask = await Task.findById(task._id)
      .populate("projectId", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    // =====================================
    // Activity Log
    // =====================================

    await createActivityLog({
      action: "TASK_UPDATED",
      entityType: "TASK",
      entityId: task._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task: updatedTask,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });

  }
};




export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // =====================================
    // Allowed Status
    // =====================================

    const allowedStatus = ["TODO", "IN_PROGRESS", "DONE"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status.",
      });
    }

    // =====================================
    // Find Task
    // =====================================

    const task = await Task.findOne({
      _id: id,
      tenantId: req.user.tenantId,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // =====================================
    // Only Project Manager can update status
    // =====================================

    const manager = await ProjectMember.findOne({
      tenantId: req.user.tenantId,
      projectId: task.projectId,
      userId: req.user.userId,
      role: "MANAGER",
      status: "ACTIVE",
    });

    if (!manager) {
      return res.status(403).json({
        success: false,
        message: "Only Project Manager can update task status.",
      });
    }

    // =====================================
    // Status Transition Validation
    // =====================================

    const currentStatus = task.status;

    // TODO -> only IN_PROGRESS
    if (currentStatus === "TODO") {
      if (status !== "IN_PROGRESS") {
        return res.status(400).json({
          success: false,
          message: "Task must move from TODO to IN_PROGRESS first.",
        });
      }
    }

    // IN_PROGRESS -> only DONE
    if (currentStatus === "IN_PROGRESS") {
      if (status !== "DONE") {
        return res.status(400).json({
          success: false,
          message: "Task in progress can only be marked as DONE.",
        });
      }
    }

    // DONE -> cannot change
    if (currentStatus === "DONE") {
      return res.status(400).json({
        success: false,
        message: "Completed tasks cannot be modified.",
      });
    }

    // =====================================
    // Update Status
    // =====================================

    task.status = status;

    if (status === "DONE") {
      task.completedAt = new Date();
    }

    await task.save();

    // =====================================
    // Populate Updated Task
    // =====================================

    const updatedTask = await Task.findById(task._id)
      .populate("projectId", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    // =====================================
    // Activity Log
    // =====================================

    await createActivityLog({
      action: "TASK_STATUS_UPDATED",
      entityType: "TASK",
      entityId: task._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId,
    });

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully.",
      task: updatedTask,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};