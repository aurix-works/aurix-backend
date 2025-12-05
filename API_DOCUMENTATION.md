# User Management API Documentation

## Overview

This API provides a comprehensive role-based access control (RBAC) system with flexible permission management for pages and actions.

## Database Schema

### Tables Created

1. **users** - Stores user information
2. **roles** - Stores role definitions (admin, employee, hr_manager, finance)
3. **permissions** - Stores permission definitions for pages and actions
4. **role_permissions** - Junction table linking roles to permissions

## Default Roles

The system comes with 4 pre-configured roles:

### 1. Admin
- **Full system access** with all permissions
- Can manage users, roles, and permissions

### 2. HR Manager
- User management (create, read, update)
- Employee management
- Leave approval/rejection
- Attendance management
- Access to: Dashboard, Users, Leave, Attendance, Reports pages

### 3. Finance
- Payroll management (create, read, update, approve)
- Employee information (read-only)
- Attendance records (read-only)
- Access to: Dashboard, Payroll, Reports, Attendance pages

### 4. Employee
- Own employee information
- Create and view leave requests
- Mark and view own attendance
- Access to: Dashboard, Leave, Attendance pages

## API Endpoints

### Authentication

#### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin@123"
}

Response:
{
  "status": "success",
  "data": {
    "user": { ...user object with role and permissions... },
    "token": "jwt-token-here"
  }
}
```

### User Management

#### Create User
```
POST /api/users
Authorization: Bearer {token}
Permission Required: user:create

{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "roleId": "uuid-of-role"
}
```

#### Get All Users
```
GET /api/users?page=1&limit=10&roleId=optional-role-filter
Authorization: Bearer {token}
Permission Required: user:read
```

#### Get User by ID
```
GET /api/users/:id
Authorization: Bearer {token}
Permission Required: user:read
```

#### Update User
```
PUT /api/users/:id
Authorization: Bearer {token}
Permission Required: user:update

{
  "firstName": "Updated Name",
  "roleId": "new-role-id",
  "isActive": true
}
```

#### Delete User
```
DELETE /api/users/:id
Authorization: Bearer {token}
Permission Required: user:delete
```

#### Get My Permissions
```
GET /api/users/me/permissions
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "data": {
    "permissions": ["user:read", "page:dashboard", ...]
  }
}
```

### Role Management

#### Create Role
```
POST /api/roles
Authorization: Bearer {token}
Permission Required: role:create

{
  "name": "custom_role",
  "description": "Custom role description",
  "permissionIds": ["uuid1", "uuid2", ...]
}
```

#### Get All Roles
```
GET /api/roles
Authorization: Bearer {token}
Permission Required: role:read
```

#### Get Role by ID
```
GET /api/roles/:id
Authorization: Bearer {token}
Permission Required: role:read
```

#### Update Role
```
PUT /api/roles/:id
Authorization: Bearer {token}
Permission Required: role:update

{
  "name": "updated_name",
  "description": "Updated description",
  "permissionIds": ["new-list-of-permission-ids"],
  "isActive": true
}
```

#### Delete Role
```
DELETE /api/roles/:id
Authorization: Bearer {token}
Permission Required: role:delete
```

### Permission Management

#### Create Permission
```
POST /api/permissions
Authorization: Bearer {token}
Permission Required: permission:create

{
  "name": "custom:action",
  "resource": "custom_resource",
  "type": "action",
  "description": "Custom permission description"
}
```

Permission types: `"page"` or `"action"`

#### Get All Permissions
```
GET /api/permissions
Authorization: Bearer {token}
Permission Required: permission:read
```

#### Get Permission by ID
```
GET /api/permissions/:id
Authorization: Bearer {token}
Permission Required: permission:read
```

#### Update Permission
```
PUT /api/permissions/:id
Authorization: Bearer {token}
Permission Required: permission:update

{
  "name": "updated:name",
  "isActive": true
}
```

#### Delete Permission
```
DELETE /api/permissions/:id
Authorization: Bearer {token}
Permission Required: permission:delete
```

## Permission System

### Permission Naming Convention

- **Actions**: `resource:action` (e.g., `user:create`, `payroll:approve`)
- **Pages**: `page:resource` (e.g., `page:dashboard`, `page:users`)

### Available Permissions

#### User Permissions
- `user:create` - Create new users
- `user:read` - View users
- `user:update` - Update users
- `user:delete` - Delete users

#### Role Permissions
- `role:create` - Create new roles
- `role:read` - View roles
- `role:update` - Update roles
- `role:delete` - Delete roles

#### Permission Permissions
- `permission:create` - Create new permissions
- `permission:read` - View permissions
- `permission:update` - Update permissions
- `permission:delete` - Delete permissions

#### Employee Permissions
- `employee:read` - View employee details
- `employee:update` - Update employee details

#### Payroll Permissions
- `payroll:create` - Create payroll
- `payroll:read` - View payroll
- `payroll:update` - Update payroll
- `payroll:approve` - Approve payroll

#### Leave Permissions
- `leave:create` - Create leave request
- `leave:read` - View leave requests
- `leave:approve` - Approve leave requests
- `leave:reject` - Reject leave requests

#### Attendance Permissions
- `attendance:create` - Mark attendance
- `attendance:read` - View attendance
- `attendance:update` - Update attendance

#### Page Permissions
- `page:dashboard` - Access dashboard page
- `page:users` - Access users page
- `page:roles` - Access roles page
- `page:reports` - Access reports page
- `page:settings` - Access settings page
- `page:payroll` - Access payroll page
- `page:attendance` - Access attendance page
- `page:leave` - Access leave management page

## Using Permission Middleware

### In Your Routes

```typescript
import { requirePermission, requireRole, requireAllPermissions } from '../middlewares/permission.middleware';

// Require any ONE of the specified permissions
router.get('/data', protect, requirePermission('data:read', 'admin:all'), controller.getData);

// Require ALL specified permissions
router.post('/sensitive', protect, requireAllPermissions('data:create', 'data:sensitive'), controller.create);

// Require specific role
router.get('/admin-only', protect, requireRole('admin'), controller.adminOnly);
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
Create a `.env` file with your database configuration:
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=enterprise_db

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d
```

### 3. Run Database Seed
This will create all permissions, roles, and a default admin user:
```bash
npm run seed
```

Default admin credentials:
- Email: `admin@example.com`
- Password: `Admin@123`

### 4. Start the Server
```bash
npm run dev
```

## Admin Panel Integration

The permission system is designed to be easily integrated with an admin panel:

1. **Fetch Available Permissions**: `GET /api/permissions`
2. **Create Custom Roles**: Assign any combination of permissions to roles
3. **Assign Roles to Users**: Update user's `roleId` to change their permissions
4. **Dynamic UI**: Use the `GET /api/users/me/permissions` endpoint to show/hide UI elements based on user permissions

### Frontend Permission Checking

```javascript
// Get user permissions on login
const { data } = await api.get('/api/users/me/permissions');
const userPermissions = data.data.permissions;

// Check if user can access a page
const canAccessUsers = userPermissions.includes('page:users');

// Check if user can perform an action
const canCreateUser = userPermissions.includes('user:create');
```

## Error Responses

All endpoints return errors in this format:
```json
{
  "status": "error",
  "message": "Error description",
  "statusCode": 400
}
```

Common status codes:
- 400: Bad Request
- 401: Unauthorized (not logged in)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
2. **JWT Authentication**: Secure token-based authentication
3. **Permission-based Access Control**: Granular control over actions and pages
4. **Role-based Assignment**: Easy management through roles
5. **Active Status**: Users and permissions can be deactivated without deletion
