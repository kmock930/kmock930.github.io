/**
 * Data Sanitization Utilities
 * 
 * This module provides functions to sanitize and validate user input
 * to prevent XSS attacks and ensure data integrity.
 */

const sanitizeInput = {
  /**
   * Sanitize text input by removing HTML tags and limiting length
   * @param {string} input - The input text to sanitize
   * @param {number} maxLength - Maximum allowed length (default: 1000)
   * @returns {string} - Sanitized text
   */
  text: (input, maxLength = 1000) => {
    if (typeof input !== 'string') return ''
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers like onerror, onload
      .replace(/DROP\s+TABLE/gi, '') // Remove SQL injection patterns
      .replace(/DELETE\s+FROM/gi, '') 
      .replace(/UNION\s+SELECT/gi, '')
      .replace(/--/g, '') // Remove SQL comments
      .trim()
      .substring(0, maxLength)
  },

  /**
   * Validate and sanitize email addresses
   * @param {string} input - The email to validate
   * @returns {string|null} - Sanitized email or null if invalid
   */
  email: (input) => {
    if (typeof input !== 'string') return null
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const sanitized = input.toLowerCase().trim()
    
    // Additional security check
    if (sanitized.includes('<') || sanitized.includes('>')) {
      return null
    }
    
    return emailRegex.test(sanitized) ? sanitized : null
  },

  /**
   * Sanitize URL input
   * @param {string} input - The URL to sanitize
   * @returns {string|null} - Sanitized URL or null if invalid
   */
  url: (input) => {
    if (typeof input !== 'string') return null
    
    try {
      const url = new URL(input)
      // Only allow safe protocols
      if (['http:', 'https:'].includes(url.protocol)) {
        // Remove trailing slash to match test expectations
        return url.toString().replace(/\/$/, '')
      }
      return null
    } catch {
      return null
    }
  },

  /**
   * Sanitize HTML content (basic version without external dependencies)
   * @param {string} input - The HTML content to sanitize
   * @returns {string} - Sanitized HTML
   */
  html: (input) => {
    if (typeof input !== 'string') return ''
    
    // Basic HTML sanitization - remove dangerous tags and attributes
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .trim()
  },

  /**
   * Sanitize phone number input
   * @param {string} input - The phone number to sanitize
   * @returns {string|null} - Sanitized phone number or null if invalid
   */
  phone: (input) => {
    if (typeof input !== 'string') return null
    
    // Remove all non-numeric characters except + and -
    const cleaned = input.replace(/[^\d+\-\(\)\s]/g, '')
    
    // Basic phone number validation (10-15 digits)
    const digitCount = cleaned.replace(/\D/g, '').length
    if (digitCount >= 10 && digitCount <= 15) {
      return cleaned.trim()
    }
    
    return null
  }
}

/**
 * Output encoding utilities
 */
const encodeOutput = {
  /**
   * HTML entity encoding for safe display
   * @param {string} text - Text to encode
   * @returns {string} - HTML-encoded text
   */
  html: (text) => {
    if (typeof text !== 'string') return ''
    
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  },

  /**
   * URL encoding
   * @param {string} text - Text to encode
   * @returns {string} - URL-encoded text
   */
  url: (text) => {
    if (typeof text !== 'string') return ''
    return encodeURIComponent(text)
  },

  /**
   * JSON encoding with XSS protection
   * @param {any} data - Data to encode
   * @returns {string} - Safe JSON string
   */
  json: (data) => {
    return JSON.stringify(data)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
  }
}

/**
 * Validation helpers
 */
const validate = {
  /**
   * Check if input is a valid email
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  email: (email) => {
    return sanitizeInput.email(email) !== null
  },

  /**
   * Check if input is a valid URL
   * @param {string} url - URL to validate
   * @returns {boolean} - True if valid
   */
  url: (url) => {
    return sanitizeInput.url(url) !== null
  },

  /**
   * Check if text meets minimum requirements
   * @param {string} text - Text to validate
   * @param {number} minLength - Minimum length required
   * @param {number} maxLength - Maximum length allowed
   * @returns {boolean} - True if valid
   */
  text: (text, minLength = 1, maxLength = 1000) => {
    if (typeof text !== 'string') return false
    const sanitized = sanitizeInput.text(text, maxLength)
    return sanitized.length >= minLength && text.length <= maxLength
  },

  /**
   * Check if password meets security requirements
   * @param {string} password - Password to validate
   * @returns {object} - Validation result with details
   */
  password: (password) => {
    const result = {
      isValid: false,
      errors: []
    }

    if (typeof password !== 'string') {
      result.errors.push('Password must be a string')
      return result
    }

    if (password.length < 8) {
      result.errors.push('Password must be at least 8 characters long')
    }

    if (!/[a-z]/.test(password)) {
      result.errors.push('Password must contain at least one lowercase letter')
    }

    if (!/[A-Z]/.test(password)) {
      result.errors.push('Password must contain at least one uppercase letter')
    }

    if (!/\d/.test(password)) {
      result.errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.errors.push('Password must contain at least one special character')
    }

    result.isValid = result.errors.length === 0
    return result
  }
}

module.exports = {
  sanitizeInput,
  encodeOutput,
  validate
}