import ActivityLog from "../models/activityLog.model.js";

export const createActivityLog = async ({
  action,
  entityType,
  entityId,
  performedBy,
  tenantId
}) => {

  try {
    await ActivityLog.create({
      action,
      entityType,
      entityId,
      performedBy,
      tenantId
    });
  } catch (error) {
    console.log("Activity log failed:", error.message);
  }
};