import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"
import rbacRoutes from './routes/rbacRoutes.js';
import dotenv from "dotenv";
import roleRoutes from "./routes/role.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
dotenv.config();

const app = express();

// Middleware setup
app.use(
  cors({
    origin: process.env.CORS_URL || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/auth", authRoutes)
app.use('/api/rbac-test', rbacRoutes);
// Root route
app.get("/", (req, res) => {
  res.send("RBAC is running...");
});

export { app };