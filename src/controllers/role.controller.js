import * as roleService from "../services/role.service.js";

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API for managing user roles and their permissions
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
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
 *                 example: admin
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64f8a91d1b9d9c123456789a", "64f8a91d1b9d9c123456789b"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Invalid request data
 */
export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await roleService.createRole(name, permissions);
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of all roles with their permissions
 *       500:
 *         description: Server error
 */
export const getRoles = async (req, res) => {
  try {
    const roles = await roleService.getRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role details
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
export const getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Role ID
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
 *                 example: manager
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64f8a91d1b9d9c123456789a"]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 *       400:
 *         description: Invalid request data
 */
export const updateRole = async (req, res) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
export const deleteRole = async (req, res) => {
  try {
    const deleted = await roleService.deleteRole(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   put:
 *     summary: Assign permissions to a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissions
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64f8a91d1b9d9c123456789a", "64f8a91d1b9d9c123456789b"]
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Role not found
 */
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