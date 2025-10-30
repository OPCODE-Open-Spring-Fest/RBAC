import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Health check endpoint for Docker
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'RBAC API is running',
    timestamp: new Date().toISOString(),
  });
});

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
