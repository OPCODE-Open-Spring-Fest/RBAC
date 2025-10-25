import ApiError from '../utils/ApiError.js';

export const checkRole = (roles = []) => {
  return (req, res, next) => {
    if (!Array.isArray(roles) || roles.length === 0) {
      return next(new ApiError(500, 'RBAC misconfiguration: roles array is required'));
    }

    const userRole = req?.user?.role;
    if (!userRole) {
      return next(new ApiError(403, 'Forbidden: Role is missing'));
    }
    const isAllowed = roles.includes(roleName);
    if (!isAllowed) {
      return next(new ApiError(403, 'Forbidden'));
    }

    return next();
  };
};

