import asyncHandler from 'express-async-handler';
import * as permissionService from "../services/permission.service.js";
import ApiError from '../utils/ApiError.js';


/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: API for managing permissions
 */

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: create_user
 *               description:
 *                 type: string
 *                 example: Allows creation of users
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Invalid request data
 */
export const createPermission = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const perm = await permissionService.createPermission(name, description);
  res.status(201).json(perm);
});

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of permissions
 *       500:
 *         description: Server error
 */
export const getPermissions = asyncHandler(async (req, res) => {
  const perms = await permissionService.getPermissions();
  res.json(perms);
});


/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Permission ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission details
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
export const getPermissionById = asyncHandler(async (req, res) => {
  const perm = await permissionService.getPermissionById(req.params.id);
  if (!perm) throw new ApiError(404, 'Permission not found');
  res.json(perm);
});

/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     summary: Update a permission
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Permission ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: edit_user
 *               description:
 *                 type: string
 *                 example: Allows editing of users
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       404:
 *         description: Permission not found
 *       400:
 *         description: Invalid request data
 */
export const updatePermission = asyncHandler(async (req, res) => {
  const perm = await permissionService.updatePermission(req.params.id, req.body);
  if (!perm) throw new ApiError(404, 'Permission not found');
  res.json(perm);
});


/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Permission ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
export const deletePermission = asyncHandler(async (req, res) => {
  const deleted = await permissionService.deletePermission(req.params.id);
  if (!deleted) throw new ApiError(404, 'Permission not found');
  res.json({ message: "Permission deleted successfully" });
});