import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routers from './components/routes';
import logging from '@util/logging';

// Load environment variables
dotenv.config();

const server: Express = express();
const port = process.env.PORT || process.env.APP_PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Security middleware
server.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProduction ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
server.use('/api/', limiter);

// Body parsing middleware
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
server.use(cors());

// Disable caching for API routes
server.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache');
    next();
});

// Request logging (development only)
if (!isProduction) {
    server.use((req, res, next) => {
        logging.info(`${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
server.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
    });
});

// API Routes
server.use('/api/v1', routers);

// 404 handler
server.use((req: Request, res: Response) => {
    res.status(404).json({
        type: 'not_found',
        message: 'Route not found',
        path: req.path,
    });
});

// Global error handler
server.use((err: any, req: Request, res: Response, next: any) => {
    logging.error('Global error handler:', err);
    res.status(err.status || 500).json({
        type: 'server_error',
        message: isProduction ? 'Internal server error' : err.message,
        ...(isProduction ? {} : { stack: err.stack }),
    });
});

// Start server
server.listen(port, () => {
    logging.info(`🚀 Server is running on port ${port}`);
    logging.info(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    logging.info(`🔒 Security: helmet ${isProduction ? '+ rate limiting' : ''} enabled`);
});

export default server;
