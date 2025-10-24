import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/rbac.middleware.js';
import { adminAccessSchema, userAccessSchema } from '../validations/rbacValidation.js';
import {validateMiddleware} from '../middlewares/validate.middleware.js';

const router = express.Router();


router.get('/admin-only', validateMiddleware(adminAccessSchema, 'headers'), authMiddleware, checkRole(['Admin']), (req, res) => {
	return res.status(200).json({ message: 'Welcome, Admin' });
});


router.get('/user-only', validateMiddleware(userAccessSchema, 'headers'), authMiddleware, checkRole(['User']), (req, res) => {
	return res.status(200).json({ message: 'Welcome, User' });
});

 
 

export default router;


