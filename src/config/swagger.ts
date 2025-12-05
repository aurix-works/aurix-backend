import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Enterprise User Management API',
            version: '1.0.0',
            description: 'Comprehensive Role-Based Access Control (RBAC) API with flexible permission management',
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
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com',
                        },
                        firstName: {
                            type: 'string',
                            example: 'John',
                        },
                        lastName: {
                            type: 'string',
                            example: 'Doe',
                        },
                        phoneNumber: {
                            type: 'string',
                            nullable: true,
                            example: '+1234567890',
                        },
                        isActive: {
                            type: 'boolean',
                            example: true,
                        },
                        role: {
                            $ref: '#/components/schemas/RoleSimple',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        lastLoginAt: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                        },
                    },
                },
                CreateUser: {
                    type: 'object',
                    required: ['email', 'password', 'firstName', 'lastName', 'roleId'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'SecurePass123',
                            minLength: 8,
                        },
                        firstName: {
                            type: 'string',
                            example: 'John',
                        },
                        lastName: {
                            type: 'string',
                            example: 'Doe',
                        },
                        phoneNumber: {
                            type: 'string',
                            example: '+1234567890',
                        },
                        roleId: {
                            type: 'string',
                            format: 'uuid',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                    },
                },
                UpdateUser: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                        },
                        firstName: {
                            type: 'string',
                        },
                        lastName: {
                            type: 'string',
                        },
                        phoneNumber: {
                            type: 'string',
                        },
                        roleId: {
                            type: 'string',
                            format: 'uuid',
                        },
                        isActive: {
                            type: 'boolean',
                        },
                    },
                },
                Login: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'admin@example.com',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'Admin@123',
                        },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                    },
                },
                Role: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        name: {
                            type: 'string',
                            example: 'admin',
                        },
                        description: {
                            type: 'string',
                            nullable: true,
                            example: 'Full system access',
                        },
                        isActive: {
                            type: 'boolean',
                            example: true,
                        },
                        permissions: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Permission',
                            },
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                RoleSimple: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        name: {
                            type: 'string',
                            example: 'admin',
                        },
                        description: {
                            type: 'string',
                            nullable: true,
                            example: 'Full system access',
                        },
                    },
                },
                CreateRole: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            type: 'string',
                            example: 'custom_role',
                        },
                        description: {
                            type: 'string',
                            example: 'Custom role description',
                        },
                        permissionIds: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'uuid',
                            },
                        },
                    },
                },
                UpdateRole: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        permissionIds: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'uuid',
                            },
                        },
                        isActive: {
                            type: 'boolean',
                        },
                    },
                },
                Permission: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        name: {
                            type: 'string',
                            example: 'user:create',
                        },
                        resource: {
                            type: 'string',
                            example: 'users',
                        },
                        type: {
                            type: 'string',
                            enum: ['page', 'action'],
                            example: 'action',
                        },
                        description: {
                            type: 'string',
                            nullable: true,
                            example: 'Create new users',
                        },
                        isActive: {
                            type: 'boolean',
                            example: true,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                CreatePermission: {
                    type: 'object',
                    required: ['name', 'resource', 'type'],
                    properties: {
                        name: {
                            type: 'string',
                            example: 'custom:action',
                        },
                        resource: {
                            type: 'string',
                            example: 'custom_resource',
                        },
                        type: {
                            type: 'string',
                            enum: ['page', 'action'],
                            example: 'action',
                        },
                        description: {
                            type: 'string',
                            example: 'Custom permission description',
                        },
                    },
                },
                UpdatePermission: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                        resource: {
                            type: 'string',
                        },
                        type: {
                            type: 'string',
                            enum: ['page', 'action'],
                        },
                        description: {
                            type: 'string',
                        },
                        isActive: {
                            type: 'boolean',
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication endpoints',
            },
            {
                name: 'Users',
                description: 'User management endpoints',
            },
            {
                name: 'Roles',
                description: 'Role management endpoints',
            },
            {
                name: 'Permissions',
                description: 'Permission management endpoints',
            },
            {
                name: 'Health',
                description: 'Health check endpoints',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
