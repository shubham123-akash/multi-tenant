import ProjectMember from "../models/projectMember.model.js";
import User from "../models/user.model.js";

// =======================================================
// Validate User Assignment to Project
// =======================================================

export const validateProjectAssignment = async (req, res, next) => {
  try {

    const { userId, role } = req.body;

    // Required fields

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Validate Project Role

    const projectRole = (role || "MEMBER").toUpperCase();

    if (!["MANAGER", "MEMBER"].includes(projectRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project role.",
      });
    }

    req.projectRole = projectRole;

    // Check User

    const user = await User.findOne({
      _id: userId,
      tenantId: req.user.tenantId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // OWNER & ADMIN can assign only MEMBER users

    if (user.role !== "MEMBER") {
      return res.status(403).json({
        success: false,
        message: "Only MEMBER users can be assigned to a project.",
      });
    }

    // Prevent Duplicate Assignment

    const alreadyAssigned = await ProjectMember.findOne({
      projectId: req.project._id,
      userId,
      status: "ACTIVE",
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "User is already assigned to this project.",
      });
    }

    req.assignedUser = user;

    next();

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Project assignment validation failed.",
    });

  }
};