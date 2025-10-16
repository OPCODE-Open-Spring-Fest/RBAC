import * as permissionService from "../services/permission.service.js";

export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const perm = await permissionService.createPermission(name, description);
    res.status(201).json(perm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getPermissions = async (req, res) => {
  try {
    const perms = await permissionService.getPermissions();
    res.json(perms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPermissionById = async (req, res) => {
  try {
    const perm = await permissionService.getPermissionById(req.params.id);
    if (!perm) return res.status(404).json({ message: "Permission not found" });
    res.json(perm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const perm = await permissionService.updatePermission(req.params.id, req.body);
    if (!perm) return res.status(404).json({ message: "Permission not found" });
    res.json(perm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const deleted = await permissionService.deletePermission(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Permission not found" });
    res.json({ message: "Permission deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};