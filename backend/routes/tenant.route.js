import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getAllTenants, getTenantInformation } from "../controllers/tenant.controller.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.route("/getTenantInfo").get(isAuthenticated, getTenantInformation);
router.route("/getAllTenants").get(isAuthenticated, allowRoles(["OWNER", "ADMIN", "MEMBER"]), getAllTenants);


export default router;