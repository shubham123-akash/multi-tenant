import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema(
  {
    // Project to which the user belongs
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // Assigned User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Tenant (Company)
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    // Who assigned the user
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // User's role inside the project
    role: {
      type: String,
      enum: ["MANAGER", "MEMBER"],
      default: "MEMBER",
    },

    // Assignment status
    status: {
      type: String,
      enum: ["ACTIVE", "REMOVED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// Prevent duplicate assignment of the same user to the same project
projectMemberSchema.index(
  {
    projectId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

const ProjectMember = mongoose.model(
  "ProjectMember",
  projectMemberSchema
);

export default ProjectMember;