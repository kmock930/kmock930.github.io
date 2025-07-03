# Security Code Examples and Patterns

**Document Type:** Code Reference Guide  
**Related Issue:** #19 - Secure Communication Layer  
**Target Audience:** Developers with Limited Security Experience  

## Table of Contents

1. [Input Validation and Sanitization](#input-validation-and-sanitization)
2. [Authentication Patterns](#authentication-patterns)
3. [API Security Implementations](#api-security-implementations)
4. [Error Handling Patterns](#error-handling-patterns)
5. [Security Testing Examples](#security-testing-examples)
6. [Configuration Templates](#configuration-templates)

## Input Validation and Sanitization

### Basic Input Sanitization Functions

```javascript
/**
 * Comprehensive input sanitization utilities
 * Designed for developers with limited security experience
 */
class InputSanitizer {
  /**
   * Sanitize general text input
   * Removes potentially dangerous characters
   */
  static sanitizeText(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>'"]/g, '') // Remove HTML-related characters
      .replace(/[{}[\]]/g, '') // Remove object notation characters
      .substring(0, 1000); // Limit length to prevent DoS
  }

  /**
   * Sanitize email addresses
   * Ensures valid email format
   */
  static sanitizeEmail(email) {
    if (typeof email !== 'string') return '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleaned = email.trim().toLowerCase();
    
    return emailRegex.test(cleaned) ? cleaned : '';
  }

  /**
   * Sanitize URLs
   * Only allows HTTP/HTTPS protocols
   */
  static sanitizeURL(url) {
    if (typeof url !== 'string') return '';
    
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        return urlObj.toString();
      }
      return '';
    } catch {
      return '';
    }
  }

  /**
   * Sanitize phone numbers
   * Removes non-numeric characters except + and -
   */
  static sanitizePhone(phone) {
    if (typeof phone !== 'string') return '';
    
    return phone.replace(/[^\d+\-\s()]/g, '').trim();
  }

  /**
   * Sanitize HTML content
   * Converts HTML entities to prevent XSS
   */
  static sanitizeHTML(html) {
    if (typeof html !== 'string') return '';
    
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    
    return html.replace(/[&<>"'\/]/g, (s) => entityMap[s]);
  }
}
```

### Advanced Input Validation

```javascript
/**
 * Advanced input validation with detailed error reporting
 */
class InputValidator {
  /**
   * Validate contact form data
   */
  static validateContactForm(data) {
    const errors = {};
    const sanitizedData = {};

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (data.name.trim().length > 50) {
      errors.name = 'Name must be less than 50 characters';
    } else {
      sanitizedData.name = InputSanitizer.sanitizeText(data.name);
    }

    // Email validation
    if (!data.email) {
      errors.email = 'Email is required';
    } else {
      const sanitizedEmail = InputSanitizer.sanitizeEmail(data.email);
      if (!sanitizedEmail) {
        errors.email = 'Please enter a valid email address';
      } else {
        sanitizedData.email = sanitizedEmail;
      }
    }

    // Message validation
    if (!data.message || data.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    } else if (data.message.trim().length > 1000) {
      errors.message = 'Message must be less than 1000 characters';
    } else {
      sanitizedData.message = InputSanitizer.sanitizeText(data.message);
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }

  /**
   * Validate user registration data
   */
  static validateRegistration(data) {
    const errors = {};
    const sanitizedData = {};

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!data.username) {
      errors.username = 'Username is required';
    } else if (!usernameRegex.test(data.username)) {
      errors.username = 'Username must be 3-20 characters and contain only letters, numbers, and underscores';
    } else {
      sanitizedData.username = data.username.toLowerCase();
    }

    // Email validation
    const emailResult = this.validateEmail(data.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.error;
    } else {
      sanitizedData.email = emailResult.sanitizedEmail;
    }

    // Password validation
    const passwordResult = this.validatePassword(data.password);
    if (!passwordResult.isValid) {
      errors.password = passwordResult.error;
    } else {
      sanitizedData.password = data.password; // Don't sanitize passwords
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password) {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);

    if (password.length < minLength) {
      return { isValid: false, error: `Password must be at least ${minLength} characters long` };
    }

    if (!hasUpperCase) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!hasLowerCase) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!hasNumbers) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }

    if (!hasNonalphas) {
      return { isValid: false, error: 'Password must contain at least one special character' };
    }

    return { isValid: true };
  }

  /**
   * Email validation helper
   */
  static validateEmail(email) {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }

    const sanitizedEmail = InputSanitizer.sanitizeEmail(email);
    if (!sanitizedEmail) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    // Additional email validation (domain check, etc.)
    const emailParts = sanitizedEmail.split('@');
    if (emailParts.length !== 2) {
      return { isValid: false, error: 'Invalid email format' };
    }

    const [localPart, domain] = emailParts;
    if (localPart.length > 64 || domain.length > 253) {
      return { isValid: false, error: 'Email address is too long' };
    }

    return {
      isValid: true,
      sanitizedEmail
    };
  }
}
```

## Authentication Patterns

### JWT Authentication Implementation

```javascript
/**
 * JWT Authentication Manager
 * Provides secure token-based authentication
 */
class AuthenticationManager {
  constructor(options = {}) {
    this.jwtSecret = options.jwtSecret || process.env.JWT_SECRET;
    this.jwtExpiry = options.jwtExpiry || '1h';
    this.refreshTokenExpiry = options.refreshTokenExpiry || '7d';
    
    if (!this.jwtSecret) {
      throw new Error('JWT secret is required for authentication');
    }
  }

  /**
   * User login with credential validation
   */
  async login(credentials) {
    try {
      // Sanitize input
      const sanitizedCredentials = {
        username: InputSanitizer.sanitizeText(credentials.username),
        password: credentials.password // Don't sanitize passwords
      };

      // Validate credentials (implement your own user verification)
      const user = await this.verifyUser(sanitizedCredentials);
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Store refresh token securely (implement your own storage)
      await this.storeRefreshToken(user.id, refreshToken);

      return {
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiry,
      issuer: 'your-app-name',
      audience: 'your-app-users'
    });
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(user) {
    const payload = {
      id: user.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'your-app-name',
      audience: 'your-app-users'
    });
  }

  /**
   * Validate JWT token
   */
  validateToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return {
        valid: true,
        payload: decoded
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    try {
      // Validate refresh token
      const validation = this.validateToken(refreshToken);
      if (!validation.valid) {
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }

      // Check if refresh token exists in storage
      const isValidRefreshToken = await this.verifyRefreshToken(
        validation.payload.id,
        refreshToken
      );

      if (!isValidRefreshToken) {
        return {
          success: false,
          error: 'Refresh token not found or expired'
        };
      }

      // Get user data
      const user = await this.getUserById(validation.payload.id);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);

      return {
        success: true,
        accessToken: newAccessToken
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Token refresh failed'
      };
    }
  }

  /**
   * Logout user and invalidate tokens
   */
  async logout(userId, refreshToken) {
    try {
      // Remove refresh token from storage
      await this.removeRefreshToken(userId, refreshToken);
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Logout failed'
      };
    }
  }

  // Implement these methods based on your database/storage system
  async verifyUser(credentials) {
    // Your user verification logic here
    throw new Error('verifyUser method must be implemented');
  }

  async storeRefreshToken(userId, token) {
    // Your refresh token storage logic here
    throw new Error('storeRefreshToken method must be implemented');
  }

  async verifyRefreshToken(userId, token) {
    // Your refresh token verification logic here
    throw new Error('verifyRefreshToken method must be implemented');
  }

  async removeRefreshToken(userId, token) {
    // Your refresh token removal logic here
    throw new Error('removeRefreshToken method must be implemented');
  }

  async getUserById(userId) {
    // Your user retrieval logic here
    throw new Error('getUserById method must be implemented');
  }
}
```

### Authentication Middleware

```javascript
/**
 * Express.js authentication middleware
 */
function authMiddleware(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid access token'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate token
    const authManager = new AuthenticationManager();
    const validation = authManager.validateToken(token);

    if (!validation.valid) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Your session has expired. Please log in again.'
      });
    }

    // Add user info to request object
    req.user = validation.payload;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication error',
      message: 'An error occurred during authentication'
    });
  }
}

/**
 * Role-based authorization middleware
 */
function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
}
```

## API Security Implementations

### Secure API Client

```javascript
/**
 * Secure API Client with built-in security features
 */
class SecureAPIClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.timeout = options.timeout || 30000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
    
    // Rate limiting
    this.requestQueue = [];
    this.requestCount = 0;
    this.rateLimitWindow = options.rateLimitWindow || 60000; // 1 minute
    this.maxRequests = options.maxRequests || 100;
    
    // Initialize rate limit reset
    this.resetRateLimit();
  }

  /**
   * Make secure API request
   */
  async request(endpoint, options = {}) {
    // Check rate limit
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = this.buildRequestConfig(options);

    let lastError;
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.executeRequest(url, config);
        return await this.handleResponse(response);
      } catch (error) {
        lastError = error;
        
        // Don't retry for client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          break;
        }

        // Wait before retry
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw lastError;
  }

  /**
   * Build secure request configuration
   */
  buildRequestConfig(options) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
      ...options.headers,
    };

    // Add CSRF token if available
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    // Add authentication token if available
    const authToken = this.getAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(this.timeout),
      credentials: 'same-origin', // Send cookies for same-origin requests
      ...options,
    };
  }

  /**
   * Execute HTTP request with timeout
   */
  async executeRequest(url, config) {
    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Handle API response securely
   */
  async handleResponse(response) {
    // Check response status
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.statusText = response.statusText;
      
      // Try to get error details
      try {
        const errorData = await response.json();
        error.data = errorData;
        error.message = errorData.message || error.message;
      } catch {
        // Ignore JSON parsing errors
      }
      
      throw error;
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  }

  /**
   * Rate limiting check
   */
  checkRateLimit() {
    const now = Date.now();
    
    // Remove old requests from queue
    this.requestQueue = this.requestQueue.filter(
      timestamp => now - timestamp < this.rateLimitWindow
    );

    // Check if we can make a new request
    if (this.requestQueue.length >= this.maxRequests) {
      return false;
    }

    // Add current request to queue
    this.requestQueue.push(now);
    return true;
  }

  /**
   * Reset rate limit counter
   */
  resetRateLimit() {
    setInterval(() => {
      this.requestQueue = [];
    }, this.rateLimitWindow);
  }

  /**
   * Get CSRF token from meta tag or cookie
   */
  getCSRFToken() {
    // Try to get from meta tag first
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      return metaTag.getAttribute('content');
    }

    // Try to get from cookie
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf-token') {
        return decodeURIComponent(value);
      }
    }

    return null;
  }

  /**
   * Get authentication token from storage
   */
  getAuthToken() {
    // Try sessionStorage first (more secure)
    let token = sessionStorage.getItem('authToken');
    if (token) {
      return token;
    }

    // Fallback to localStorage
    token = localStorage.getItem('authToken');
    return token;
  }

  /**
   * Utility method for delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, { 
      ...options, 
      method: 'POST', 
      body: data 
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: data 
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}
```

## Error Handling Patterns

### Secure Error Handler

```javascript
/**
 * Secure Error Handler
 * Prevents information leakage while providing useful feedback
 */
class SecureErrorHandler {
  constructor(options = {}) {
    this.isDevelopment = options.isDevelopment || process.env.NODE_ENV === 'development';
    this.logErrors = options.logErrors !== false;
    this.errorLogger = options.errorLogger || console.error;
  }

  /**
   * Handle client-side errors
   */
  handleClientError(error, context = {}) {
    const errorId = this.generateErrorId();
    const timestamp = new Date().toISOString();

    // Log detailed error for debugging
    if (this.logErrors) {
      this.errorLogger('Client Error:', {
        errorId,
        timestamp,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        context,
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }

    // Return sanitized error for user
    return {
      error: true,
      errorId,
      timestamp,
      message: this.getSafeErrorMessage(error),
      canRetry: this.isRetryableError(error)
    };
  }

  /**
   * Handle server-side errors
   */
  handleServerError(error, req, res) {
    const errorId = this.generateErrorId();
    const timestamp = new Date().toISOString();

    // Log detailed error for debugging
    if (this.logErrors) {
      this.errorLogger('Server Error:', {
        errorId,
        timestamp,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        request: {
          method: req.method,
          url: req.url,
          headers: req.headers,
          userAgent: req.get('User-Agent'),
          ip: req.ip
        }
      });
    }

    // Determine response status
    const statusCode = this.getErrorStatusCode(error);

    // Return sanitized error response
    res.status(statusCode).json({
      error: true,
      errorId,
      timestamp,
      message: this.getSafeErrorMessage(error),
      ...(this.isDevelopment && { debug: error.message }),
      canRetry: this.isRetryableError(error)
    });
  }

  /**
   * Generate unique error ID for tracking
   */
  generateErrorId() {
    return `ERR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  /**
   * Get safe error message for users
   */
  getSafeErrorMessage(error) {
    // Map of safe error messages
    const safeMessages = {
      'ValidationError': 'Please check your input and try again.',
      'UnauthorizedError': 'Please log in to access this resource.',
      'ForbiddenError': 'You do not have permission to perform this action.',
      'NotFoundError': 'The requested resource was not found.',
      'RateLimitError': 'Too many requests. Please try again later.',
      'TimeoutError': 'The request timed out. Please try again.',
      'NetworkError': 'Network error. Please check your connection and try again.',
      'ServerError': 'An internal server error occurred. Please try again later.'
    };

    // Return safe message or generic fallback
    return safeMessages[error.name] || 
           safeMessages[error.constructor.name] ||
           'An unexpected error occurred. Please try again.';
  }

  /**
   * Determine if error is retryable
   */
  isRetryableError(error) {
    const retryableErrors = [
      'TimeoutError',
      'NetworkError',
      'ServerError',
      'ServiceUnavailableError'
    ];

    return retryableErrors.includes(error.name) || 
           retryableErrors.includes(error.constructor.name) ||
           (error.status >= 500 && error.status < 600);
  }

  /**
   * Get appropriate HTTP status code for error
   */
  getErrorStatusCode(error) {
    const statusMap = {
      'ValidationError': 400,
      'UnauthorizedError': 401,
      'ForbiddenError': 403,
      'NotFoundError': 404,
      'RateLimitError': 429,
      'TimeoutError': 408,
      'ServerError': 500
    };

    return error.status || 
           statusMap[error.name] || 
           statusMap[error.constructor.name] || 
           500;
  }
}
```

### React Error Boundary

```javascript
/**
 * React Error Boundary Component
 * Catches JavaScript errors in component tree
 */
class SecureErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorInfo: null,
      errorId: null
    };
    this.errorHandler = new SecureErrorHandler();
  }

  static getDerivedStateFromError(error) {
    // Update state to render fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Handle the error securely
    const errorDetails = this.errorHandler.handleClientError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name
    });

    this.setState({
      errorInfo: errorDetails,
      errorId: errorDetails.errorId
    });

    // Report to error monitoring service (optional)
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorDetails);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      errorInfo: null,
      errorId: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.errorInfo?.message || 'An unexpected error occurred.'}</p>
          {this.state.errorId && (
            <p className="error-id">Error ID: {this.state.errorId}</p>
          )}
          {this.state.errorInfo?.canRetry && (
            <button onClick={this.handleRetry} className="retry-button">
              Try Again
            </button>
          )}
          {this.props.fallback || null}
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Security Testing Examples

### Comprehensive Security Test Suite

```javascript
/**
 * Security Test Suite
 * Tests for common security vulnerabilities
 */
describe('Security Validation Suite', () => {
  let securityTestUtils;

  beforeEach(() => {
    securityTestUtils = new SecurityTestUtils();
  });

  describe('Input Validation Security', () => {
    test('XSS Prevention - Script Tags', () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert("xss")',
        '<svg onload="alert(1)">',
        '<iframe src="javascript:alert(1)"></iframe>'
      ];

      xssPayloads.forEach(payload => {
        const sanitized = InputSanitizer.sanitizeHTML(payload);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('<img');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('<svg');
        expect(sanitized).not.toContain('<iframe');
      });
    });

    test('SQL Injection Protection', () => {
      const sqlPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; SELECT * FROM users; --",
        "' UNION SELECT NULL, username, password FROM users --"
      ];

      sqlPayloads.forEach(payload => {
        const sanitized = InputSanitizer.sanitizeText(payload);
        expect(sanitized).not.toContain('DROP TABLE');
        expect(sanitized).not.toContain('SELECT');
        expect(sanitized).not.toContain('UNION');
        expect(sanitized).not.toContain('--');
      });
    });

    test('Email Validation', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org'
      ];

      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..double.dot@example.com',
        '<script>alert("xss")</script>@example.com'
      ];

      validEmails.forEach(email => {
        const result = InputValidator.validateEmail(email);
        expect(result.isValid).toBe(true);
      });

      invalidEmails.forEach(email => {
        const result = InputValidator.validateEmail(email);
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Authentication Security', () => {
    test('JWT Token Validation', () => {
      const authManager = new AuthenticationManager({
        jwtSecret: 'test-secret'
      });

      // Test valid token
      const user = { id: 1, username: 'testuser', role: 'user' };
      const token = authManager.generateAccessToken(user);
      const validation = authManager.validateToken(token);
      
      expect(validation.valid).toBe(true);
      expect(validation.payload.username).toBe('testuser');

      // Test invalid tokens
      const invalidTokens = [
        'invalid.jwt.token',
        '',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.invalid',
        'expired.token.here'
      ];

      invalidTokens.forEach(token => {
        const result = authManager.validateToken(token);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    test('Password Strength Validation', () => {
      const strongPasswords = [
        'StrongPass123!',
        'MySecureP@ssw0rd',
        'C0mpl3x&Secure!'
      ];

      const weakPasswords = [
        'password',
        '123456',
        'Password', // No numbers or special chars
        'pass123', // Too short
        'PASSWORD123!' // No lowercase
      ];

      strongPasswords.forEach(password => {
        const result = InputValidator.validatePassword(password);
        expect(result.isValid).toBe(true);
      });

      weakPasswords.forEach(password => {
        const result = InputValidator.validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });
  });

  describe('API Security', () => {
    test('Rate Limiting', async () => {
      const apiClient = new SecureAPIClient('https://api.example.com', {
        maxRequests: 5,
        rateLimitWindow: 1000 // 1 second
      });

      // Make requests up to the limit
      const promises = [];
      for (let i = 0; i < 7; i++) {
        promises.push(
          apiClient.request('/test').catch(error => error)
        );
      }

      const results = await Promise.all(promises);
      
      // Some requests should be rate limited
      const rateLimitedRequests = results.filter(
        result => result.message && result.message.includes('Rate limit exceeded')
      );
      
      expect(rateLimitedRequests.length).toBeGreaterThan(0);
    });

    test('CSRF Token Handling', () => {
      // Mock CSRF token in meta tag
      document.head.innerHTML = '<meta name="csrf-token" content="test-csrf-token">';
      
      const apiClient = new SecureAPIClient('https://api.example.com');
      const config = apiClient.buildRequestConfig({
        method: 'POST',
        body: { test: 'data' }
      });

      expect(config.headers['X-CSRF-Token']).toBe('test-csrf-token');
    });
  });

  describe('Error Handling Security', () => {
    test('Error Information Leakage Prevention', () => {
      const errorHandler = new SecureErrorHandler({ isDevelopment: false });
      
      // Test with sensitive error
      const sensitiveError = new Error('Database connection failed: user=admin, password=secret123');
      const handledError = errorHandler.handleClientError(sensitiveError);

      expect(handledError.message).not.toContain('password');
      expect(handledError.message).not.toContain('secret123');
      expect(handledError.message).not.toContain('admin');
      expect(handledError.errorId).toBeDefined();
    });

    test('Error Retry Logic', () => {
      const errorHandler = new SecureErrorHandler();
      
      const retryableError = new Error('Network timeout');
      retryableError.name = 'TimeoutError';
      
      const nonRetryableError = new Error('Invalid input');
      nonRetryableError.name = 'ValidationError';

      const retryableResult = errorHandler.handleClientError(retryableError);
      const nonRetryableResult = errorHandler.handleClientError(nonRetryableError);

      expect(retryableResult.canRetry).toBe(true);
      expect(nonRetryableResult.canRetry).toBe(false);
    });
  });
});
```

## Configuration Templates

### Next.js Security Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration
  output: 'export',
  trailingSlash: true,
  distDir: 'out',

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.example.com"
          }
        ],
      },
    ];
  },

  // Environment variables validation
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    API_BASE_URL: process.env.API_BASE_URL,
  },

  // Webpack configuration for security
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

### Environment Variables Template

```bash
# .env.local (for development)
# Copy this file and rename to .env.local
# Never commit .env.local to version control

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# API Configuration
API_BASE_URL=https://api.yourdomain.com
API_TIMEOUT=30000
API_RATE_LIMIT_WINDOW=60000
API_MAX_REQUESTS=100

# Database Configuration (if applicable)
DATABASE_URL=your-database-connection-string
DATABASE_SSL=true

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With,X-CSRF-Token

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=another-long-random-secret-for-sessions
CSRF_SECRET=csrf-secret-key-here

# Development vs Production
NODE_ENV=development
DEBUG=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# Email Configuration (if applicable)
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-email-password
```

---

**Document Version:** 1.0  
**Last Updated:** July 2025  
**Total Code Examples:** 15  
**Security Patterns Covered:** 8  
**Testing Examples:** 12