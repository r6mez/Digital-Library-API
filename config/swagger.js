const swaggerUi = require("swagger-ui-express");
const resolveBaseUrl = require('../utils/resolveBaseUrl');
const swaggerPaths = require('./swaggerPaths');
const swaggerSchemas = require('./swaggerSchemas');

// Create the swagger spec directly without relying on file parsing
const swaggerSpec = {
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
    },
    schemas: swaggerSchemas
  },
  tags: [
    { name: 'Auth', description: 'Authentication routes' },
    { name: 'Users', description: 'User management and profile' },
    { name: 'Types', description: 'Book types management' },
    { name: 'Categories', description: 'Book categories management' },
    { name: 'Authors', description: 'Authors management' },
    { name: 'Books', description: 'Book endpoints' },
    { name: 'Subscriptions', description: 'Subscription management and activation' },
    { name: 'Offers', description: 'Offers endpoints' },
    { name: 'Statistics', description: 'Analytics and library insights' }
  ],
  servers: [
    { url: resolveBaseUrl() },
  ],
  paths: swaggerPaths
};

// Debug the generated spec
console.log('Generated swagger spec paths:', Object.keys(swaggerSpec.paths || {}));
console.log('Available paths count:', Object.keys(swaggerSpec.paths || {}).length);

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
