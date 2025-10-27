import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/rbac.middleware.js';
import { adminAccessSchema, userAccessSchema } from '../validations/rbacValidation.js';
import {validateMiddleware} from '../middlewares/validate.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/rbac-test/admin-only:
 *   get:
 *     summary: Test endpoint for Admin role only
 *     description: Protected endpoint that only users with Admin role can access. Used for testing RBAC functionality.
 *     tags: [RBAC Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted to Admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome, Admin
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not have Admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/admin-only', validateMiddleware(adminAccessSchema, 'headers'), authMiddleware, checkRole(['Admin']), (req, res) => {
	return res.status(200).json({ message: 'Welcome, Admin' });
});

/**
 * @swagger
 * /api/rbac-test/user-only:
 *   get:
 *     summary: Test endpoint for User role only
 *     description: Protected endpoint that only users with User role can access. Used for testing RBAC functionality.
 *     tags: [RBAC Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted to User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome, User
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not have User role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user-only', validateMiddleware(userAccessSchema, 'headers'), authMiddleware, checkRole(['User']), (req, res) => {
	return res.status(200).json({ message: 'Welcome, User' });
});

 
 

export default router;


