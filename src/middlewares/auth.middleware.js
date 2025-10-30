import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import Role from "../models/Role.model.js";
import ApiError from "../utils/ApiError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next(new ApiError(401, 'No token provided'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // populate role for convenience
    const user = await User.findById(decoded._id).populate("role");

    if (!user) return next(new ApiError(404, 'User not found'));

    req.user = user;
    next();
  } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired token'));
    }
    return next(new ApiError(500, 'Error in authentication middleware'));
  }
};

export const rbacMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.role) {
        return next(new ApiError(403, 'Role not assigned'));
      }
      let userRole;
      if (typeof req.user.role === "object" && req.user.role !== null) {
        userRole = req.user.role;
      } else {
        userRole = await Role.findById(req.user.role);
      }

      if (!userRole || userRole.name !== requiredRole) {
        return next(new ApiError(403, 'Access denied'));
      }

      next();
    } catch (error) {
      return next(new ApiError(500, 'Error in RBAC middleware'));
    }
  };
};
