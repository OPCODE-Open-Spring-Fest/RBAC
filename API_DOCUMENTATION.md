# 🔐 RBAC API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user in the system.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "fullname": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email",
    "role": "User"
  }
}
```

### POST /api/auth/login
Authenticate user and return access and refresh tokens.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email",
    "fullname": "fullname",
    "role": "User"
  }
}
```

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "accessToken": "new_jwt_access_token",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email",
    "fullname": "fullname",
    "role": "User"
  }
}
```

### POST /api/auth/logout
Logout user and invalidate refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Role Management Endpoints

### GET /api/roles
Get all roles (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "_id": "role_id",
    "name": "Admin",
    "permissions": [
      {
        "_id": "permission_id",
        "name": "Manage Users",
        "description": "Admin can manage users"
      }
    ]
  }
]
```

### POST /api/roles
Create a new role (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "string",
  "permissions": ["permission_id_1", "permission_id_2"]
}
```

## Permission Management Endpoints

### GET /api/permissions
Get all permissions (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

### POST /api/permissions
Create a new permission (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

## RBAC Test Endpoints

### GET /api/rbac-test/admin-only
Test endpoint for Admin role only.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Welcome, Admin"
}
```

### GET /api/rbac-test/user-only
Test endpoint for User role only.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Welcome, User"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **JWT Access Tokens**: Short-lived (1 day) for API access
- **Refresh Tokens**: Long-lived (7 days) for token renewal
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access Control**: Granular permissions
- **Token Invalidation**: Secure logout mechanism
