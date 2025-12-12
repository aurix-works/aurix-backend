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
- ✅ Example values

### 2. Schema Definitions
Comprehensive schemas for:
- **Error** - Error response structure

### 3. Organized by Tags
Endpoints are grouped into logical sections:
- **Health** - Health check endpoints

### 4. Multiple Servers
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

### Step 3: Test Endpoints
Now you can test any endpoint:
1. Expand any endpoint (e.g., **GET /health**)
2. Click "Try it out"
3. Click "Execute"
4. View the response

## Configuration

### Swagger Configuration File
Located at: `src/config/swagger.ts`

Key configurations:
```typescript
{
  openapi: '3.0.0',
  info: {
    title: 'Enterprise API',
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

## Adding New Endpoints

When you add new endpoints, document them using JSDoc comments:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Short description
 *     tags: [YourTag]
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
