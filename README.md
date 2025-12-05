# Enterprise User Management API

A comprehensive Node.js backend API with role-based access control (RBAC), flexible permission management, and complete Swagger documentation.

## Features

- **Role-Based Access Control (RBAC)** - Flexible permission system for pages and actions
- **User Management** - Complete CRUD operations with authentication
- **JWT Authentication** - Secure token-based authentication
- **Permission System** - Granular control over user actions and page access
- **Swagger Documentation** - Interactive API documentation and testing
- **PM2 Process Management** - Production-grade process management with clustering
- **TypeScript** - Full type safety
- **TypeORM** - Database ORM with MySQL support
- **MongoDB Support** - Additional NoSQL database integration
- **Redis Caching** - Performance optimization
- **AWS SQS Integration** - Message queue support
- **Email & SMS** - Communication integration (Nodemailer, Twilio)

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Databases**: MySQL (TypeORM), MongoDB (Mongoose), Redis
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet
- **Documentation**: Swagger/OpenAPI 3.0
- **Cloud**: AWS SQS
- **Communications**: Nodemailer, Twilio

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MySQL Server
- MongoDB Server
- Redis Server

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=enterprise_db

# MongoDB
MONGO_URI=mongodb://localhost:27017/enterprise_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=1d

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
SQS_QUEUE_URL=your_sqs_queue_url

# Email (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
WHATSAPP_PHONE_NUMBER=your_whatsapp_number
```

### 3. Database Setup & Seed

Run the seed script to create default roles, permissions, and admin user:

```bash
npm run seed
```

This creates:
- **4 default roles**: admin, hr_manager, finance, employee
- **30+ permissions**: for pages and actions
- **Default admin user**:
  - Email: `admin@example.com`
  - Password: `Admin@123`

### 4. Start the Server

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

### 5. Access Swagger Documentation

Open your browser and navigate to:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication
- `POST /api/users/login` - User login

### User Management
- `POST /api/users` - Create user (requires `user:create` permission)
- `GET /api/users` - Get all users with pagination (requires `user:read`)
- `GET /api/users/me/permissions` - Get current user's permissions
- `GET /api/users/:id` - Get user by ID (requires `user:read`)
- `PUT /api/users/:id` - Update user (requires `user:update`)
- `DELETE /api/users/:id` - Delete user (requires `user:delete`)

### Role Management
- `POST /api/roles` - Create role (requires `role:create`)
- `GET /api/roles` - Get all roles (requires `role:read`)
- `GET /api/roles/:id` - Get role by ID (requires `role:read`)
- `PUT /api/roles/:id` - Update role (requires `role:update`)
- `DELETE /api/roles/:id` - Delete role (requires `role:delete`)

### Permission Management
- `POST /api/permissions` - Create permission (requires `permission:create`)
- `GET /api/permissions` - Get all permissions (requires `permission:read`)
- `GET /api/permissions/:id` - Get permission by ID (requires `permission:read`)
- `PUT /api/permissions/:id` - Update permission (requires `permission:update`)
- `DELETE /api/permissions/:id` - Delete permission (requires `permission:delete`)

### Health Check
- `GET /health` - Server health check

## Default Roles

### 1. Admin
**Full system access** with all permissions
- Manages users, roles, and permissions
- Access to all pages and actions

### 2. HR Manager
**User and leave management**
- Create, read, update users
- Approve/reject leave requests
- Manage attendance
- Access: Dashboard, Users, Leave, Attendance, Reports

### 3. Finance
**Payroll and financial operations**
- Create, read, update, approve payroll
- View employee information
- View attendance records
- Access: Dashboard, Payroll, Reports, Attendance

### 4. Employee
**Basic employee access**
- View own information
- Create and view leave requests
- Mark and view own attendance
- Access: Dashboard, Leave, Attendance

## Permission System

### Permission Types
- **Page Permissions**: Control access to pages (e.g., `page:dashboard`, `page:users`)
- **Action Permissions**: Control specific actions (e.g., `user:create`, `payroll:approve`)

### Available Permissions

#### User Permissions
- `user:create`, `user:read`, `user:update`, `user:delete`

#### Role Permissions
- `role:create`, `role:read`, `role:update`, `role:delete`

#### Permission Permissions
- `permission:create`, `permission:read`, `permission:update`, `permission:delete`

#### Business Logic Permissions
- `employee:read`, `employee:update`
- `payroll:create`, `payroll:read`, `payroll:update`, `payroll:approve`
- `leave:create`, `leave:read`, `leave:approve`, `leave:reject`
- `attendance:create`, `attendance:read`, `attendance:update`

#### Page Permissions
- `page:dashboard`, `page:users`, `page:roles`, `page:reports`
- `page:settings`, `page:payroll`, `page:attendance`, `page:leave`

### Using Permissions in Code

```typescript
import { requirePermission, requireRole, requireAllPermissions } from './middlewares/permission.middleware';

// Require any one permission
router.get('/data', protect, requirePermission('data:read'), controller.getData);

// Require all permissions
router.post('/sensitive', protect, requireAllPermissions('data:create', 'data:sensitive'), controller.create);

// Require specific role
router.get('/admin', protect, requireRole('admin'), controller.adminOnly);
```

## Swagger/API Documentation

### Interactive Documentation
Visit `http://localhost:3000/api-docs` for:
- Interactive API testing
- Request/response examples
- Schema definitions
- Authentication testing

### Features
- Complete OpenAPI 3.0 specification
- Try out endpoints directly in the browser
- JWT authentication support
- Organized by tags (Authentication, Users, Roles, Permissions)
- Export as JSON for client SDK generation

### Quick Test with Swagger
1. Open `http://localhost:3000/api-docs`
2. Find POST `/api/users/login` under "Authentication"
3. Click "Try it out" and login with admin credentials
4. Copy the token from the response
5. Click "Authorize" button and paste the token
6. Now you can test any protected endpoint!

See [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) for detailed Swagger documentation.

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Database connections (MySQL, MongoDB, Redis)
│   ├── index.ts      # Environment configuration
│   └── swagger.ts    # Swagger/OpenAPI configuration
├── controllers/      # Request handlers
│   ├── user.controller.ts
│   ├── role.controller.ts
│   ├── permission.controller.ts
│   └── health.controller.ts
├── dtos/            # Data Transfer Objects
│   ├── user.dto.ts
│   ├── role.dto.ts
│   └── permission.dto.ts
├── integrations/    # External services
│   ├── aws-sqs.ts
│   └── communication.ts
├── middlewares/     # Express middlewares
│   ├── auth.middleware.ts
│   ├── permission.middleware.ts
│   └── error.middleware.ts
├── models/          # Database entities
│   ├── User.ts
│   ├── Role.ts
│   └── Permission.ts
├── routes/          # API routes
│   ├── user.routes.ts
│   ├── role.routes.ts
│   └── permission.routes.ts
├── scripts/         # Utility scripts
│   └── seed.ts      # Database seeding
├── services/        # Business logic
│   ├── user.service.ts
│   ├── role.service.ts
│   └── permission.service.ts
├── utils/           # Utilities
│   ├── logger.ts
│   └── aop.ts
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Scripts

### Development

```bash
npm run dev          # Start with hot reload (nodemon)
npm run pm2:start:dev # Start with PM2 in watch mode
```

### Production

```bash
npm run build        # Compile TypeScript
npm start            # Run compiled code directly
npm run pm2:start    # Start with PM2 (production)
npm run pm2:reload   # Zero-downtime reload
npm run pm2:restart  # Restart application
npm run pm2:stop     # Stop application
npm run pm2:delete   # Remove from PM2 list
```

### PM2 Process Management

```bash
# Monitoring
npm run pm2:logs     # View real-time logs
npm run pm2:monit    # Process monitoring dashboard
npm run pm2:status   # Check application status

# Persistence
npm run pm2:save     # Save process list
npm run pm2:startup  # Generate startup script

# Deployment
npm run deploy:production  # Deploy to production
npm run deploy:staging     # Deploy to staging
```

### Database

```bash
npm run seed         # Seed database with default data
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

See [PM2_GUIDE.md](./PM2_GUIDE.md) for detailed PM2 usage and configuration.

## Production Deployment with PM2

### Quick Production Setup

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start with PM2**:
   ```bash
   npm run pm2:start
   ```

3. **Save PM2 process list**:
   ```bash
   npm run pm2:save
   ```

4. **Setup auto-start on reboot**:
   ```bash
   npm run pm2:startup
   # Follow the instructions printed by PM2
   ```

### Zero-Downtime Deployment

When deploying updates:

```bash
# Build new version
npm run build

# Reload with zero downtime (recommended)
npm run pm2:reload

# OR restart with brief downtime
npm run pm2:restart
```

### Key PM2 Features

- **Cluster Mode** - Utilizes all CPU cores for maximum performance
- **Auto Restart** - Automatically restarts on crashes
- **Zero-Downtime Reload** - Deploy updates without downtime
- **Log Management** - Centralized logging in `logs/` directory
- **Process Monitoring** - Real-time monitoring with `npm run pm2:monit`
- **Memory Management** - Auto-restart if memory exceeds 500MB

### Monitoring

```bash
# View real-time logs
npm run pm2:logs

# Check application status
npm run pm2:status

# Open monitoring dashboard
npm run pm2:monit
```

## Security Features

1. **Password Hashing** - bcrypt with 12 salt rounds
2. **JWT Authentication** - Secure token-based auth
3. **Helmet** - Security headers
4. **CORS** - Cross-origin resource sharing
5. **Permission Guards** - Granular access control
6. **Active Status** - Deactivate users without deletion

## Admin Panel Integration

The permission system is designed for easy admin panel integration:

1. **Fetch Available Permissions**: `GET /api/permissions`
2. **Create Custom Roles**: Assign any combination of permissions
3. **Assign Roles to Users**: Update user's `roleId`
4. **Dynamic UI**: Use `GET /api/users/me/permissions` to show/hide UI elements

### Frontend Example

```javascript
// Get user permissions on login
const { data } = await api.get('/api/users/me/permissions');
const permissions = data.data.permissions;

// Check if user can access a page
const canAccessUsers = permissions.includes('page:users');

// Check if user can perform an action
const canCreateUser = permissions.includes('user:create');

// Show/hide UI elements
{canCreateUser && <CreateUserButton />}
```

## Error Handling

All endpoints return consistent error format:

```json
{
  "status": "error",
  "message": "Error description",
  "statusCode": 400
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Documentation Files

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Detailed API endpoint documentation
- **[SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)** - Complete Swagger usage guide
- **[PM2_GUIDE.md](./PM2_GUIDE.md)** - PM2 process management guide
- **README.md** (this file) - Project overview and setup

## License

MIT

## Changelog

### Version 1.0.0
- Initial release
- User management with RBAC
- Role and permission management
- JWT authentication
- Complete Swagger documentation
- PM2 process management with clustering
- Seed script for initial setup
- 4 default roles (admin, hr_manager, finance, employee)
- 30+ predefined permissions
- Zero-downtime deployment support
- Production-ready ecosystem configuration
