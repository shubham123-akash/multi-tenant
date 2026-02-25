import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: ""
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
    type: String,
    enum: ["ACTIVE", "ARCHIVED", "COMPLETED"],
    default: "ACTIVE"
  },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;