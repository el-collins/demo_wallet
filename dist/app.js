"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = require("./config/database");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = __importDefault(require("./utils/logger"));
const response_1 = require("./utils/response");
const swagger_1 = require("./swagger");
// Initialize express app
const app = (0, express_1.default)();
exports.app = app;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);
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
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
function gracefulShutdown() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info('Starting graceful shutdown...');
        try {
            // Close database connection
            yield database_1.db.destroy();
            logger_1.default.info('Database connections closed.');
            // Close server
            if (server) {
                server.close(() => {
                    logger_1.default.info('Server closed.');
                    process.exit(0);
                });
            }
            else {
                process.exit(0);
            }
        }
        catch (error) {
            logger_1.default.error('Error during shutdown:', error);
            process.exit(1);
        }
    });
}
// Server setup
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    logger_1.default.info(`Server is running on port ${PORT}`);
});
exports.server = server;
// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception:', error);
    gracefulShutdown();
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown();
});
