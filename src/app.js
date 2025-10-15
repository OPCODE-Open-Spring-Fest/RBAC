import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import rateLimiter from './middlewares/rateLimiter.js';

const app = express();

app.use(cors());

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieparser());

app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);

export { app };