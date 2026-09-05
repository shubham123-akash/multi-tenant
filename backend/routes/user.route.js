import express from "express";
import { createUser, getMe, getUsers, Login, Logout, Register, refreshAccessToken } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.route("/register").post(authLimiter, Register);
router.route("/login").post(authLimiter, Login);
router.route("/refresh-token").post(authLimiter, refreshAccessToken);
router.route("/logout").get(Logout);
router.route("/createUsers").post(isAuthenticated, allowRoles(["OWNER"]), createUser);
router.route("/me").get(isAuthenticated, getMe);
router.route("/getUsers").get(isAuthenticated, allowRoles(["OWNER", "ADMIN", "MEMBER"]), getUsers);

export default router;