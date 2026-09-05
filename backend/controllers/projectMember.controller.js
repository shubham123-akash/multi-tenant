import Project from "../models/project.model.js";
import ProjectMember from "../models/projectMember.model.js";
import User from "../models/user.model.js";
import { createActivityLog } from "../utils/createActivityLog.js";



export const assignUser = async (req, res) => {
  try {

    const { userId } = req.body;

    const projectMember = await ProjectMember.create({
      projectId: req.project._id,
      userId,
      tenantId: req.user.tenantId,
      assignedBy: req.user.userId,
      role: req.projectRole,
    });

    await createActivityLog({
      action: "USER_ASSIGNED_TO_PROJECT",
      entityType: "PROJECT",
      entityId: req.project._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId,
    });

    return res.status(201).json({
      success: true,
      message: "User assigned successfully.",
      projectMember,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign user.",
    });

  }
};



// Remove User from Project
export const removeUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const projectMember = await ProjectMember.findOneAndDelete({
      projectId: req.project._id,
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
      entityId: req.project._id,
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




export const getProjectMembers = async (req, res) => {
  try {

    const members = await ProjectMember.find({
      projectId: req.project._id,
      tenantId: req.user.tenantId,
    })
      .populate("userId", "name email role")
      .populate("assignedBy", "name email");

    return res.status(200).json({
      success: true,
      totalMembers: members.length,
      members,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project members.",
    });

  }
};