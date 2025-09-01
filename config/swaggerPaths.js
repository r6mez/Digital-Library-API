// Inline Swagger documentation paths for Vercel compatibility
const swaggerPaths = {
  // Auth routes
  "/auth/register": {
    "post": {
      "summary": "Register a new user",
      "tags": ["Auth"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": ["name", "email", "password"],
              "properties": {
                "name": { "type": "string" },
                "email": { "type": "string", "format": "email" },
                "password": { "type": "string", "minLength": 6 }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "User registered successfully",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": { "type": "string" },
                  "user": { "$ref": "#/components/schemas/User" },
                  "token": { "type": "string" }
                }
              }
            }
          }
        },
        "400": { "description": "Bad Request (validation or user exists)" },
        "500": { "description": "Server error" }
      }
    }
  },
  "/auth/login": {
    "post": {
      "summary": "Login a user and receive a JWT token",
      "tags": ["Auth"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": ["email", "password"],
              "properties": {
                "email": { "type": "string", "format": "email" },
                "password": { "type": "string" }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Successful authentication",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": { "type": "string" },
                  "user": { "$ref": "#/components/schemas/User" },
                  "token": { "type": "string" }
                }
              }
            }
          }
        },
        "401": { "description": "Invalid credentials" },
        "400": { "description": "Bad request (validation failed)" },
        "500": { "description": "Server error" }
      }
    }
  },
  "/auth/verify-email": {
    "post": {
      "summary": "Verify user email with token",
      "tags": ["Auth"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": ["token"],
              "properties": {
                "token": { "type": "string", "description": "Email verification token" }
              }
            }
          }
        }
      },
      "responses": {
        "200": { "description": "Email verified successfully" },
        "400": { "description": "Invalid or expired verification token" },
        "500": { "description": "Server error" }
      }
    }
  },
  // Users routes
  "/users/me": {
    "get": {
      "summary": "Get the current signed-in user's profile",
      "tags": ["Users"],
      "security": [{ "bearerAuth": [] }],
      "responses": {
        "200": {
          "description": "User profile",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/User" }
            }
          }
        },
        "401": { "description": "Unauthorized" }
      }
    }
  },
  "/users/me/update-profile": {
    "put": {
      "summary": "Update authenticated user's profile",
      "tags": ["Users"],
      "security": [{ "bearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "minProperties": 1,
              "properties": {
                "name": { "type": "string", "minLength": 3 },
                "password": { "type": "string", "minLength": 6 },
                "currentPassword": { "type": "string" }
              }
            }
          }
        }
      },
      "responses": {
        "200": { "description": "Profile updated successfully" },
        "400": { "description": "Bad request" },
        "401": { "description": "Unauthorized" },
        "500": { "description": "Server error" }
      }
    }
  },
  // Books routes (sample)
  "/books": {
    "get": {
      "summary": "Get all books with pagination and filtering",
      "tags": ["Books"],
      "parameters": [
        {
          "name": "page",
          "in": "query",
          "schema": { "type": "integer", "minimum": 1, "default": 1 }
        },
        {
          "name": "limit",
          "in": "query",
          "schema": { "type": "integer", "minimum": 1, "maximum": 100, "default": 10 }
        },
        {
          "name": "search",
          "in": "query",
          "schema": { "type": "string" }
        }
      ],
      "responses": {
        "200": {
          "description": "List of books",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "books": {
                    "type": "array",
                    "items": { "$ref": "#/components/schemas/Book" }
                  },
                  "totalBooks": { "type": "integer" },
                  "totalPages": { "type": "integer" },
                  "currentPage": { "type": "integer" }
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerPaths;
