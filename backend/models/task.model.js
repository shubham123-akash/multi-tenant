import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // Tenant
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    // Project
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    // Task Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Task Description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Assigned Member
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Project Manager who created the task
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Task Status
    status: {
      type: String,
      enum: [
        "TODO",
        "IN_PROGRESS",
        "DONE",
      ],
      default: "TODO",
    },

    // Task Priority
    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
      ],
      default: "MEDIUM",
    },

    // Due Date
    dueDate: {
      type: Date,
    },

    // Estimated Hours
    estimatedHours: {
      type: Number,
      default: 0,
      min: 0,
    },


    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

taskSchema.index({
  tenantId: 1,
  projectId: 1,
});

taskSchema.index({
  tenantId: 1,
  assignedTo: 1,
});

taskSchema.index({
  tenantId: 1,
  status: 1,
});

taskSchema.index({
  tenantId: 1,
  priority: 1,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;