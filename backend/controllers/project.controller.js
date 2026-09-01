import Project from "../models/project.model.js";
import { createActivityLog } from "../utils/createActivityLog.js";
import ProjectMember from "../models/projectMember.model.js";
import Task from "../models/task.model.js";


// create Project
export const createProject = async(req, res) => {
  try {
    const {name, description} = req.body;

    if(!name || !description){
      return res.status(401).json({
        message: "All fields are required",
        success: false
      })
    }
  
    const project = await Project.create({
      name,
      description,
      tenantId: req.user.tenantId,
      createdBy: req.user.userId
    })

    // Log Activity
    await createActivityLog({
      action: "PROJECT_CREATED",
      entityType: "PROJECT",
      entityId: project._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId
    });
  
    return res.status(201).json({
      message: "Project created successfully",
      project,
    })
  } catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
}


// Get All Projects

export const getAllProjects = async (req, res) => {
  try {
    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let projects;

    // OWNER & ADMIN -> All Projects
    if (req.user.role === "OWNER" || req.user.role === "ADMIN") {
      projects = await Project.find({
        tenantId: req.user.tenantId,
      });
    }

    // MEMBER -> Only Assigned Projects
    else if (req.user.role === "MEMBER") {

      const memberships = await ProjectMember.find({
        tenantId: req.user.tenantId,
        userId: req.user.userId,
        status: "ACTIVE",
      });

      const projectIds = memberships.map(member => member.projectId);

      projects = await Project.find({
        _id: { $in: projectIds },
        tenantId: req.user.tenantId,
      });
    }

    return res.status(200).json({
      success: true,
      totalProjects: projects.length,
      projects,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};



// getSingleProject
export const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id, 
      tenantId: req.user.tenantId
    });
    

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch(error){
    console.error(error);

    return res.status(500).json({
        message: "Internal Server Error",
        success: false
    });
  }
};


// delete project
export const deleteProject = async(req, res) => {
  try {
    const {projectId} = req.params;

    if(!req.user || !req.user.tenantId){
      return res.status(401).json({
        message: "User not authenticated",
        success: false
      })
    }
  
    const project = await Project.findOneAndDelete({
      _id: projectId,
      tenantId: req.user.tenantId
    });
  
    if(!project){
      return res.status(404).json({
        message: "project not found",
        success: false
      })
    }

  //   const project = await Project.findOne({
  //     _id: projectId,
  //     tenantId: req.user.tenantId
  //   });

  // if (!project) {
  //   return res.status(404).json({
  //     message: "Project not found",
  //     success: false
  //   });
  // }

  // const activeTaskCount = await Task.countDocuments({
  //   projectId,
  //   tenantId: req.user.tenantId,
  //   isDeleted: false,
  //   status: { $ne: "DONE" }
  // });

  // const memberCount = await ProjectMember.countDocuments({
  //   projectId,
  //   tenantId: req.user.tenantId
  // });

  // if (activeTaskCount > 0 || memberCount > 0) {
  //   return res.status(400).json({
  //     message: "Project cannot be deleted while it has active tasks or members",
  //     success: false
  //   });
  // }

  // await Project.deleteOne({
  //   _id: projectId,
  //   tenantId: req.user.tenantId
  // });

    await createActivityLog({
      action: "PROJECT_DELETED",
      entityType: "PROJECT",
      entityId: project._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId
    });
  
    return res.status(200).json({
      message: "Project deleted successfully"
    })
  } catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
}





// Update Project Status
export const updateProjectStatus = async (req, res) => {
  try {

    const { projectId } = req.params;
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ["ACTIVE", "ARCHIVED", "COMPLETED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        success: false
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      tenantId: req.user.tenantId
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        success: false
      });
    }

    const allowedTransitions = {
      ACTIVE: ["ARCHIVED"],
      ARCHIVED: ["COMPLETED"],
      COMPLETED: [],
    };

    const nextStatuses = allowedTransitions[currentStatus] || [];

    if (!nextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Project cannot move from ${currentStatus} to ${status}.`,
      });
    }

    project.status = status;
    await project.save();

    await createActivityLog({
      action: `PROJECT_STATUS_UPDATED_TO_${status}`,
      entityType: "PROJECT",
      entityId: project._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId
    });


    return res.status(200).json({
      message: "Project status updated successfully",
      success: true,
      project
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to update status",
      success: false
    });
  }
}; 