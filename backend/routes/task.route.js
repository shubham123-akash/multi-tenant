import express from "express";

import {
  createTask,
  getAllTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

import {
  validateProject,
  validateActiveProject,
} from "../middlewares/project.middleware.js";

import {
  isProjectManager,
  checkProjectManager,
  validateAssignedMember,
} from "../middlewares/projectRole.middleware.js";

import {
  validateTask,
  validateTaskStatus,
  validateTaskStatusFlow,
} from "../middlewares/task.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Create Task
| Only Project Manager
|--------------------------------------------------------------------------
*/
router.post(
  "/create",
  isAuthenticated,
  validateProject,
  validateActiveProject,
  isProjectManager,
  validateAssignedMember,
  createTask
);

/*
|--------------------------------------------------------------------------
| Get All Tasks
| Manager -> Tasks of managed projects
| Member -> Only assigned tasks
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  isAuthenticated,
  checkProjectManager,
  getAllTasks
);

/*
|--------------------------------------------------------------------------
| Get Single Task
|--------------------------------------------------------------------------
*/
// router.get(
//   "/:id",
//   isAuthenticated,
//   validateTask,
//   getSingleTask
// );

/*
|--------------------------------------------------------------------------
| Update Task
| Only Project Manager
|--------------------------------------------------------------------------
*/
// router.put(
//   "/:id",
//   isAuthenticated,
//   validateTask,
//   validateProject,
//   validateActiveProject,
//   isProjectManager,
//   validateAssignedMember,
//   updateTask
// );

/*
|--------------------------------------------------------------------------
| Update Task Status
| Only Project Manager
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/status",
  isAuthenticated,
  validateTask,
  validateTaskStatus,
  validateProject,
  validateActiveProject,
  
  validateTaskStatusFlow,
  updateTaskStatus
);

/*
|--------------------------------------------------------------------------
| Delete Task
| Only Project Manager
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  isAuthenticated,
  validateTask,
  validateProject,
  validateActiveProject,
  isProjectManager,
  deleteTask
);

export default router;