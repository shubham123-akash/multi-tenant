import Project from "../models/project.model.js";

// =======================================================
// Validate Project
// =======================================================

export const validateProject = async (req, res, next) => {
  try {

    const projectId =
      req.body?.projectId ||
      req.params.projectId ||
      req.task?.projectId;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required.",
      });
    }

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

    req.project = project;

    next();

  } catch (error) {

    console.log("validateProject Error:", error);

    return res.status(500).json({
      success: false,
      message: "Project validation failed.",
    });

  }
};

// =======================================================
// Validate ACTIVE Project
// =======================================================

export const validateActiveProject = (req, res, next) => {

  if (req.project.status !== "ACTIVE") {
    return res.status(400).json({
      success: false,
      message: "Only ACTIVE projects are allowed.",
    });
  }

  next();
};