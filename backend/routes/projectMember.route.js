import express from "express";
import {
  assignUser,
  removeUser,
  getProjectMembers
} from "../controllers/projectMember.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/assign-user",
  isAuthenticated,
  allowRoles(["OWNER", "ADMIN"]),
  assignUser
);


router.delete(
  "/remove-user",
  isAuthenticated,
  allowRoles(["OWNER", "ADMIN"]),
  removeUser
);

router.get(
  "/:projectId/members",
  isAuthenticated,
  allowRoles(["OWNER", "ADMIN", "MEMBER"]),
  getProjectMembers
);

export default router;