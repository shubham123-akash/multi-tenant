import Project from "../models/project.model.js";
import ProjectMember from "../models/projectMember.model.js";
import User from "../models/user.model.js";
import { createActivityLog } from "../utils/createActivityLog.js";

// Assign User to Project
export const assignUser = async (req, res) => {
  try {
    const { projectId, userId, role } = req.body;

    if (!projectId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Project ID and User ID are required",
      });
    }


    const projectRole = (role || "MEMBER").toUpperCase();

    if (!["MANAGER", "MEMBER"].includes(projectRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project role.",
      });
    }

    // CHECK PROJECT

    const project = await Project.findOne({
      _id: projectId,
      tenantId: req.user.tenantId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // PROJECT STATUS CHECK

    if (project.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: `Users cannot be assigned to a ${project.status.toLowerCase()} project.`,
      });
    }

    // CHECK USER

    const user = await User.findOne({
      _id: userId,
      tenantId: req.user.tenantId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ROLE HIERARCHY

    // MEMBER cannot assign anyone
    if (req.user.role === "MEMBER") {
      return res.status(403).json({
        success: false,
        message: "Members are not allowed to assign users.",
      });
    }

    // ADMIN can assign only MEMBER users
    if (
      req.user.role === "ADMIN" &&
      user.role !== "MEMBER"
    ) {
      return res.status(403).json({
        success: false,
        message: "Admins can assign only MEMBER users.",
      });
    }

    // OWNER cannot assign another OWNER
    if (
      req.user.role === "OWNER" &&
      user.role === "OWNER"
    ) {
      return res.status(403).json({
        success: false,
        message: "Owners cannot assign other Owners.",
      });
    }

    // PREVENT DUPLICATE ASSIGNMENT

    const alreadyAssigned = await ProjectMember.findOne({
      projectId,
      userId,
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "User is already assigned to this project",
      });
    }

    // ASSIGN USER

    const projectMember = await ProjectMember.create({
      projectId,
      userId,
      tenantId: req.user.tenantId,
      assignedBy: req.user.userId,
      role: role || "MEMBER", // Project Role (MANAGER / MEMBER)
    });

    // ACTIVITY LOG

    await createActivityLog({
      action: "USER_ASSIGNED_TO_PROJECT",
      entityType: "PROJECT",
      entityId: project._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId,
    });

    return res.status(201).json({
      success: true,
      message: "User assigned successfully",
      projectMember,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign user",
    });
  }
};




// Remove User from Project
export const removeUser = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const projectMember = await ProjectMember.findOneAndDelete({
      projectId,
      userId,
      tenantId: req.user.tenantId,
    });

    if (!projectMember) {
      return res.status(404).json({
        success: false,
        message: "User is not assigned to this project",
      });
    }

    // Activity Log
    await createActivityLog({
      action: "USER_REMOVED_FROM_PROJECT",
      entityType: "PROJECT",
      entityId: projectId,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId,
    });

    return res.status(200).json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove user",
    });
  }
};





// Get Members of a Project
export const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project belongs to tenant
    const project = await Project.findOne({
      _id: projectId,
      tenantId: req.user.tenantId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const members = await ProjectMember.find({
      projectId,
      tenantId: req.user.tenantId,
    })
      .populate("userId", "name email role")
      .populate("assignedBy", "name");

    return res.status(200).json({
      success: true,
      totalMembers: members.length,
      members,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project members",
    });
  }
};