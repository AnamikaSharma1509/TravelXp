import app from './app';
import { config } from './config/env';
import { logger } from './utils/logger';

const server = app.listen(config.port, () => {
  logger.info(`✨ TravelXP Backend Server running at http://localhost:${config.port}`);
  logger.info(`🌐 Environment: ${config.nodeEnv}`);
  logger.info(`📦 Database: PostgreSQL active on port 5434`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
