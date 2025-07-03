/**
 * Security Testing Examples
 * 
 * This file contains comprehensive tests for security features
 * including input sanitization, validation, and API security.
 */

const { sanitizeInput, validate, encodeOutput } = require('../src/lib/sanitize')
const { handleClientError, ApiError, ErrorTypes } = require('../src/lib/errorHandler')

describe('Security Features', () => {
  describe('Input Sanitization', () => {
    test('should sanitize text input', () => {
      const maliciousInput = '<script>alert("XSS")</script>Hello World'
      const sanitized = sanitizeInput.text(maliciousInput)
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('</script>')
      expect(sanitized).toContain('Hello World')
    })

    test('should sanitize HTML content', () => {
      const htmlInput = '<div>Safe content</div><script>alert("XSS")</script>'
      const sanitized = sanitizeInput.html(htmlInput)
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).toContain('<div>Safe content</div>')
    })

    test('should validate and sanitize email addresses', () => {
      expect(sanitizeInput.email('test@example.com')).toBe('test@example.com')
      expect(sanitizeInput.email('Test@Example.COM')).toBe('test@example.com')
      expect(sanitizeInput.email('invalid-email')).toBeNull()
      expect(sanitizeInput.email('test@<script>alert("XSS")</script>')).toBeNull()
    })

    test('should sanitize URLs', () => {
      expect(sanitizeInput.url('https://example.com')).toBe('https://example.com')
      expect(sanitizeInput.url('http://example.com')).toBe('http://example.com')
      expect(sanitizeInput.url('javascript:alert("XSS")')).toBeNull()
      expect(sanitizeInput.url('data:text/html,<script>alert("XSS")</script>')).toBeNull()
    })

    test('should sanitize phone numbers', () => {
      expect(sanitizeInput.phone('(123) 456-7890')).toBe('(123) 456-7890')
      expect(sanitizeInput.phone('123-456-7890')).toBe('123-456-7890')
      expect(sanitizeInput.phone('+1 123 456 7890')).toBe('+1 123 456 7890')
      expect(sanitizeInput.phone('invalid-phone')).toBeNull()
      expect(sanitizeInput.phone('123')).toBeNull() // Too short
    })

    test('should limit text length', () => {
      const longText = 'a'.repeat(2000)
      const sanitized = sanitizeInput.text(longText, 100)
      
      expect(sanitized.length).toBe(100)
    })

    test('should handle non-string inputs', () => {
      expect(sanitizeInput.text(null)).toBe('')
      expect(sanitizeInput.text(undefined)).toBe('')
      expect(sanitizeInput.text(123)).toBe('')
      expect(sanitizeInput.email(123)).toBeNull()
      expect(sanitizeInput.url({})).toBeNull()
    })
  })

  describe('Input Validation', () => {
    test('should validate email format', () => {
      expect(validate.email('test@example.com')).toBe(true)
      expect(validate.email('invalid-email')).toBe(false)
      expect(validate.email('')).toBe(false)
    })

    test('should validate text length', () => {
      expect(validate.text('Hello', 3, 10)).toBe(true)
      expect(validate.text('Hi', 3, 10)).toBe(false) // Too short
      expect(validate.text('This is too long', 3, 10)).toBe(false) // Too long
    })

    test('should validate password strength', () => {
      const weak = validate.password('123')
      expect(weak.isValid).toBe(false)
      expect(weak.errors).toContain('Password must be at least 8 characters long')

      const strong = validate.password('MySecure123!')
      expect(strong.isValid).toBe(true)
      expect(strong.errors).toHaveLength(0)

      const noNumber = validate.password('MySecurePass!')
      expect(noNumber.isValid).toBe(false)
      expect(noNumber.errors).toContain('Password must contain at least one number')
    })

    test('should validate URL format', () => {
      expect(validate.url('https://example.com')).toBe(true)
      expect(validate.url('invalid-url')).toBe(false)
      expect(validate.url('javascript:alert("XSS")')).toBe(false)
    })
  })

  describe('Output Encoding', () => {
    test('should encode HTML entities', () => {
      const input = '<script>alert("XSS")</script>'
      const encoded = encodeOutput.html(input)
      
      expect(encoded).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
    })

    test('should encode URLs', () => {
      const input = 'hello world & special chars'
      const encoded = encodeOutput.url(input)
      
      expect(encoded).toBe('hello%20world%20%26%20special%20chars')
    })

    test('should encode JSON safely', () => {
      const input = { message: '<script>alert("XSS")</script>' }
      const encoded = encodeOutput.json(input)
      
      expect(encoded).toContain('\\u003c')
      expect(encoded).toContain('\\u003e')
      expect(encoded).not.toContain('<')
      expect(encoded).not.toContain('>')
    })

    test('should handle non-string inputs', () => {
      expect(encodeOutput.html(null)).toBe('')
      expect(encodeOutput.html(undefined)).toBe('')
      expect(encodeOutput.url(123)).toBe('')
    })
  })

  describe('Error Handling', () => {
    test('should handle client errors securely', () => {
      const apiError = new ApiError('Database connection failed', ErrorTypes.SERVER, 500)
      const handled = handleClientError(apiError)
      
      expect(handled.message).toBe('An unexpected error occurred. Please try again.')
      expect(handled.shouldRetry).toBe(false)
    })

    test('should handle network errors with retry suggestion', () => {
      const networkError = new Error('fetch failed')
      const handled = handleClientError(networkError)
      
      expect(handled.message).toBe('Network error. Please check your connection.')
      expect(handled.shouldRetry).toBe(true)
    })

    test('should handle validation errors', () => {
      const validationError = new ApiError('Invalid input', ErrorTypes.VALIDATION, 400)
      const handled = handleClientError(validationError)
      
      expect(handled.message).toBe('Please check your input and try again.')
      expect(handled.shouldRetry).toBe(false)
    })

    test('should handle authentication errors', () => {
      const authError = new ApiError('Token expired', ErrorTypes.AUTHENTICATION, 401)
      const handled = handleClientError(authError)
      
      expect(handled.message).toBe('Please log in to continue.')
      expect(handled.shouldRetry).toBe(false)
    })

    test('should handle rate limiting errors', () => {
      const rateLimitError = new ApiError('Too many requests', ErrorTypes.RATE_LIMIT, 429)
      const handled = handleClientError(rateLimitError)
      
      expect(handled.message).toBe('Too many requests. Please wait a moment and try again.')
      expect(handled.shouldRetry).toBe(true)
    })
  })

  describe('XSS Prevention', () => {
    test('should prevent script injection in text fields', () => {
      const maliciousInputs = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src="x" onerror="alert(\'XSS\')">',
        '<svg onload="alert(\'XSS\')">',
        '"><script>alert("XSS")</script>',
        "'; alert('XSS'); //",
        '<iframe src="javascript:alert(\'XSS\')"></iframe>'
      ]

      maliciousInputs.forEach(input => {
        const sanitized = sanitizeInput.text(input)
        expect(sanitized).not.toContain('<script>')
        expect(sanitized).not.toContain('javascript:')
        expect(sanitized).not.toContain('onerror')
        expect(sanitized).not.toContain('onload')
      })
    })

    test('should prevent HTML injection in email fields', () => {
      const maliciousEmails = [
        'test@example.com<script>alert("XSS")</script>',
        'test@<script>alert("XSS")</script>example.com',
        'test+<script>alert("XSS")</script>@example.com'
      ]

      maliciousEmails.forEach(email => {
        const sanitized = sanitizeInput.email(email)
        expect(sanitized).toBeNull()
      })
    })

    test('should prevent URL-based attacks', () => {
      const maliciousUrls = [
        'javascript:alert("XSS")',
        'data:text/html,<script>alert("XSS")</script>',
        'vbscript:alert("XSS")',
        'file:///etc/passwd'
      ]

      maliciousUrls.forEach(url => {
        const sanitized = sanitizeInput.url(url)
        expect(sanitized).toBeNull()
      })
    })
  })

  describe('SQL Injection Prevention', () => {
    test('should detect potential SQL injection patterns', () => {
      const sqlInjectionPatterns = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM users--",
        "1; DELETE FROM users; --"
      ]

      sqlInjectionPatterns.forEach(pattern => {
        const sanitized = sanitizeInput.text(pattern)
        // The sanitized text should not contain dangerous SQL patterns
        expect(sanitized).not.toContain('DROP TABLE')
        expect(sanitized).not.toContain('DELETE FROM')
        expect(sanitized).not.toContain('UNION SELECT')
        expect(sanitized).not.toContain('--')
      })
    })
  })

  describe('CSRF Protection', () => {
    test('should validate origin headers', () => {
      // Mock function to simulate CSRF token validation
      const validateCSRF = (origin, expectedOrigin) => {
        return origin === expectedOrigin
      }

      expect(validateCSRF('https://example.com', 'https://example.com')).toBe(true)
      expect(validateCSRF('https://malicious.com', 'https://example.com')).toBe(false)
      expect(validateCSRF('http://example.com', 'https://example.com')).toBe(false)
    })
  })

  describe('Authentication Security', () => {
    test('should enforce strong password requirements', () => {
      const passwords = [
        { password: 'password123', expected: false }, // Common word
        { password: '12345678', expected: false }, // Only numbers
        { password: 'Password', expected: false }, // No numbers or special chars
        { password: 'password!', expected: false }, // No uppercase or numbers
        { password: 'PASSWORD123!', expected: false }, // No lowercase
        { password: 'Password123!', expected: true }, // Meets all requirements
        { password: 'MySecure123!', expected: true }, // Meets all requirements
      ]

      passwords.forEach(({ password, expected }) => {
        const result = validate.password(password)
        expect(result.isValid).toBe(expected)
      })
    })

    test('should handle token expiration', () => {
      // Mock JWT token validation
      const validateToken = (token) => {
        if (token === 'expired-token') {
          throw new ApiError('Token expired', ErrorTypes.AUTHENTICATION, 401)
        }
        return true
      }

      expect(() => validateToken('valid-token')).not.toThrow()
      expect(() => validateToken('expired-token')).toThrow()
    })
  })

  describe('Rate Limiting', () => {
    test('should implement proper rate limiting', () => {
      // Mock rate limiter
      const rateLimiter = {
        requests: {},
        checkLimit: function(ip, limit = 10) {
          this.requests[ip] = (this.requests[ip] || 0) + 1
          return this.requests[ip] <= limit
        },
        reset: function(ip) {
          delete this.requests[ip]
        }
      }

      const ip = '192.168.1.1'
      
      // Allow requests within limit
      for (let i = 0; i < 10; i++) {
        expect(rateLimiter.checkLimit(ip)).toBe(true)
      }
      
      // Block requests exceeding limit
      expect(rateLimiter.checkLimit(ip)).toBe(false)
      
      // Reset and allow again
      rateLimiter.reset(ip)
      expect(rateLimiter.checkLimit(ip)).toBe(true)
    })
  })

  describe('Data Validation Edge Cases', () => {
    test('should handle empty and null inputs', () => {
      expect(sanitizeInput.text('')).toBe('')
      expect(sanitizeInput.text(null)).toBe('')
      expect(sanitizeInput.text(undefined)).toBe('')
      expect(sanitizeInput.email('')).toBeNull()
      expect(sanitizeInput.url('')).toBeNull()
    })

    test('should handle extremely long inputs', () => {
      const veryLongText = 'a'.repeat(100000)
      const sanitized = sanitizeInput.text(veryLongText)
      
      expect(sanitized.length).toBeLessThanOrEqual(1000)
    })

    test('should handle special characters safely', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const sanitized = sanitizeInput.text(specialChars)
      
      // Should not contain < or > characters
      expect(sanitized).not.toContain('<')
      expect(sanitized).not.toContain('>')
    })
  })
})