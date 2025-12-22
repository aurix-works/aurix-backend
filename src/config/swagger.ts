import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Enterprise API',
            version: '1.0.0',
            description: 'Enterprise API documentation',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}`,
                description: 'Development server',
            },
            {
                url: 'https://api.example.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token',
                },
            },
            schemas: {
                Login: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'admin@example.com' },
                        password: { type: 'string', example: 'Admin@123' },
                    },
                },
                SystemService: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        code: { type: 'string' },
                        description: { type: 'string' },
                    },
                },
                Plan: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        code: { type: 'string' },
                        priceMonthly: { type: 'number' },
                        priceYearly: { type: 'number' },
                        isActive: { type: 'boolean' },
                    },
                },
                Organization: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        domain: { type: 'string' },
                    },
                },
                SubOrganization: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        organizationId: { type: 'integer' },
                        name: { type: 'string' },
                        contactEmail: { type: 'string' },
                        accountStatus: { type: 'string', enum: ['active', 'suspended', 'inactive'] },
                    },
                },
                Subscription: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        subOrganizationId: { type: 'integer' },
                        planId: { type: 'integer' },
                        startDate: { type: 'string', format: 'date' },
                        nextBillingDate: { type: 'string', format: 'date' },
                        status: { type: 'string', enum: ['active', 'expired', 'cancelled'] },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error',
                        },
                        message: {
                            type: 'string',
                            example: 'Error description',
                        },
                        statusCode: {
                            type: 'integer',
                            example: 400,
                        },
                    },
                },
                Department: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        code: { type: 'string' },
                        subOrganizationId: { type: 'integer' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        email: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        subOrganizationId: { type: 'integer' },
                    },
                },
                Role: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                    },
                },
                Permission: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                    },
                },
                LeaveType: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        code: { type: 'string' },
                        isCarryForward: { type: 'boolean' },
                    },
                },
                LeaveRequest: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        userId: { type: 'integer' },
                        leaveTypeId: { type: 'integer' },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                        reason: { type: 'string' },
                        currentStatus: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                    },
                },
            },
        },
        tags: [
            { name: 'Health', description: 'Health check endpoints' },
            { name: 'Authentication', description: 'User authentication' },
            { name: 'System Services', description: 'Manage system services' },
            { name: 'Plans', description: 'Manage subscription plans' },
            { name: 'Organizations', description: 'Manage organizations' },
            { name: 'Sub-Organizations', description: 'Manage sub-organizations' },
            { name: 'Subscriptions', description: 'Manage subscriptions' },
            { name: 'Departments', description: 'Manage departments' },
            { name: 'Users', description: 'Manage tenant users' },
            { name: 'Roles', description: 'Manage roles' },
            { name: 'Permissions', description: 'Manage permissions' },
            { name: 'Leave Management', description: 'Manage leave types, workflows, and requests' },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
