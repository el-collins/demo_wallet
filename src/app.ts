// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { db } from './config/database';
import routes from './routes';
import logger from './utils/logger';
import { handleResponse, handleError } from './utils/response';
import { setupSwagger } from './swagger';
import dotenv from 'dotenv';


dotenv.config();




// Initialize express app
const app = express();

// Security middleware
app.use(helmet()); 
app.use(cors()); 

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  }));
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  handleResponse(res, 200, 'Service is healthy', {
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// API routes
app.use('/api/v1', routes);

// Setup Swagger
setupSwagger(app);

// 404 handler
app.use((req: Request, res: Response) => {
  handleResponse(res, 404, 'Resource not found', null);
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);
  handleError(res, err);
});

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  logger.info('Starting graceful shutdown...');
  
  try {
    // Close database connection
    await db.destroy();
    logger.info('Database connections closed.');
    
    // Close server
    if (server) {
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Server setup
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

export { app, server };