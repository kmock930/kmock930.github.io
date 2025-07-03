/**
 * Error Handling Utilities for Secure Communication
 * 
 * This module provides utilities for handling errors securely
 * without exposing sensitive information to users.
 */

/**
 * Error types for different scenarios
 */
const ErrorTypes = {
  VALIDATION: 'ValidationError',
  AUTHENTICATION: 'AuthenticationError',
  AUTHORIZATION: 'AuthorizationError',
  NETWORK: 'NetworkError',
  TIMEOUT: 'TimeoutError',
  SERVER: 'ServerError',
  RATE_LIMIT: 'RateLimitError',
  NOT_FOUND: 'NotFoundError'
}

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, type = ErrorTypes.SERVER, statusCode = 500, details = null) {
    super(message)
    this.name = 'ApiError'
    this.type = type
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

/**
 * Secure error handler for API routes
 * @param {Error} error - The error to handle
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const handleApiError = (error, req, res) => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Log the error (in production, this would go to a logging service)
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress
  })

  // Default error response
  let statusCode = 500
  let message = 'Internal server error'
  let details = null

  // Handle different error types
  if (error instanceof ApiError) {
    statusCode = error.statusCode
    message = error.message
    if (isDevelopment) {
      details = error.details
    }
  } else if (error.name === 'ValidationError') {
    statusCode = 400
    message = 'Invalid request data'
    if (isDevelopment) {
      details = error.message
    }
  } else if (error.name === 'UnauthorizedError' || error.message.includes('unauthorized')) {
    statusCode = 401
    message = 'Authentication required'
  } else if (error.name === 'ForbiddenError' || error.message.includes('forbidden')) {
    statusCode = 403
    message = 'Access denied'
  } else if (error.name === 'NotFoundError' || error.message.includes('not found')) {
    statusCode = 404
    message = 'Resource not found'
  } else if (error.name === 'TimeoutError') {
    statusCode = 408
    message = 'Request timeout'
  } else if (error.name === 'RateLimitError') {
    statusCode = 429
    message = 'Too many requests'
  }

  // Send secure error response
  const errorResponse = {
    error: message,
    timestamp: new Date().toISOString(),
    ...(isDevelopment && details && { details })
  }

  res.status(statusCode).json(errorResponse)
}

/**
 * Client-side error handler
 * @param {Error} error - The error to handle
 * @param {Object} context - Additional context
 * @returns {Object} - Formatted error for display
 */
const handleClientError = (error, context = {}) => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Log error in development
  if (isDevelopment) {
    console.error('Client Error:', error, context)
  }

  // Default user-friendly message
  let userMessage = 'An unexpected error occurred. Please try again.'
  let shouldRetry = false

  // Handle specific error types
  if (error instanceof ApiError) {
    switch (error.type) {
      case ErrorTypes.VALIDATION:
        userMessage = 'Please check your input and try again.'
        break
      case ErrorTypes.AUTHENTICATION:
        userMessage = 'Please log in to continue.'
        break
      case ErrorTypes.AUTHORIZATION:
        userMessage = 'You don\'t have permission to perform this action.'
        break
      case ErrorTypes.NETWORK:
        userMessage = 'Network error. Please check your connection.'
        shouldRetry = true
        break
      case ErrorTypes.TIMEOUT:
        userMessage = 'Request timed out. Please try again.'
        shouldRetry = true
        break
      case ErrorTypes.RATE_LIMIT:
        userMessage = 'Too many requests. Please wait a moment and try again.'
        shouldRetry = true
        break
      case ErrorTypes.NOT_FOUND:
        userMessage = 'The requested resource was not found.'
        break
      case ErrorTypes.SERVER:
        userMessage = 'An unexpected error occurred. Please try again.'
        break
      default:
        userMessage = error.message || userMessage
    }
  } else if (error.name === 'AbortError') {
    userMessage = 'Request was cancelled.'
  } else if (error.message.includes('fetch') || error.message.includes('network')) {
    userMessage = 'Network error. Please check your connection.'
    shouldRetry = true
  }

  return {
    message: userMessage,
    shouldRetry,
    originalError: isDevelopment ? error : null,
    context
  }
}

/**
 * Validation error formatter
 * @param {Array} errors - Array of validation errors
 * @returns {Object} - Formatted validation error
 */
const formatValidationErrors = (errors) => {
  if (!Array.isArray(errors)) {
    return { message: 'Validation failed', details: [] }
  }

  const details = errors.map(error => ({
    field: error.field || error.path,
    message: error.message,
    value: error.value
  }))

  return {
    message: 'Please correct the following errors:',
    details
  }
}

/**
 * Network error detector
 * @param {Error} error - Error to check
 * @returns {boolean} - True if it's a network error
 */
const isNetworkError = (error) => {
  return (
    error.name === 'NetworkError' ||
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('timeout') ||
    error.code === 'ECONNREFUSED'
  )
}

/**
 * Async error handler for React components
 * @param {Function} asyncFn - Async function to wrap
 * @param {Function} onError - Error handler function
 * @returns {Function} - Wrapped async function
 */
const withAsyncErrorHandler = (asyncFn, onError) => {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      const handledError = handleClientError(error)
      if (onError) {
        onError(handledError)
      } else {
        console.error('Unhandled async error:', handledError)
      }
      throw error
    }
  }
}

/**
 * Retry mechanism for failed operations
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} - Promise that resolves when successful or max retries reached
 */
const withRetry = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    delay = 1000,
    exponentialBackoff = true,
    shouldRetry = (error) => isNetworkError(error)
  } = options

  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error
      }

      // Wait before retrying
      const waitTime = exponentialBackoff ? delay * Math.pow(2, attempt) : delay
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw lastError
}

module.exports = {
  ErrorTypes,
  ApiError,
  handleApiError,
  handleClientError,
  formatValidationErrors,
  isNetworkError,
  withAsyncErrorHandler,
  withRetry
}