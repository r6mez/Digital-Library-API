const { swaggerUi, swaggerSpec, swaggerUiOptions } = require("../config/swagger");

/**
 * Middleware to fix MIME types for Swagger UI assets
 * Ensures CSS and JS files are served with correct Content-Type headers
 */
const fixSwaggerMimeTypes = (req, res, next) => {
  if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
};

/**
 * Setup Swagger UI middleware and routes
 * @param {Express} app - Express application instance
 */
const setupSwaggerUI = (app) => {
  // Apply MIME type fix middleware for Swagger UI assets
  app.use('/api-docs', fixSwaggerMimeTypes);
  
  // Setup Swagger UI with custom options
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
};

/**
 * Get Swagger specification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSwaggerSpec = (req, res) => {
  res.json(swaggerSpec);
};

module.exports = {
  setupSwaggerUI,
  fixSwaggerMimeTypes,
  getSwaggerSpec
};
