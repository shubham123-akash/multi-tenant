import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { getActivityLogs } from "../controllers/activity.controller.js";

const router = express.Router();

router.route("/getLogs").get(isAuthenticated, allowRoles(["OWNER", "ADMIN"]), getActivityLogs);

export default router;