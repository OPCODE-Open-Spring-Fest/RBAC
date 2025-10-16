import express from 'express';
import { registerUser,loginUser } from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import {validateMiddleware} from '../middlewares/validate.middleware.js';


const router = express.Router();

router.post('/register', validateMiddleware(registerSchema), registerUser);
router.post('/login', validateMiddleware(loginSchema), loginUser);

export default router;
