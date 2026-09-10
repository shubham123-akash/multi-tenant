import ActivityLog from "../models/activityLog.model.js";
import { emitToTenant } from "./socket.js";

export const createActivityLog = async ({
  action,
  entityType,
  entityId,
  performedBy,
  tenantId
}) => {

  try {
    const log = await ActivityLog.create({
      action,
      entityType,
      entityId,
      performedBy,
      tenantId
    });

    const populatedLog = await log.populate("performedBy", "name email role");

    emitToTenant(tenantId, "activity:new", populatedLog);
  } catch (error) {
    console.log("Activity log failed:", error.message);
  }
};