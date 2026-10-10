import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/apiRoutes';
import { errorHandler } from './middleware/errorHandler';
import { sendError } from './utils/response';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Logging
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP. Please try again after a few minutes.',
    },
  },
});
app.use('/api/', limiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TravelXP REST API' });
});

// Mount V1 API
app.use('/api/v1', apiRoutes);

// 404 Handler
app.use((_req, res) => {
  return sendError(res, 'Endpoint not found', 404, 'NOT_FOUND');
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
