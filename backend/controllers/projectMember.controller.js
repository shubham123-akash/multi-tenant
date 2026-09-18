import Project from "../models/project.model.js";
import ProjectMember from "../models/projectMember.model.js";
import User from "../models/user.model.js";
import { createActivityLog } from "../utils/createActivityLog.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.js";
import { emitToProject } from "../utils/socket.js";
import { getCache, setCache, deleteCacheByPattern } from "../utils/cache.js";

const projectMembersKey = (tenantId, projectId, page, limit) =>
  `project-members:tenant:${tenantId}:project:${projectId}:page:${page}:limit:${limit}`;

const invalidateProjectMemberCaches = async (tenantId, projectId) => {
  await deleteCacheByPattern(`project-members:tenant:${tenantId}:project:${projectId}:*`);
};


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

    const populatedMember = await projectMember.populate([
      { path: "userId", select: "name email role" },
      { path: "assignedBy", select: "name email" }
    ]);

    emitToProject(req.project._id, "project:memberAssigned", populatedMember);

    // Cache Invalidation
    await invalidateProjectMemberCaches(req.user.tenantId, req.project._id);

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

    emitToProject(req.project._id, "project:memberRemoved", { userId });

    // Cache Invalidation
    await invalidateProjectMemberCaches(req.user.tenantId, req.project._id);

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

    const { page, limit, skip } = getPagination(req);

    const cacheKey = projectMembersKey(req.user.tenantId, req.project._id, page, limit);

    const cached = await getCache(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(cached);
    }

    const filter = {
      projectId: req.project._id,
      tenantId: req.user.tenantId,
    };

    const [members, totalItems] = await Promise.all([
      ProjectMember.find(filter)
        .populate("userId", "name email role")
        .populate("assignedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ProjectMember.countDocuments(filter)
    ]);

    const responsePayload = {
      success: true,
      totalMembers: totalItems,
      members,
      pagination: buildPaginationMeta(totalItems, page, limit)
    };

    await setCache(cacheKey, responsePayload, 300);

    return res.status(200).json(responsePayload);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project members.",
    });

  }
};