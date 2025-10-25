import express from 'express';
import { registerUser,loginUser } from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import {validateMiddleware} from '../middlewares/validate.middleware.js';
import { forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validateMiddleware(registerSchema), registerUser);
router.post('/login', validateMiddleware(loginSchema), loginUser);
router.post('/forgotPassword',forgotPassword);
router.post('/resetPassword/:token',resetPassword);

export default router;
