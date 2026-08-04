import express from "express";

import {
  createTask,
  getAllTasks,
  deleteTask,
  getSingleTask,
  updateTask,
  updateTaskStatus
} from "../controllers/task.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();



router.post(
  "/create",
  isAuthenticated,
  createTask
);


router.get(
  "/",
  isAuthenticated,
  getAllTasks
);



router.get(
  "/:id",
  isAuthenticated,
  getSingleTask
);


router.put(
  "/:id",
  isAuthenticated,
  updateTask
);


router.patch(
  "/:id/status",
  isAuthenticated,
  updateTaskStatus
);



router.delete(
  "/:id",
  isAuthenticated,
  deleteTask
);

export default router;