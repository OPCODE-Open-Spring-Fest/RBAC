import asyncHandler from 'express-async-handler';
import * as permissionService from "../services/permission.service.js";
import ApiError from '../utils/ApiError.js';

export const createPermission = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const perm = await permissionService.createPermission(name, description);
  res.status(201).json(perm);
});

export const getPermissions = asyncHandler(async (req, res) => {
  const perms = await permissionService.getPermissions();
  res.json(perms);
});

export const getPermissionById = asyncHandler(async (req, res) => {
  const perm = await permissionService.getPermissionById(req.params.id);
  if (!perm) throw new ApiError(404, 'Permission not found');
  res.json(perm);
});

export const updatePermission = asyncHandler(async (req, res) => {
  const perm = await permissionService.updatePermission(req.params.id, req.body);
  if (!perm) throw new ApiError(404, 'Permission not found');
  res.json(perm);
});

export const deletePermission = asyncHandler(async (req, res) => {
  const deleted = await permissionService.deletePermission(req.params.id);
  if (!deleted) throw new ApiError(404, 'Permission not found');
  res.json({ message: "Permission deleted successfully" });
});