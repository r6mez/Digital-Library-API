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
  // Custom Swagger UI HTML template that bypasses asset serving issues
  const customHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Digital Library API Documentation</title>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
      <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
      <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            url: '/api-docs.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
        };
      </script>
    </body>
    </html>
  `;

  // Serve custom HTML for Swagger UI
  app.get('/api-docs', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(customHtml);
  });
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
