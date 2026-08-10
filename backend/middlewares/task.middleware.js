import Task from "../models/task.model.js";

// =======================================================
// Validate Task
// =======================================================

export const validateTask = async (req, res, next) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    req.task = task;

    next();

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================================
// Validate Task Status
// =======================================================

export const validateTaskStatus = (req, res, next) => {

  const { status } = req.body;

  const allowedStatus = [
    "TODO",
    "IN_PROGRESS",
    "DONE",
  ];

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Task status is required.",
    });
  }

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task status.",
    });
  }

  next();
};

// =======================================================
// Validate Status Transition
// =======================================================

export const validateTaskStatusFlow = (req, res, next) => {

  const task = req.task;
  const newStatus = req.body.status;

  const statusFlow = {
    TODO: ["IN_PROGRESS"],
    IN_PROGRESS: ["DONE"],
    DONE: [],
  };

  if (!statusFlow[task.status].includes(newStatus)) {

    return res.status(400).json({
      success: false,
      message: `Cannot move task from ${task.status} to ${newStatus}.`,
    });

  }

  next();

};