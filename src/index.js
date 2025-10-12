// Entry point for RBAC authentication system

import express from 'express';
import { generalLimiter, authLimiter } from './middlewares/rateLimiter.js';

// Assuming you have an Express app instance
const app = express();

// Apply the general rate limiter to all requests
app.use(generalLimiter);

// Apply the stricter auth limiter to specific auth routes
/* 
Auth routes defined are like this: 
import authRoutes from './routes/auth.js'; 
app.use('/api/auth', authLimiter, authRoutes); 
*/

app.post('/api/auth/login', authLimiter, (req, res) => {
  res.send('Login endpoint');
});

app.post('/api/auth/register', authLimiter, (req, res) => {
  res.send('Register endpoint');
});
