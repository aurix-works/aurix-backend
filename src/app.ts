import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/error.middleware';
import { AppError } from './middlewares/error.middleware';
import { ERROR_MESSAGES } from './constants/messages';
import { HTTP_STATUS } from './constants/http';
import routes from './routes';



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


// API Routes
app.use('/api', routes);

// 404 Handler
app.all('*', (req, res, next) => {
    next(new AppError(ERROR_MESSAGES.SERVER.ROUTE_NOT_FOUND(req.originalUrl), HTTP_STATUS.NOT_FOUND));
});

// Global Error Handler
app.use(errorHandler);

export default app;
