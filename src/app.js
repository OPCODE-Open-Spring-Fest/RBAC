import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import rbacRoutes from './routes/rbacRoutes.js'; 
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './config/logger.js';
const app = express();
app.use(helmet());

app.use(cors({
  origin: process.env.CORS_URL,
  credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieparser());
app.use(morgan("combined", { stream: logger.stream }));

app.use(
  morgan("tiny", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

//routes
app.use('/api/auth', authRoutes);
app.use('/api/rbac-test', rbacRoutes);

export { app };