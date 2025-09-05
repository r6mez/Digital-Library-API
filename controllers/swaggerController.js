const { swaggerSpec } = require("../config/swagger");
const { INTERNAL_SERVER_ERROR } = require("../constants/httpStatusCodes");

/**
 * Middleware to fix MIME types for Swagger UI assets
 * Ensures CSS and JS files are served with correct Content-Type headers
 */
const fixSwaggerMimeTypes = (req, res, next) => {
  // Set MIME types based on URL patterns - simplified for Vercel compatibility
  const url = req.url || "";
  const path = req.path || "";

  if (url.includes(".css") || path.includes(".css")) {
    res.setHeader("Content-Type", "text/css");
  } else if (url.includes(".js") || path.includes(".js")) {
    res.setHeader("Content-Type", "application/javascript");
  }

  next();
};

/**
 * Setup Swagger UI middleware and routes
 * @param {Express} app - Express application instance
 */
const setupSwaggerUI = (app) => {
  // Serve custom HTML for Swagger UI with embedded spec
  app.get("/api-docs", (req, res) => {
    try {
      // Debug the swagger spec
      console.log("Swagger spec paths:", Object.keys(swaggerSpec.paths || {}));
      console.log("Swagger spec info:", swaggerSpec.info);

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
            .loading { text-align: center; padding: 50px; font-family: Arial, sans-serif; }
            .debug { background: #f5f5f5; padding: 20px; margin: 20px; border-radius: 5px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div id="swagger-ui">
            <div class="loading">Loading API Documentation...</div>
          </div>
          
          <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js" charset="UTF-8"></script>
          <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
          <script>
            window.onload = function() {
              try {
                const spec = ${JSON.stringify(swaggerSpec)};
                console.log('Loaded spec:', spec);
                console.log('Spec paths:', spec.paths);
                
                const ui = SwaggerUIBundle({
                  spec: spec,
                  dom_id: '#swagger-ui',
                  deepLinking: true,
                  presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                  ],
                  plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                  ],
                  layout: "StandaloneLayout",
                  validatorUrl: null,
                  docExpansion: "list",
                  operationsSorter: "alpha",
                  tagsSorter: "alpha"
                });
              } catch (error) {
                console.error('Error initializing Swagger UI:', error);
                document.getElementById('swagger-ui').innerHTML = 
                  '<div class="loading">Error loading API documentation: ' + error.message + '</div>';
              }
            };
            
            // Fallback error handling
            window.addEventListener('error', function(e) {
              console.error('Page error:', e);
              const container = document.getElementById('swagger-ui');
              if (container && container.innerHTML.includes('Loading')) {
                container.innerHTML = '<div class="loading">Error loading API documentation. Please check the console for details.</div>';
              }
            });
          </script>
        </body>
        </html>
      `;

      res.setHeader("Content-Type", "text/html");
      res.send(customHtml);
    } catch (error) {
      console.error("Error serving Swagger UI:", error);
      res.status(INTERNAL_SERVER_ERROR).send("Error loading API documentation");
    }
  });
};

/**
 * Get Swagger specification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSwaggerSpec = (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    res.json(swaggerSpec);
  } catch (error) {
    console.error("Error serving Swagger spec:", error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to load API specification" });
  }
};

module.exports = {
  setupSwaggerUI,
  fixSwaggerMimeTypes,
  getSwaggerSpec,
};
