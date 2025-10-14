import express from 'express';
import {
  CheckHealth,
  login,
  UserRegistration,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);

router.get('/health', CheckHealth);

router.post('/register', UserRegistration);

export default router;
