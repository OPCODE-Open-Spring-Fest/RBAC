import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RBAC API Documentation',
      version: '1.0.0',
      description:
        'Role-Based Access Control (RBAC) API with JWT authentication. This API provides endpoints for user authentication, role management, permission management, and access control.',
      contact: {
        name: 'API Support',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
          description: 'Refresh token stored in HTTP-only cookie',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ID',
            },
            username: {
              type: 'string',
              description: 'Unique username',
              minLength: 3,
              maxLength: 30,
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Unique email address',
            },
            password: {
              type: 'string',
              description: 'Hashed password',
              minLength: 6,
            },
            role: {
              type: 'string',
              description: 'Reference to Role model',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token',
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
        Role: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ID',
            },
            name: {
              type: 'string',
              description: 'Unique role name',
              enum: ['Admin', 'User', 'Moderator'],
            },
            description: {
              type: 'string',
              description: 'Role description',
            },
            permissions: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Array of permission IDs associated with this role',
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
        Permission: {
          type: 'object',
          required: ['name', 'resource', 'action'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ID',
            },
            name: {
              type: 'string',
              description: 'Unique permission name',
            },
            resource: {
              type: 'string',
              description: 'Resource this permission applies to',
            },
            action: {
              type: 'string',
              description: 'Action allowed on the resource',
            },
            description: {
              type: 'string',
              description: 'Permission description',
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
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
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
        name: 'RBAC Tests',
        description: 'Protected endpoints to test role-based access control',
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js',
  ],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
