import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({

  action: {
    type: String,
    required: true
  },

  entityType: {
    type: String,
    enum: ["PROJECT", "USER", "PROJECT_MEMBER"],
    required: true
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  }

}, { timestamps: true });

export default mongoose.model("ActivityLog", activityLogSchema);
