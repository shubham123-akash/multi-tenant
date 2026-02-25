import express from "express";
import dotenv from "dotenv";
import connectDB from "./constant/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import projectRouter from "./routes/project.route.js";
import tenantRouter from "./routes/tenant.route.js";
import cors from "cors";
import activityRouter from "./routes/activity.route.js";

const app = express();

dotenv.config({
    path: ".env"
})

connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}

app.use(cors(corsOptions));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/activity", activityRouter);


app.listen(process.env.PORT, () => {
    console.log(`server started on PORT : ${process.env.PORT}`);
})