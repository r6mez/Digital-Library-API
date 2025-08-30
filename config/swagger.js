const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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
      { name: 'Offers', description: 'Offers endpoints' }
    ],
    servers: [
      { url: "http://localhost:5001" },
    ],
  },
  apis: [
    "./docs/controllersDocs/*.js",
    "./docs/modelsDocs/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
