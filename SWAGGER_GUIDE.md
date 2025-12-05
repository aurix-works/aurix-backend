# Swagger API Documentation Guide

## Overview

Your API now has comprehensive Swagger/OpenAPI 3.0 documentation with an interactive UI for testing endpoints.

## Installation

First, install the required dependencies:

```bash
npm install
```

This will install:
- `swagger-jsdoc` - Generates OpenAPI specs from JSDoc comments
- `swagger-ui-express` - Serves the Swagger UI
- `@types/swagger-jsdoc` - TypeScript types for swagger-jsdoc
- `@types/swagger-ui-express` - TypeScript types for swagger-ui-express

## Accessing Swagger Documentation

Once your server is running, you can access the Swagger documentation at:

### Interactive UI
```
http://localhost:3000/api-docs
```

This provides:
- Interactive API explorer
- Try out endpoints directly from the browser
- Request/response examples
- Schema definitions
- Authentication support

### JSON Specification
```
http://localhost:3000/api-docs.json
```

Returns the raw OpenAPI 3.0 specification in JSON format.

## Features Implemented

### 1. Complete API Documentation
All endpoints are documented with:
- ✅ Request parameters (path, query, body)
- ✅ Request body schemas
- ✅ Response schemas for all status codes
- ✅ Authentication requirements
- ✅ Permission requirements noted in descriptions
- ✅ Example values

### 2. Schema Definitions
Comprehensive schemas for:
- **User** - User entity with role information
- **CreateUser** - User creation payload
- **UpdateUser** - User update payload
- **Login** - Login credentials
- **LoginResponse** - Login response with token
- **Role** - Role entity with permissions
- **CreateRole** - Role creation payload
- **UpdateRole** - Role update payload
- **Permission** - Permission entity
- **CreatePermission** - Permission creation payload
- **UpdatePermission** - Permission update payload
- **Error** - Error response structure

### 3. Authentication
The Swagger UI includes JWT bearer token authentication:

1. Click the "Authorize" button in the Swagger UI
2. Enter your JWT token in the format: `Bearer <your-token>`
3. All subsequent requests will include the authorization header

### 4. Organized by Tags
Endpoints are grouped into logical sections:
- **Health** - Health check endpoints
- **Authentication** - Login endpoint
- **Users** - User management
- **Roles** - Role management
- **Permissions** - Permission management

### 5. Multiple Servers
Configured for both development and production:
- Development: `http://localhost:3000`
- Production: `https://api.example.com` (update in `src/config/swagger.ts`)

## Using Swagger UI

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Access Swagger UI
Open your browser and navigate to:
```
http://localhost:3000/api-docs
```

### Step 3: Login to Get Token
1. Find the **POST /api/users/login** endpoint under "Authentication"
2. Click "Try it out"
3. Enter the default admin credentials:
   ```json
   {
     "email": "admin@example.com",
     "password": "Admin@123"
   }
   ```
4. Click "Execute"
5. Copy the token from the response

### Step 4: Authorize
1. Click the "Authorize" button at the top
2. Enter the token (Swagger will automatically add "Bearer " prefix if needed)
3. Click "Authorize"
4. Click "Close"

### Step 5: Test Endpoints
Now you can test any protected endpoint:
1. Expand any endpoint (e.g., **GET /api/users**)
2. Click "Try it out"
3. Fill in any required parameters
4. Click "Execute"
5. View the response

## Configuration

### Swagger Configuration File
Located at: `src/config/swagger.ts`

Key configurations:
```typescript
{
  openapi: '3.0.0',
  info: {
    title: 'Enterprise User Management API',
    version: '1.0.0',
    description: '...',
    contact: { ... },
    license: { ... }
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Development' },
    { url: 'https://api.example.com', description: 'Production' }
  ]
}
```

### Customizing Swagger UI
In `src/app.ts`, you can customize the UI:
```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Enterprise API Documentation',
    // Add more options here
}));
```

Available options:
- `customCss` - Custom CSS styles
- `customSiteTitle` - Browser tab title
- `customfavIcon` - Custom favicon
- `swaggerOptions` - Swagger UI configuration options

## Adding New Endpoints

When you add new endpoints, document them using JSDoc comments:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Short description
 *     tags: [YourTag]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field1:
 *                 type: string
 *                 example: value1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 */
router.post('/your-endpoint', controller.method);
```

## Schema Examples

### Documented Endpoints

#### Authentication
- `POST /api/users/login` - User login

#### User Management
- `POST /api/users` - Create user (requires `user:create`)
- `GET /api/users` - Get all users with pagination (requires `user:read`)
- `GET /api/users/me/permissions` - Get current user's permissions
- `GET /api/users/{id}` - Get user by ID (requires `user:read`)
- `PUT /api/users/{id}` - Update user (requires `user:update`)
- `DELETE /api/users/{id}` - Delete user (requires `user:delete`)

#### Role Management
- `POST /api/roles` - Create role (requires `role:create`)
- `GET /api/roles` - Get all roles (requires `role:read`)
- `GET /api/roles/{id}` - Get role by ID (requires `role:read`)
- `PUT /api/roles/{id}` - Update role (requires `role:update`)
- `DELETE /api/roles/{id}` - Delete role (requires `role:delete`)

#### Permission Management
- `POST /api/permissions` - Create permission (requires `permission:create`)
- `GET /api/permissions` - Get all permissions (requires `permission:read`)
- `GET /api/permissions/{id}` - Get permission by ID (requires `permission:read`)
- `PUT /api/permissions/{id}` - Update permission (requires `permission:update`)
- `DELETE /api/permissions/{id}` - Delete permission (requires `permission:delete`)

## Response Codes

All endpoints document these status codes:
- **200** - Success (GET, PUT requests)
- **201** - Created (POST requests)
- **204** - No Content (DELETE requests)
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (not logged in)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error

## Best Practices

1. **Always Document New Endpoints**: Add Swagger annotations for any new routes
2. **Use Schema References**: Reference existing schemas instead of duplicating
3. **Include Examples**: Provide example values for better understanding
4. **Document Permissions**: Mention required permissions in endpoint descriptions
5. **Update Version**: Update API version in `swagger.ts` when making breaking changes

## Exporting Documentation

### Export as JSON
```bash
curl http://localhost:3000/api-docs.json > openapi-spec.json
```

### Generate Client SDKs
Use the OpenAPI spec to generate client libraries:

```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client
openapi-generator-cli generate -i http://localhost:3000/api-docs.json -g typescript-axios -o ./client

# Generate Python client
openapi-generator-cli generate -i http://localhost:3000/api-docs.json -g python -o ./client-python

# Generate Java client
openapi-generator-cli generate -i http://localhost:3000/api-docs.json -g java -o ./client-java
```

## Troubleshooting

### Swagger UI Not Loading
- Check that dependencies are installed: `npm install`
- Verify the server is running on the correct port
- Check browser console for errors

### Endpoints Not Appearing
- Ensure JSDoc comments are correctly formatted
- Check that route files are included in `apis` array in `swagger.ts`
- Restart the server after adding new documentation

### Authentication Not Working
- Verify you're using the correct token format: `Bearer <token>`
- Check that the token hasn't expired
- Ensure you clicked "Authorize" after entering the token

## Production Considerations

### Disable in Production (Optional)
If you want to disable Swagger in production:

```typescript
// In src/app.ts
if (config.nodeEnv === 'development') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
```

### Protect with Authentication (Optional)
Add authentication middleware to protect the docs:

```typescript
app.use('/api-docs', protect, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

### Update Server URLs
Update production URL in `src/config/swagger.ts`:

```typescript
servers: [
    {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
    },
    {
        url: 'https://api.yourcompany.com',  // Update this
        description: 'Production server',
    },
]
```

## Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [OpenAPI Generator](https://openapi-generator.tech/)
