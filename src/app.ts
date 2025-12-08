import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/error.middleware';
import { HealthController } from './controllers/health.controller';
import { AppError } from './middlewares/error.middleware';
import userRoutes from './routes/user.routes';
import roleRoutes from './routes/role.routes';
import permissionRoutes from './routes/permission.routes';
import { swaggerSpec } from './config/swagger';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Handle favicon.ico to prevent 404s
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Enterprise API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Server is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', HealthController.check);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

// 404 Handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
