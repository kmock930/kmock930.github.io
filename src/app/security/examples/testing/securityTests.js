/**
 * Security Testing Examples
 * 
 * This file demonstrates how to test security implementations
 * and validate that your security measures are working correctly.
 */

const { InputSanitizer, InputValidator, SecureApiClient, ErrorHandler } = require('../utils/securityUtils');

describe('Security Testing Suite', () => {
  
  describe('Input Sanitization Tests', () => {
    
    test('should prevent XSS attacks', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert(document.cookie)',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<svg onload="alert(1)">',
        '"><script>alert(String.fromCharCode(88,83,83))</script>'
      ];
      
      maliciousInputs.forEach(input => {
        const sanitized = InputSanitizer.sanitizeString(input, { removeScripts: true });
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('onload');
      });
    });
    
    test('should sanitize HTML entities', () => {
      const input = '<div>Hello & goodbye "quotes" \'apostrophes\'</div>';
      const escaped = InputSanitizer.escapeHtml(input);
      
      expect(escaped).toContain('&lt;div&gt;');
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&quot;');
      expect(escaped).toContain('&#039;');
    });
    
    test('should sanitize email addresses', () => {
      const testCases = [
        { input: 'user@example.com', expected: 'user@example.com' },
        { input: 'USER@EXAMPLE.COM', expected: 'user@example.com' },
        { input: '  user@example.com  ', expected: 'user@example.com' },
        { input: 'user<script>@example.com', expected: 'user@example.com' },
        { input: 'user@exam<>ple.com', expected: 'user@example.com' }
      ];
      
      testCases.forEach(({ input, expected }) => {
        expect(InputSanitizer.sanitizeEmail(input)).toBe(expected);
      });
    });
    
    test('should validate and sanitize URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'mailto:user@example.com'
      ];
      
      const invalidUrls = [
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'ftp://example.com',
        'file:///etc/passwd'
      ];
      
      validUrls.forEach(url => {
        const sanitized = InputSanitizer.sanitizeUrl(url);
        expect(sanitized).toBe(url);
      });
      
      invalidUrls.forEach(url => {
        const sanitized = InputSanitizer.sanitizeUrl(url);
        expect(sanitized).toBe('');
      });
    });
  });
  
  describe('Input Validation Tests', () => {
    
    test('should validate email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org'
      ];
      
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..double.dot@example.com'
      ];
      
      validEmails.forEach(email => {
        expect(InputValidator.isEmail(email)).toBe(true);
      });
      
      invalidEmails.forEach(email => {
        expect(InputValidator.isEmail(email)).toBe(false);
      });
    });
    
    test('should validate password strength', () => {
      const testCases = [
        { password: 'Password123!', shouldBeValid: true, minScore: 4 },
        { password: 'password', shouldBeValid: false, maxScore: 2 },
        { password: 'PASSWORD', shouldBeValid: false, maxScore: 2 },
        { password: '12345678', shouldBeValid: false, maxScore: 2 },
        { password: 'Aa1!', shouldBeValid: false, maxScore: 3 }, // too short
        { password: 'LongPasswordWithoutNumbers!', shouldBeValid: false, maxScore: 4 }
      ];
      
      testCases.forEach(({ password, shouldBeValid, minScore, maxScore }) => {
        const result = InputValidator.validatePassword(password);
        expect(result.isValid).toBe(shouldBeValid);
        
        if (minScore) {
          expect(result.score).toBeGreaterThanOrEqual(minScore);
        }
        
        if (maxScore) {
          expect(result.score).toBeLessThanOrEqual(maxScore);
        }
      });
    });
    
    test('should validate string lengths', () => {
      expect(InputValidator.hasMinLength('hello', 3)).toBe(true);
      expect(InputValidator.hasMinLength('hi', 3)).toBe(false);
      expect(InputValidator.hasMaxLength('hello', 10)).toBe(true);
      expect(InputValidator.hasMaxLength('hello world!', 10)).toBe(false);
    });
  });
  
  describe('API Client Security Tests', () => {
    let apiClient;
    
    beforeEach(() => {
      apiClient = new SecureApiClient('https://api.example.com');
      // Mock fetch for testing
      global.fetch = jest.fn();
    });
    
    afterEach(() => {
      jest.restoreAllMocks();
    });
    
    test('should include authentication headers', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'test' }) };
      global.fetch.mockResolvedValueOnce(mockResponse);
      
      apiClient.setAuthToken('test-token');
      await apiClient.get('/test');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });
    
    test('should sanitize request data', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) };
      global.fetch.mockResolvedValueOnce(mockResponse);
      
      const maliciousData = {
        name: '<script>alert("xss")</script>',
        message: 'Hello <img src="x" onerror="alert(1)">'
      };
      
      await apiClient.post('/test', maliciousData);
      
      const fetchCall = global.fetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      
      expect(requestBody.name).not.toContain('<script>');
      expect(requestBody.message).not.toContain('onerror');
    });
    
    test('should handle 401 errors and remove token', async () => {
      const mockResponse = { ok: false, status: 401 };
      global.fetch.mockResolvedValueOnce(mockResponse);
      
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          removeItem: jest.fn(),
          getItem: jest.fn(() => 'test-token'),
          setItem: jest.fn()
        }
      });
      
      apiClient.setAuthToken('test-token');
      
      await expect(apiClient.get('/test')).rejects.toThrow('Authentication failed');
      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    });
    
    test('should retry failed requests', async () => {
      // First two calls fail, third succeeds
      global.fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: 'success' }) });
      
      const result = await apiClient.get('/test');
      expect(result.data).toBe('success');
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });
  
  describe('Error Handling Tests', () => {
    
    test('should handle different error types', () => {
      const testCases = [
        { 
          error: new Error('status: 400'), 
          expectedCode: 'BAD_REQUEST',
          expectedMessage: 'Please check your input and try again.'
        },
        { 
          error: new Error('status: 403'), 
          expectedCode: 'FORBIDDEN',
          expectedMessage: 'You do not have permission to perform this action.'
        },
        { 
          error: new Error('status: 429'), 
          expectedCode: 'RATE_LIMITED',
          expectedMessage: 'Too many requests. Please wait before trying again.'
        },
        { 
          error: new Error('Authentication failed'), 
          expectedCode: 'AUTH_FAILED',
          expectedMessage: 'Please log in to continue.'
        }
      ];
      
      testCases.forEach(({ error, expectedCode, expectedMessage }) => {
        const result = ErrorHandler.handleApiError(error, false);
        expect(result.errorCode).toBe(expectedCode);
        expect(result.userMessage).toBe(expectedMessage);
      });
    });
    
    test('should log security events', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      ErrorHandler.logSecurityEvent('SUSPICIOUS_LOGIN', {
        email: 'test@example.com',
        ip: '192.168.1.1'
      });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Security Event:',
        expect.objectContaining({
          event: 'SUSPICIOUS_LOGIN',
          email: 'test@example.com',
          ip: '192.168.1.1',
          timestamp: expect.any(String)
        })
      );
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('Rate Limiting Tests', () => {
    
    test('should enforce rate limits', () => {
      const { ClientRateLimiter } = require('../utils/securityUtils');
      const limiter = new ClientRateLimiter();
      
      // Allow first 3 requests
      expect(limiter.isAllowed('test-endpoint', 3, 60000)).toBe(true);
      expect(limiter.isAllowed('test-endpoint', 3, 60000)).toBe(true);
      expect(limiter.isAllowed('test-endpoint', 3, 60000)).toBe(true);
      
      // Block 4th request
      expect(limiter.isAllowed('test-endpoint', 3, 60000)).toBe(false);
    });
    
    test('should reset rate limit after time window', () => {
      const { ClientRateLimiter } = require('../utils/securityUtils');
      const limiter = new ClientRateLimiter();
      
      // Fill up the limit
      limiter.isAllowed('test-endpoint', 1, 100); // 100ms window
      
      // Should be blocked
      expect(limiter.isAllowed('test-endpoint', 1, 100)).toBe(false);
      
      // Wait for window to reset
      return new Promise(resolve => {
        setTimeout(() => {
          expect(limiter.isAllowed('test-endpoint', 1, 100)).toBe(true);
          resolve();
        }, 150);
      });
    });
  });
});

// Integration test helpers
class SecurityTestHelper {
  /**
   * Test XSS vulnerability in a component
   */
  static testXSSVulnerability(renderFunction, inputSelector, outputSelector) {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src="x" onerror="alert(1)">',
      '"><script>alert(1)</script>',
      '<svg onload="alert(1)">'
    ];
    
    return xssPayloads.map(payload => {
      const component = renderFunction();
      const input = component.querySelector(inputSelector);
      const output = component.querySelector(outputSelector);
      
      // Simulate user input
      input.value = payload;
      input.dispatchEvent(new Event('input'));
      
      // Check if XSS payload is properly escaped
      return {
        payload,
        isVulnerable: output.innerHTML.includes('<script>') || output.innerHTML.includes('onerror')
      };
    });
  }
  
  /**
   * Test CSRF protection
   */
  static async testCSRFProtection(apiEndpoint, requestData) {
    // Try request without CSRF token
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      // Should fail with 403 if CSRF protection is working
      return response.status === 403;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Test SQL injection (for backend testing)
   */
  static getSQLInjectionPayloads() {
    return [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --",
      "1'; UPDATE users SET password='hacked' WHERE id=1; --"
    ];
  }
}

module.exports = { SecurityTestHelper };