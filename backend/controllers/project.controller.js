import Project from "../models/project.model.js";
import { createActivityLog } from "../utils/createActivityLog.js";


// create Project
export const createProject = async(req, res) => {
    try {
        const {name, description} = req.body;
    
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
    } catch (error) {
        console.log(error);
    }
}


// Get All Projects (Active + Archived)
export const getAllProjects = async (req, res) => {
  try {

    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false
      });
    }

    const projects = await Project.find({
      tenantId: req.user.tenantId
    });

    return res.status(200).json(projects);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch projects",
      success: false
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
  } catch (error) {
    console.log(error);
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
          return res.status(401).json({
            message: "project not found",
            success: false
          })
        }

        await createActivityLog({
          action: "PROJECT_DELETED",
          entityType: "PROJECT",
          entityId: project._id,
          performedBy: req.user.userId,
          tenantId: req.user.tenantId
        });

    
        return res.status(201).json({
          message: "Project deleted successfully"
        })
    } catch (error) {
      console.log(error);
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