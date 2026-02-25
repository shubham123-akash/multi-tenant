import express from "express";
import { createProject, deleteProject, getAllProjects, getSingleProject, updateProjectStatus } from "../controllers/project.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";


const router = express.Router();

router.route("/createProject").post(isAuthenticated,allowRoles(["OWNER", "ADMIN"]), createProject);
router.route("/getAllProjects").get(isAuthenticated, allowRoles(["OWNER", "ADMIN", "MEMBER"]), getAllProjects);
router.route("/getSingleProject/:id").get(isAuthenticated, getSingleProject);
router.route("/deleteProject/:projectId").delete(isAuthenticated, allowRoles(["OWNER", "ADMIN"]), deleteProject);
router.route("/updateStatus/:projectId").patch(isAuthenticated, allowRoles(["OWNER", "ADMIN"]), updateProjectStatus);

export default router;