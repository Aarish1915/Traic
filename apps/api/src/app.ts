import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { healthRouter } from './modules/health/routes';
import { publicRouter } from './modules/public/routes';
import { errorHandler } from './common/middleware/error';
import { NotFoundError } from './common/errors';

export function createApp() {
  const app = express();

  // Security headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // API serves JSON, not HTML
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());
  app.use(
    cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  // Mount routers
  app.use(healthRouter);
  app.use(publicRouter);

  // Catch-all 404
  app.use((req, _res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
}
