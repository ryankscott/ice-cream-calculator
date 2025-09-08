import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { createDatabase, runMigrations } from './database/connection';
import { createIngredientsRoutes, createSuppliersRoutes } from './routes/ingredients.routes';
import { createIngredientsService, createSuppliersService } from './services/ingredients.service';
import { seedFunctionalDatabase } from './database/seeds/ingredients.seed';
import { requestLogger, enhancedErrorHandler } from './middleware/logging.middleware';
import { specs } from './docs/swagger';
import logger from './utils/logger';

const PORT = process.env.PORT || 3004;

async function createApp(): Promise<Application> {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // Database setup
  const db = createDatabase();
  await runMigrations(db);
  
  // Initialize services using functional approach
  const ingredientsService = createIngredientsService(db);
  const suppliersService = createSuppliersService(db);

  // API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: 'Ice Cream Calculator API',
    customCss: '.swagger-ui .topbar { display: none }',
  }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // API routes - the functional services match the interface expected by routes
  app.use('/api/ingredients', createIngredientsRoutes(ingredientsService as any));
  app.use('/api/suppliers', createSuppliersRoutes(ingredientsService as any));

  // Error handling middleware (must be last)
  app.use(enhancedErrorHandler);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.originalUrl} not found`
      }
    });
  });

  // Seed database if needed
  try {
    await seedFunctionalDatabase(db);
    logger.info('Database initialization completed');
  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, 'Failed to seed database');
  }

  return app;
}

// Start server if this file is run directly
if (require.main === module) {
  createApp().then(app => {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
      logger.info(`💓 Health check available at http://localhost:${PORT}/health`);
    });
  }).catch(error => {
    logger.error({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, 'Failed to start server');
    process.exit(1);
  });
}

export { createApp };
export default createApp;
