import ActivityLog from "../models/activityLog.model.js";

export const getActivityLogs = async (req, res) => {
  try {

    const logs = await ActivityLog.find({
      tenantId: req.user.tenantId
    })
    .populate("performedBy", "name email role")
    .sort({ createdAt: -1 })
    .limit(20);

    res.status(200).json(logs);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch logs"
    });
  }
};