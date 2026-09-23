import { createApp } from './app';
import { env } from './config/env';
import { logger } from './common/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`TRAIC API server listening on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
