# API Documentation

## Authentication
**Base URL:** `/api/auth`

### Login
- **Endpoint:** `POST /login`
- **Description:** Authenticate a User and retrieve a JWT token.
- **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "Admin@123"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "name": "System Admin",
      "isSystemAdmin": true
    }
  }
  ```

---

## System Services
**Base URL:** `/api/services`
**Headers:** `Authorization: Bearer <token>`

### Get All Services
- **Endpoint:** `GET /`
- **Description:** Retrieve a list of all system services.
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "services": [
        {
          "id": 1,
          "name": "User Management",
          "code": "USER_MGMT",
          "description": "Manage users and roles"
        }
      ]
    }
  }
  ```

### Create Service
- **Endpoint:** `POST /`
- **Description:** Create a new system service.
- **Request Body:**
  ```json
  {
    "name": "New Service",
    "code": "NEW_SVC",
    "description": "Description of the service"
  }
  ```

### Update Service
- **Endpoint:** `PUT /:id`
- **Description:** Update an existing service.
- **Request Body:**
  ```json
  {
    "name": "Updated Service Name"
  }
  ```

### Delete Service
- **Endpoint:** `DELETE /:id`
- **Description:** Delete a service.

---

## Plans
**Base URL:** `/api/plans`
**Headers:** `Authorization: Bearer <token>`

### Get All Plans
- **Endpoint:** `GET /`
- **Description:** Retrieve all subscription plans.

### Create Plan
- **Endpoint:** `POST /`
- **Description:** Create a new plan and link it to services.
- **Request Body:**
  ```json
  {
    "name": "Pro Plan",
    "code": "PRO_PLAN",
    "priceMonthly": 29.99,
    "priceYearly": 299.99,
    "serviceIds": [1, 2]
  }
  ```

### Update Plan
- **Endpoint:** `PUT /:id`
- **Description:** Update a plan.

### Delete Plan
- **Endpoint:** `DELETE /:id`
- **Description:** Delete a plan.

---

## Organizations
**Base URL:** `/api/organizations`
**Headers:** `Authorization: Bearer <token>`

### Get All Organizations
- **Endpoint:** `GET /`
- **Description:** Retrieve all organizations.

### Create Organization
- **Endpoint:** `POST /`
- **Description:** Create a new organization.
- **Request Body:**
  ```json
  {
    "name": "Acme Corp",
    "domain": "acme.com"
  }
  ```

### Update Organization
- **Endpoint:** `PUT /:id`
- **Description:** Update an organization.

### Delete Organization
- **Endpoint:** `DELETE /:id`
- **Description:** Delete an organization.

---

## Sub-Organizations
**Base URL:** `/api/sub-organizations`
**Headers:** `Authorization: Bearer <token>`

### Get All Sub-Organizations
- **Endpoint:** `GET /`
- **Description:** Retrieve all sub-organizations.

### Create Sub-Organization
- **Endpoint:** `POST /`
- **Description:** Create a new sub-organization under a parent organization.
- **Request Body:**
  ```json
  {
    "organizationId": 1,
    "name": "Acme HQ",
    "contactEmail": "contact@acme.com",
    "taxId": "US123456",
    "billingAddress": "123 Main St"
  }
  ```

### Update Sub-Organization
- **Endpoint:** `PUT /:id`
- **Description:** Update a sub-organization.

### Delete Sub-Organization
- **Endpoint:** `DELETE /:id`
- **Description:** Delete a sub-organization.

---

## Sub-Organization Subscriptions
**Base URL:** `/api/subscriptions`
**Headers:** `Authorization: Bearer <token>`

### Get All Subscriptions
- **Endpoint:** `GET /`
- **Description:** Retrieve all subscriptions.

### Create Subscription
- **Endpoint:** `POST /`
- **Description:** Subscribe a sub-organization to a plan.
- **Request Body:**
  ```json
  {
    "subOrganizationId": 1,
    "planId": 1,
    "startDate": "2024-01-01",
    "nextBillingDate": "2024-02-01",
    "status": "active"
  }
  ```

### Update Subscription
- **Endpoint:** `PUT /:id`
- **Description:** Update a subscription (e.g., change plan or status).

### Delete Subscription
- **Endpoint:** `DELETE /:id`
- **Description:** Cancel/Delete a subscription.

---

## Departments
**Base URL:** `/api/departments`
**Headers:** `Authorization: Bearer <token>`

### Get All Departments
- **Endpoint:** `GET /`
- **Description:** Retrieve all departments.

### Create Department
- **Endpoint:** `POST /`
- **Description:** Create a new department.

### Update Department
- **Endpoint:** `PUT /:id`
- **Description:** Update a department.

### Delete Department
- **Endpoint:** `DELETE /:id`
- **Description:** Delete a department.

---

## Users (Tenant)
**Base URL:** `/api/users`
**Headers:** `Authorization: Bearer <token>`

### Get All Users
- **Endpoint:** `GET /`
- **Description:** Retrieve all tenant users.

### Create User
- **Endpoint:** `POST /`
- **Description:** Create a new tenant user.

### Update User
- **Endpoint:** `PUT /:id`
- **Description:** Update a tenant user.

### Delete User
- **Endpoint:** `DELETE /:id`
- **Description:** Delete a tenant user.

---

## Roles
**Base URL:** `/api/roles`
**Headers:** `Authorization: Bearer <token>`

### Get All Roles
- **Endpoint:** `GET /`
- **Description:** Retrieve all roles.

### Create Role
- **Endpoint:** `POST /`
- **Description:** Create a new role.

### Update Role
- **Endpoint:** `PUT /:id`
- **Description:** Update a role.

### Delete Role
- **Endpoint:** `DELETE /:id`
- **Description:** Delete a role.

---

## Permissions
**Base URL:** `/api/permissions`
**Headers:** `Authorization: Bearer <token>`

### Get All Permissions
- **Endpoint:** `GET /`
- **Description:** Retrieve all permissions.

### Create Permission
- **Endpoint:** `POST /`
- **Description:** Create a new permission.

### Update Permission
- **Endpoint:** `PUT /:id`
- **Description:** Update a permission.

### Delete Permission
- **Endpoint:** `DELETE /:id`
- **Description:** Delete a permission.

---

## Leave Management
**Base URL:** `/api/leave`
**Headers:** `Authorization: Bearer <token>`

### Create Leave Type (Admin)
- **Endpoint:** `POST /leave-types`
- **Description:** Create a new leave type.
- **Request Body:**
  ```json
  {
    "name": "Sick Leave",
    "code": "SL",
    "isCarryForward": true
  }
  ```

### Create Workflow (Admin)
- **Endpoint:** `POST /workflows`
- **Description:** Create a new leave workflow.
- **Request Body:**
  ```json
  {
    "name": "Standard Workflow",
    "description": "Manager -> HR",
    "steps": [
      { "stepOrder": 1, "approverRoleId": 2 },
      { "stepOrder": 2, "approverRoleId": 3 }
    ]
  }
  ```

### Get Leave Types (Employee)
- **Endpoint:** `GET /leave-types`
- **Description:** Get all available leave types.

### Apply for Leave (Employee)
- **Endpoint:** `POST /apply`
- **Description:** Submit a leave request.
- **Request Body:**
  ```json
  {
    "leaveTypeId": 1,
    "startDate": "2024-03-01",
    "endDate": "2024-03-03",
    "reason": "Sick leave"
  }
  ```

### Get My Requests (Employee)
- **Endpoint:** `GET /requests`
- **Description:** Get list of my leave requests.

### Get Pending Approvals (Approver)
- **Endpoint:** `GET /approvals`
- **Description:** Get list of requests pending my approval.

### Approve/Reject Request (Approver)
- **Endpoint:** `POST /approve/:requestId`
- **Description:** Approve or reject a leave request.
- **Request Body:**
  ```json
  {
    "status": "approved",
    "comments": "Get well soon"
  }
  ```
