import express from "express";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./constant/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import projectRouter from "./routes/project.route.js";
import tenantRouter from "./routes/tenant.route.js";
import cors from "cors";
import activityRouter from "./routes/activity.route.js";
import projectMemberRoute from "./routes/projectMember.route.js";
import taskRoute from "./routes/task.route.js";
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";
import { initSocket } from "./utils/socket.js";

const app = express();
const httpServer = http.createServer(app);

dotenv.config({
    path: ".env"
})

connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}

app.use(cors(corsOptions));

// applies to every /api route; individual routers add stricter limits on top where needed
app.use("/api", globalLimiter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/activity", activityRouter);
app.use("/api/v1/project-member", projectMemberRoute);
app.use("/api/v1/tasks", taskRoute);

initSocket(httpServer);

httpServer.listen(process.env.PORT, () => {
    console.log(`server started on PORT : ${process.env.PORT}`);
})