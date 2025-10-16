import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RBAC API Documentation',
      version: '1.0.0',
      description:
        'Open Source Hackathon (Opcode) project — Role-Based Access Control (RBAC) backend API documentation.\n\n' +
        'This documentation provides details of all available API endpoints, authentication methods, and data models used in the RBAC system.',
      contact: {
        name: 'Mukesh Dhadhariya',
        email: 'mukeshdhadhariya1@gmail.com'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL ?? 'http://localhost:5000',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },

  // Paths to files containing OpenAPI annotations (JSDoc)
  apis: [
    path.join(process.cwd(), 'src/routes/**/*.js'),
    path.join(process.cwd(), 'src/controllers/**/*.js')
  ],

  // Throw errors if Swagger spec generation fails
  failOnErrors: true
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
