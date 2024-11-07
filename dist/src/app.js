"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import helmet from 'helmet';
const morgan_1 = __importDefault(require("morgan"));
// import { knex } from './config/database';
const routes_1 = __importDefault(require("./routes"));
const logger_1 = __importDefault(require("./utils/logger"));
const response_1 = require("./utils/response");
const swagger_1 = require("./swagger");
// Initialize express app
const app = (0, express_1.default)();
exports.app = app;
// Security middleware
// app.use(helmet()); // Adds various HTTP headers for security
app.use((0, cors_1.default)()); // Enable CORS for all routes
// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api', limiter);
// Request parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging middleware
if (process.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('combined', {
        stream: {
            write: (message) => {
                logger_1.default.info(message.trim());
            },
        },
    }));
}
// Health check endpoint
app.get('/health', (req, res) => {
    (0, response_1.handleResponse)(res, 200, 'Service is healthy', {
        status: 'UP',
        timestamp: new Date().toISOString()
    });
});
app.get("/", (req, res) => {
    res.redirect("/api-docs");
});
// API routes
app.use('/api/v1', routes_1.default);
// Setup Swagger
(0, swagger_1.setupSwagger)(app);
// 404 handler
app.use((req, res) => {
    (0, response_1.handleResponse)(res, 404, 'Resource not found', null);
});
// Global error handler
app.use((err, req, res, next) => {
    logger_1.default.error('Unhandled error:', err);
    (0, response_1.handleError)(res, err);
});
// Graceful shutdown
// process.on('SIGTERM', gracefulShutdown);
// process.on('SIGINT', gracefulShutdown);
// async function gracefulShutdown() {
//   logger.info('Starting graceful shutdown...');
//   try {
//     // Close database connection
//     await knex.destroy();
//     logger.info('Database connections closed.');
//     // Close server
//     if (server) {
//       server.close(() => {
//         logger.info('Server closed.');
//         process.exit(0);
//       });
//     } else {
//       process.exit(0);
//     }
//   } catch (error) {
//     logger.error('Error during shutdown:', error);
//     process.exit(1);
//   }
// }
// Server setup
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    logger_1.default.info(`Server is running on port ${PORT}`);
});
exports.server = server;
