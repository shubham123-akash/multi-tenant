import express from "express";
import {
  assignUser,
  removeUser,
  getProjectMembers
} from "../controllers/projectMember.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { validateActiveProject, validateProject } from "../middlewares/project.middleware.js";
import { validateProjectAssignment } from "../middlewares/projectAssignment.middleware.js";

const router = express.Router();



router.post(
  "/assign-user",
  isAuthenticated,
  allowRoles(["OWNER", "ADMIN"]),
  validateProject,
  validateActiveProject,
  validateProjectAssignment,
  assignUser
);



// router.post(
//   "/assign-user",
//   isAuthenticated,
//   allowRoles(["OWNER", "ADMIN"]),
//   assignUser
// );


router.delete(
  "/remove-user",
  isAuthenticated,
  allowRoles(["OWNER", "ADMIN"]),
  validateProject,
  validateActiveProject,
  removeUser
);


// router.delete(
//   "/remove-user",
//   isAuthenticated,
//   allowRoles(["OWNER", "ADMIN"]),
//   removeUser
// );



router.get(
  "/:projectId/members",
  isAuthenticated,
  allowRoles(["OWNER", "ADMIN", "MEMBER"]),
  validateProject,
  getProjectMembers
);

// router.get(
//   "/:projectId/members",
//   isAuthenticated,
//   allowRoles(["OWNER", "ADMIN", "MEMBER"]),
//   getProjectMembers
// );

export default router;