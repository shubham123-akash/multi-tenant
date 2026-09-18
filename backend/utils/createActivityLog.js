import ActivityLog from "../models/activityLog.model.js";
import { deleteCacheByPattern } from "./cache.js";

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

    // Every new log invalidates ALL cached pages of this tenant's activity
    // feed (page 1, page 2, different limits, etc.), since pagination means
    // there's no single fixed key to delete anymore.
    await deleteCacheByPattern(`activity:tenant:${tenantId}:*`);
  } catch (error) {
    console.log("Activity log failed:", error.message);
  }
};