import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/rbac.middleware.js';

const router = express.Router();


router.get('/admin-only', authMiddleware, checkRole(['Admin']), (req, res) => {
	return res.status(200).json({ message: 'Welcome, Admin' });
});

 
router.get('/user-only', authMiddleware, checkRole(['User']), (req, res) => {
	return res.status(200).json({ message: 'Welcome, User' });
});

 
 

export default router;


