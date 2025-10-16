import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import Role from "../models/Role.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // populate role for convenience
    const user = await User.findById(decoded._id).populate("role");

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const rbacMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.role) {
        return res.status(403).json({ message: "Role not assigned" });
      }
      let userRole;
      if (typeof req.user.role === "object" && req.user.role !== null) {
        userRole = req.user.role;
      } else {
        userRole = await Role.findById(req.user.role);
      }

      if (!userRole || userRole.name !== requiredRole) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Error in RBAC middleware" });
    }
  };
};
