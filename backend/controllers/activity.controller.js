import ActivityLog from "../models/activityLog.model.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.js";
import { getCache, setCache } from "../utils/cache.js";

const activityLogsKey = (tenantId, page, limit) =>
  `activity:tenant:${tenantId}:page:${page}:limit:${limit}`;

export const getActivityLogs = async (req, res) => {
  try {

    const { page, limit, skip } = getPagination(req, { defaultLimit: 20 });

    const cacheKey = activityLogsKey(req.user.tenantId, page, limit);

    const cached = await getCache(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(cached);
    }

    const filter = { tenantId: req.user.tenantId };

    const [logs, totalItems] = await Promise.all([
      ActivityLog.find(filter)
        .populate("performedBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(filter)
    ]);

    const responsePayload = {
      success: true,
      logs,
      pagination: buildPaginationMeta(totalItems, page, limit)
    };

    // Activity feed changes frequently — short TTL
    await setCache(cacheKey, responsePayload, 30);

    res.status(200).json(responsePayload);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch logs"
    });
  }
};