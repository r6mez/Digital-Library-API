const { swaggerUi, swaggerSpec, swaggerUiOptions } = require("../config/swagger");

/**
 * Middleware to fix MIME types for Swagger UI assets
 * Ensures CSS and JS files are served with correct Content-Type headers
 */
const fixSwaggerMimeTypes = (req, res, next) => {
  // Set MIME types based on URL patterns - simplified for Vercel compatibility
  const url = req.url || '';
  const path = req.path || '';
  
  if (url.includes('.css') || path.includes('.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (url.includes('.js') || path.includes('.js')) {
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
  
  // Setup Swagger UI with CDN assets for better Vercel compatibility
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    ...swaggerUiOptions,
    customJs: [
      'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js'
    ],
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css'
  }));
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
