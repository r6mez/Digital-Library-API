const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require('path');
const resolveBaseUrl = require('../utils/resolveBaseUrl');

const options = {
  definition: {
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
  },
  apis: [
    path.resolve(__dirname, "../docs/controllersDocs/*.js"),
    path.resolve(__dirname, "../docs/modelsDocs/*.js"),
    // Also try absolute paths for Vercel
    "./docs/controllersDocs/*.js",
    "./docs/modelsDocs/*.js"
  ],
};

const swaggerSpec = swaggerJsdoc(options);

// Debug the generated spec
console.log('Generated swagger spec paths:', Object.keys(swaggerSpec.paths || {}));
console.log('Available paths count:', Object.keys(swaggerSpec.paths || {}).length);

// If no paths are found, it might be a file loading issue
if (!swaggerSpec.paths || Object.keys(swaggerSpec.paths).length === 0) {
  console.warn('Warning: No API paths found in swagger spec. This might be due to file loading issues in serverless environment.');
}

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
