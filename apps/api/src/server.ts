import { createApp } from './app';
import { env } from './config/env';
import { logger } from './common/logger';
import { store } from './modules/public/data';
import { db } from './modules/db/postgres';

async function bootstrap() {
  const app = createApp();

  // Await complete database hydration from Neon before opening the HTTP port
  await store.init();

  const server = app.listen(env.PORT, () => {
    logger.info(`TRAIC API server listening on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
  });

  // Graceful shutdown: close HTTP listeners then drain PostgreSQL pool
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      logger.info('HTTP server closed. Draining database connection pool...');
      await db.close();
      logger.info('Database pool drained. Process exiting cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Failed to start API server');
  process.exit(1);
});

