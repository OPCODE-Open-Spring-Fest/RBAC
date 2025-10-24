import * as roleService from "../services/role.service.js";

export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await roleService.createRole(name, permissions);
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await roleService.getRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const deleted = await roleService.deleteRole(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: "permissions must be an array of permission IDs" });
    }
    const role = await roleService.assignPermissions(req.params.id, permissions);
    if (!role) return res.status(404).json({ message: "Role not found" });
    // populate permissions before returning
    const populated = await roleService.getRoleById(role._id);
    res.json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};