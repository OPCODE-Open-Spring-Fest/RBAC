import express from 'express';
import { registerUser,loginUser, CheckHealth } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/health',CheckHealth)

export default router;
