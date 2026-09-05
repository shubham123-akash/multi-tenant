// import ActivityLog from "../models/activityLog.model.js";

// export const getActivityLogs = async (req, res) => {
//   try {

//     const logs = await ActivityLog.find({
//       tenantId: req.user.tenantId
//     })
//     .populate("performedBy", "name email role")
//     .sort({ createdAt: -1 })
//     .limit(20);

//     res.status(200).json(logs);

//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch logs"
//     });
//   }
// };


import ActivityLog from "../models/activityLog.model.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.js";

export const getActivityLogs = async (req, res) => {
  try {

    const { page, limit, skip } = getPagination(req, { defaultLimit: 20 });

    const filter = { tenantId: req.user.tenantId };

    const [logs, totalItems] = await Promise.all([
      ActivityLog.find(filter)
        .populate("performedBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      logs,
      pagination: buildPaginationMeta(totalItems, page, limit)
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch logs"
    });
  }
};