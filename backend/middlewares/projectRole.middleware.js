import ProjectMember from "../models/projectMember.model.js";
import User from "../models/user.model.js";

// =======================================================
// Logged User Must Be Project Manager
// =======================================================

export const isProjectManager = async (req, res, next) => {

  try {

    const manager = await ProjectMember.findOne({
      tenantId: req.user.tenantId,
      projectId: req.project._id,
      userId: req.user.userId,
      role: "MANAGER",
      status: "ACTIVE",
    });

    if (!manager) {
      return res.status(403).json({
        success: false,
        message: "Only Project Managers can perform this action.",
      });
    }

    req.manager = manager;

    next();

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Authorization failed.",
    });

  }
};

// =======================================================
// Check Whether Logged User is Manager
// =======================================================

export const checkProjectManager = async (req, res, next) => {

  try {

    const managedProjects = await ProjectMember.find({
      tenantId: req.user.tenantId,
      userId: req.user.userId,
      role: "MANAGER",
      status: "ACTIVE",
    }).select("projectId");

    req.managedProjectIds = managedProjects.map(
      project => project.projectId
    );

    req.isProjectManager = req.managedProjectIds.length > 0;

    next();

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Authorization failed.",
    });

  }
};

// =======================================================
// Validate Assigned Member
// =======================================================

export const validateAssignedMember = async (req, res, next) => {

  try {

    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Assigned user is required.",
      });
    }

    // Manager cannot assign task to himself

    if (assignedTo.toString() === req.user.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Project Manager cannot assign task to himself.",
      });
    }

    // User Exists

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

    // User belongs to Project

    const member = await ProjectMember.findOne({
      tenantId: req.user.tenantId,
      projectId: req.project._id,
      userId: assignedTo,
      status: "ACTIVE",
    });

    if (!member) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to this project.",
      });
    }

    // Only Project MEMBER receives task

    if (member.role !== "MEMBER") {
      return res.status(400).json({
        success: false,
        message: "Task can only be assigned to Project Members.",
      });
    }

    req.member = member;

    next();

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Member validation failed.",
    });

  }
};