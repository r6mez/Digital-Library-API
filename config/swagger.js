const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");
const resolveBaseUrl = require('../utils/resolveBaseUrl');
const path = require('path');

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Digital Library API",
    version: "1.0.0",
    description: "API documentation for a modern digital library system built with Node.js, Express, and MongoDB. This API powers a complete online library ecosystem with user authentication, book management, subscription-based borrowing, purchasing, special offers, and comprehensive admin controls.",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  servers: [
    { url: resolveBaseUrl() }
  ],
  tags: [
    { name: 'Auth', description: 'Authentication routes' },
    { name: 'Users', description: 'User management and profile' },
    { name: 'Types', description: 'Book types management' },
    { name: 'Categories', description: 'Book categories management' },
    { name: 'Authors', description: 'Authors management' },
    { name: 'Books', description: 'Book endpoints' },
    { name: 'Subscriptions', description: 'Subscription management and activation' },
    { name: 'Offers', description: 'Offers endpoints' },
    { name: 'Statistics', description: 'Analytics and library insights' },
    { name: 'Transactions', description: 'Transaction management' }
  ]
};

// Options for swagger-jsdoc
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    path.join(__dirname, '../docs/controllersDocs/*.js'),
    path.join(__dirname, '../docs/modelsDocs/*.js')
  ]
};

// Generate swagger specification
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Custom Swagger UI options for better Vercel compatibility
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Digital Library API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    tryItOutEnabled: true
  }
};

module.exports = { swaggerUi, swaggerSpec, swaggerUiOptions };
