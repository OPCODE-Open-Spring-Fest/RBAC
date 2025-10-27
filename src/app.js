import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import logger from "./config/logger.js";
import authRoutes from "./routes/authRoutes.js";
import rbacRoutes from "./routes/rbacRoutes.js";
import roleRoutes from "./routes/role.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import rateLimiter from './middlewares/rateLimiter.js';
import errorHandler from "./middlewares/error.middleware.js";

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../src/utils/swagger.js';

dotenv.config();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_URL || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// logging middleware
app.use(morgan("combined", { stream: logger.stream }));
app.use(
  morgan("tiny", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

//  Routes
app.use("/api/auth", authRoutes);
app.use(rateLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/rbac-test", rbacRoutes);

//  Root route
app.get("/", (req, res) => {
  res.send("RBAC is running...");
});
//global error handler
app.use(errorHandler);  

export { app };