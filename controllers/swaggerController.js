const { swaggerUi, swaggerSpec, swaggerUiOptions } = require("../config/swagger");

/**
 * Middleware to fix MIME types for Swagger UI assets
 * Ensures CSS and JS files are served with correct Content-Type headers
 */
const fixSwaggerMimeTypes = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;
  
  // Override res.send to set correct MIME types
  res.send = function(data) {
    if (req.url.includes('swagger-ui') || req.path.includes('swagger-ui')) {
      if (req.url.endsWith('.css') || req.path.endsWith('.css') || req.url.includes('swagger-ui.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (req.url.endsWith('.js') || req.path.endsWith('.js') || 
                 req.url.includes('swagger-ui-bundle.js') || 
                 req.url.includes('swagger-ui-standalone-preset.js') ||
                 req.url.includes('swagger-ui-init.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
    return originalSend.call(this, data);
  };
  
  // Set MIME types based on URL patterns
  if (req.url.endsWith('.css') || req.path.endsWith('.css') || req.url.includes('swagger-ui.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (req.url.endsWith('.js') || req.path.endsWith('.js') || 
             req.url.includes('swagger-ui-bundle.js') || 
             req.url.includes('swagger-ui-standalone-preset.js') ||
             req.url.includes('swagger-ui-init.js')) {
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
  
  // More explicit Swagger UI setup for better Vercel compatibility
  app.get('/api-docs', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    next();
  }, swaggerUi.serve[0], swaggerUi.setup(swaggerSpec, {
    ...swaggerUiOptions,
    customJs: [
      'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js'
    ],
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css'
  }));
  
  // Fallback route for assets
  app.use('/api-docs/*', (req, res, next) => {
    if (req.url.includes('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (req.url.includes('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    next();
  }, swaggerUi.serve);
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
