/**
 * Security Utilities for Secure Frontend-Backend Communication
 * 
 * This file provides practical utility functions for implementing
 * secure communication patterns between frontend and backend.
 */

// Input Sanitization Class
export class InputSanitizer {
  /**
   * Escape HTML entities to prevent XSS attacks
   * @param {string} unsafe - Potentially unsafe string
   * @returns {string} - HTML-escaped string
   */
  static escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\//g, "&#x2F;");
  }

  /**
   * Sanitize string input with various options
   * @param {string} input - Input string to sanitize
   * @param {Object} options - Sanitization options
   * @returns {string} - Sanitized string
   */
  static sanitizeString(input, options = {}) {
    if (typeof input !== 'string') return input;
    
    let sanitized = input.trim();
    
    if (options.removeHtml) {
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    }
    
    if (options.removeScripts) {
      sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
      sanitized = sanitized.replace(/javascript:/gi, '');
      sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    }
    
    if (options.alphanumericOnly) {
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s.,!?-]/g, '');
    }
    
    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }
    
    return sanitized;
  }

  /**
   * Sanitize email addresses
   * @param {string} email - Email to sanitize
   * @returns {string} - Sanitized email
   */
  static sanitizeEmail(email) {
    if (typeof email !== 'string') return '';
    
    return email
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9@._-]/g, '');
  }

  /**
   * Sanitize URLs to prevent malicious redirects
   * @param {string} url - URL to sanitize
   * @returns {string} - Sanitized URL or empty string if invalid
   */
  static sanitizeUrl(url) {
    if (typeof url !== 'string') return '';
    
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    const sanitized = url.trim();
    
    try {
      const urlObj = new URL(sanitized);
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return '';
      }
      return urlObj.toString();
    } catch {
      return '';
    }
  }
}

// Input Validation Class
export class InputValidator {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid email format
   */
  static isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} - True if valid URL
   */
  static isUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Check if string contains only alphanumeric characters
   * @param {string} str - String to check
   * @returns {boolean} - True if alphanumeric only
   */
  static isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
  }
  
  /**
   * Check minimum string length
   * @param {string} str - String to check
   * @param {number} min - Minimum length
   * @returns {boolean} - True if meets minimum length
   */
  static hasMinLength(str, min) {
    return typeof str === 'string' && str.length >= min;
  }
  
  /**
   * Check maximum string length
   * @param {string} str - String to check
   * @param {number} max - Maximum length
   * @returns {boolean} - True if within maximum length
   */
  static hasMaxLength(str, max) {
    return typeof str === 'string' && str.length <= max;
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - Validation result with score and feedback
   */
  static validatePassword(password) {
    const result = {
      isValid: false,
      score: 0,
      feedback: []
    };

    if (!password || typeof password !== 'string') {
      result.feedback.push('Password is required');
      return result;
    }

    if (password.length < 8) {
      result.feedback.push('Password must be at least 8 characters long');
    } else {
      result.score += 1;
    }

    if (!/[a-z]/.test(password)) {
      result.feedback.push('Password must contain at least one lowercase letter');
    } else {
      result.score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      result.feedback.push('Password must contain at least one uppercase letter');
    } else {
      result.score += 1;
    }

    if (!/\d/.test(password)) {
      result.feedback.push('Password must contain at least one number');
    } else {
      result.score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.feedback.push('Password must contain at least one special character');
    } else {
      result.score += 1;
    }

    result.isValid = result.score >= 4;
    return result;
  }
}

// Secure API Communication Class
export class SecureApiClient {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.timeout = options.timeout || 10000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  /**
   * Get authentication token from storage
   * @returns {string|null} - Auth token or null
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Remove authentication token
   */
  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  /**
   * Make secure API request with retry logic
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      timeout: this.timeout,
    };

    const requestOptions = { ...defaultOptions, ...options };

    let lastError;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status === 401) {
          this.removeAuthToken();
          throw new Error('Authentication failed');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        
        if (attempt < this.retryAttempts && this.shouldRetry(error)) {
          await this.delay(this.retryDelay * attempt);
          continue;
        }
        
        throw error;
      }
    }
    
    throw lastError;
  }

  /**
   * Determine if request should be retried
   * @param {Error} error - Error object
   * @returns {boolean} - True if should retry
   */
  shouldRetry(error) {
    return (
      error.name === 'AbortError' ||
      error.message.includes('network') ||
      error.message.includes('timeout')
    );
  }

  /**
   * Delay utility for retry logic
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} - Promise that resolves after delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - Response data
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request with data sanitization
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise} - Response data
   */
  async post(endpoint, data, options = {}) {
    const sanitizedData = this.sanitizeRequestData(data);
    
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  /**
   * PUT request with data sanitization
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise} - Response data
   */
  async put(endpoint, data, options = {}) {
    const sanitizedData = this.sanitizeRequestData(data);
    
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(sanitizedData),
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - Response data
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Sanitize request data before sending
   * @param {Object} data - Data to sanitize
   * @returns {Object} - Sanitized data
   */
  sanitizeRequestData(data) {
    if (data === null || typeof data !== 'object') {
      return typeof data === 'string' 
        ? InputSanitizer.sanitizeString(data, { removeScripts: true })
        : data;
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeRequestData(item));
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      const sanitizedKey = InputSanitizer.sanitizeString(key, { alphanumericOnly: true });
      sanitized[sanitizedKey] = this.sanitizeRequestData(value);
    }
    
    return sanitized;
  }
}

// Rate Limiting Utility (Client-side)
export class ClientRateLimiter {
  constructor() {
    this.requests = new Map();
  }

  /**
   * Check if request is allowed based on rate limit
   * @param {string} key - Unique key for rate limiting (e.g., endpoint)
   * @param {number} maxRequests - Maximum requests allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {boolean} - True if request is allowed
   */
  isAllowed(key, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const keyRequests = this.requests.get(key);
    
    // Remove expired requests
    const validRequests = keyRequests.filter(
      timestamp => now - timestamp < windowMs
    );
    
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  }

  /**
   * Get time until next request is allowed
   * @param {string} key - Rate limit key
   * @param {number} windowMs - Time window in milliseconds
   * @returns {number} - Milliseconds until next request allowed
   */
  getTimeUntilReset(key, windowMs = 60000) {
    if (!this.requests.has(key)) {
      return 0;
    }
    
    const keyRequests = this.requests.get(key);
    if (keyRequests.length === 0) {
      return 0;
    }
    
    const oldestRequest = Math.min(...keyRequests);
    const resetTime = oldestRequest + windowMs;
    const now = Date.now();
    
    return Math.max(0, resetTime - now);
  }
}

// Error Handling Utility
export class ErrorHandler {
  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - Error object
   * @param {boolean} showUserMessage - Whether to show user message
   * @returns {Object} - Processed error information
   */
  static handleApiError(error, showUserMessage = true) {
    console.error('API Error:', error);
    
    let userMessage = 'An unexpected error occurred. Please try again.';
    let errorCode = 'UNKNOWN_ERROR';
    
    if (error.message.includes('Authentication failed')) {
      userMessage = 'Please log in to continue.';
      errorCode = 'AUTH_FAILED';
    } else if (error.message.includes('status: 400')) {
      userMessage = 'Please check your input and try again.';
      errorCode = 'BAD_REQUEST';
    } else if (error.message.includes('status: 403')) {
      userMessage = 'You do not have permission to perform this action.';
      errorCode = 'FORBIDDEN';
    } else if (error.message.includes('status: 429')) {
      userMessage = 'Too many requests. Please wait before trying again.';
      errorCode = 'RATE_LIMITED';
    } else if (error.message.includes('status: 500')) {
      userMessage = 'Server error. Please try again later.';
      errorCode = 'SERVER_ERROR';
    } else if (error.name === 'AbortError') {
      userMessage = 'Request timed out. Please try again.';
      errorCode = 'TIMEOUT';
    }
    
    return {
      userMessage,
      errorCode,
      originalError: error,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Log security events for monitoring
   * @param {string} event - Event type
   * @param {Object} details - Event details
   */
  static logSecurityEvent(event, details = {}) {
    const logEntry = {
      event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...details
    };
    
    // In production, send to your logging service
    console.warn('Security Event:', logEntry);
    
    // Example: Send to monitoring service
    // this.sendToMonitoringService(logEntry);
  }
}

// Export all utilities
const SecurityUtils = {
  InputSanitizer,
  InputValidator,
  SecureApiClient,
  ClientRateLimiter,
  ErrorHandler
};

export default SecurityUtils;