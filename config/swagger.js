const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation with Swagger",
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
      { name: 'Books', description: 'Book endpoints' },
      { name: 'Offers', description: 'Offers endpoints' }
    ],
    servers: [
      { url: "http://localhost:5001" },
    ],
  },
  apis: ['./docs/*.js', "./routes/*.js", "./controllers/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
