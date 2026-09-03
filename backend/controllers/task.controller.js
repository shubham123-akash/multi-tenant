import Task from "../models/task.model.js";
import { createActivityLog } from "../utils/createActivityLog.js";
import ProjectMember from "../models/projectMember.model.js";

export const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      estimatedHours,
    } = req.body;

    // Required Fields

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required.",
      });
    }

    // Create Task

    const task = await Task.create({
      tenantId: req.user.tenantId,
      projectId: req.project._id,       // From validateProject middleware
      title,
      description,
      assignedTo,
      createdBy: req.user.userId,
      priority: priority || "MEDIUM",
      dueDate,
      estimatedHours: estimatedHours || 0,
    });

    // Populate Task

    const populatedTask = await Task.findById(task._id)
      .populate("projectId", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    // Activity Log

    await createActivityLog({
      action: "TASK_CREATED",
      entityType: "TASK",
      entityId: task._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId,
    });

    // Response

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

    let query = {
      tenantId: req.user.tenantId,
      isDeleted: false,
    };

    // Project Manager

    if (req.isProjectManager) {

      query.projectId = {
        $in: req.managedProjectIds,
      };

    }

    // Project Member

    else {

      query.assignedTo = req.user.userId;

    }

    const tasks = await Task.find(query)
      .populate("projectId", "name status")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    //   if (!tasks) {
    //     return res.status(404).json({
    //       message: "Task not found"
    //     });
    //   }

    // const membership = await ProjectMember.findOne({
    //   userId: req.user.userId,
    //   projectId: tasks.projectId,
    //   tenantId: req.user.tenantId
    // });

    // if (!membership) {
    //   return res.status(403).json({
    //     message: "You are not a member of this project"
    //   });
    // }

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

    // Task is already available from middleware
    const task = req.task;

    // Soft Delete

    task.isDeleted = true;

    await task.save();

    // Activity Log

    await createActivityLog({
      action: "TASK_DELETED",
      entityType: "TASK",
      entityId: task._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId,
    });

    // Response

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






export const updateTaskStatus = async (req, res) => {
  try {

    const { status } = req.body;

    // Task comes from validateTask middleware

    const task = req.task;

    // Update Status

    task.status = status;

    if (status === "DONE") {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();

    // Populate Updated Task

    const updatedTask = await task.populate([
      {
        path: "projectId",
        select: "name",
      },
      {
        path: "assignedTo",
        select: "name email",
      },
      {
        path: "createdBy",
        select: "name email",
      },
    ]);

    // Activity Log

    await createActivityLog({
      action: "TASK_STATUS_UPDATED",
      entityType: "TASK",
      entityId: task._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId,
    });

    // Response

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully.",
      task: updatedTask,
    });

  } catch (error) {

    console.error("Update Task Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });

  }
};