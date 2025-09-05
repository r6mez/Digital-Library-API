/**
 * HTTP Status Code Constants
 * Centralized constants for HTTP status codes used throughout the application
 */

// Success Status Codes (2xx)
const SUCCESS = 200;
const CREATED = 201;
const NO_CONTENT = 204;

// Client Error Status Codes (4xx)
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const GONE = 410;

// Server Error Status Codes (5xx)
const INTERNAL_SERVER_ERROR = 500;

module.exports = {
  // Success
  SUCCESS,
  CREATED,
  NO_CONTENT,
  
  // Client Errors
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  GONE,
  
  // Server Errors
  INTERNAL_SERVER_ERROR
};
