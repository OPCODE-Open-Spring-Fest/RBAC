export const checkRole = (roles = []) => {
	return (req, res, next) => {
		if (!Array.isArray(roles) || roles.length === 0) {
			return res.status(500).json({ message: "RBAC misconfiguration: roles array is required" });
		}

		const userRole = req?.user?.role;
		if (!userRole) {
			return res.status(403).json({ message: "Forbidden: Role is missing" });
		}

		const isAllowed = roles.includes(userRole);
		if (!isAllowed) {
			return res.status(403).json({ message: "Forbidden" });
		}

		return next();
	};
};


