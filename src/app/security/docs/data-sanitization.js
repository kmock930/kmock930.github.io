import React from 'react';
import { Container, Typography, Paper, Box, Alert, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeBlock from '../components/CodeBlock';

export default function DataSanitization() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Data Sanitization Guide
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        <strong>Never trust user input!</strong> Always sanitize and validate data on both client and server sides.
      </Alert>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Common Threats</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="XSS (Cross-Site Scripting)" color="error" />
          <Chip label="SQL Injection" color="error" />
          <Chip label="NoSQL Injection" color="error" />
          <Chip label="LDAP Injection" color="error" />
          <Chip label="Command Injection" color="error" />
          <Chip label="Path Traversal" color="error" />
        </Box>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Input Sanitization (Frontend)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Client-side sanitization improves user experience but should never be the only line of defense.
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Comprehensive Input Sanitization Utility</Typography>
            <CodeBlock code={`// utils/sanitization.js
export class InputSanitizer {
  // HTML entity encoding to prevent XSS
  static escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\\//g, "&#x2F;");
  }

  // Remove potentially dangerous characters
  static sanitizeString(input, options = {}) {
    if (typeof input !== 'string') return input;
    
    let sanitized = input.trim();
    
    if (options.removeHtml) {
      // Remove HTML tags
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    }
    
    if (options.removeScripts) {
      // Remove script tags and javascript: protocols
      sanitized = sanitized.replace(/<script[^>]*>.*?<\\/script>/gi, '');
      sanitized = sanitized.replace(/javascript:/gi, '');
      sanitized = sanitized.replace(/on\\w+\\s*=/gi, '');
    }
    
    if (options.alphanumericOnly) {
      // Keep only alphanumeric characters and basic punctuation
      sanitized = sanitized.replace(/[^a-zA-Z0-9\\s.,!?-]/g, '');
    }
    
    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }
    
    return sanitized;
  }

  // Sanitize email addresses
  static sanitizeEmail(email) {
    if (typeof email !== 'string') return '';
    
    return email
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9@._-]/g, '');
  }

  // Sanitize URLs
  static sanitizeUrl(url) {
    if (typeof url !== 'string') return '';
    
    // Remove dangerous protocols
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

  // Sanitize phone numbers
  static sanitizePhone(phone) {
    if (typeof phone !== 'string') return '';
    
    return phone.replace(/[^0-9+\\s()-]/g, '');
  }

  // Deep sanitize objects
  static sanitizeObject(obj, options = {}) {
    if (obj === null || typeof obj !== 'object') {
      return typeof obj === 'string' ? this.sanitizeString(obj, options) : obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, options));
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = this.sanitizeString(key, { alphanumericOnly: true });
      sanitized[sanitizedKey] = this.sanitizeObject(value, options);
    }
    
    return sanitized;
  }
}

// Validation utilities
export class InputValidator {
  static isEmail(email) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
  }
  
  static isUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  static isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
  }
  
  static hasMinLength(str, min) {
    return typeof str === 'string' && str.length >= min;
  }
  
  static hasMaxLength(str, max) {
    return typeof str === 'string' && str.length <= max;
  }
}`} />
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>React Form with Sanitization</Typography>
            <CodeBlock code={`// components/SecureForm.jsx
import React, { useState } from 'react';
import { InputSanitizer, InputValidator } from '../utils/sanitization';

const SecureContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Real-time sanitization and validation
    let sanitizedValue = value;
    let error = '';
    
    switch (name) {
      case 'name':
        sanitizedValue = InputSanitizer.sanitizeString(value, {
          removeHtml: true,
          removeScripts: true,
          maxLength: 50
        });
        if (!InputValidator.hasMinLength(sanitizedValue, 2)) {
          error = 'Name must be at least 2 characters';
        }
        break;
        
      case 'email':
        sanitizedValue = InputSanitizer.sanitizeEmail(value);
        if (sanitizedValue && !InputValidator.isEmail(sanitizedValue)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'message':
        sanitizedValue = InputSanitizer.sanitizeString(value, {
          removeScripts: true,
          maxLength: 1000
        });
        if (!InputValidator.hasMinLength(sanitizedValue, 10)) {
          error = 'Message must be at least 10 characters';
        }
        break;
        
      case 'website':
        if (value) {
          sanitizedValue = InputSanitizer.sanitizeUrl(value);
          if (sanitizedValue && !InputValidator.isUrl(sanitizedValue)) {
            error = 'Please enter a valid URL';
          }
        }
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Final validation
    const validationErrors = {};
    
    if (!InputValidator.hasMinLength(formData.name, 2)) {
      validationErrors.name = 'Name is required';
    }
    
    if (!InputValidator.isEmail(formData.email)) {
      validationErrors.email = 'Valid email is required';
    }
    
    if (!InputValidator.hasMinLength(formData.message, 10)) {
      validationErrors.message = 'Message must be at least 10 characters';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    // Deep sanitize before sending
    const sanitizedData = InputSanitizer.sanitizeObject(formData, {
      removeHtml: true,
      removeScripts: true
    });
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData)
      });
      
      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '', website: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Your Name"
          required
        />
        {errors.name && <span style={{color: 'red'}}>{errors.name}</span>}
      </div>
      
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Your Email"
          required
        />
        {errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
      </div>
      
      <div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Your Message"
          required
        />
        {errors.message && <span style={{color: 'red'}}>{errors.message}</span>}
      </div>
      
      <div>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="Your Website (optional)"
        />
        {errors.website && <span style={{color: 'red'}}>{errors.website}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default SecureContactForm;`} />
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Server-Side Sanitization & Validation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Server-side validation is your last line of defense and should be comprehensive and strict.
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Express.js with Comprehensive Validation</Typography>
            <CodeBlock code={`// Backend validation with multiple libraries
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');
const xss = require('xss');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// Custom sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Remove potential XSS
      let clean = xss(obj, {
        whiteList: {}, // No HTML allowed
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
      });
      
      // Additional cleaning
      clean = DOMPurify.sanitize(clean, { 
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
      });
      
      return clean.trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleanKey = key.replace(/[^a-zA-Z0-9_]/g, '');
        sanitized[cleanKey] = sanitize(value);
      }
      return sanitized;
    }
    
    return obj;
  };
  
  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  if (req.params) {
    req.params = sanitize(req.params);
  }
  
  next();
};

// Validation rules
const contactValidation = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
    
  body('message')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
    
  body('website')
    .optional({ checkFalsy: true })
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Must be a valid URL')
];

// Contact form endpoint
app.post('/api/contact', 
  sanitizeInput,
  contactValidation,
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const { name, email, message, website } = req.body;
    
    // Additional business logic validation
    const blockedDomains = ['tempmail.com', '10minutemail.com'];
    const emailDomain = email.split('@')[1];
    
    if (blockedDomains.includes(emailDomain)) {
      return res.status(400).json({
        error: 'Email domain not allowed'
      });
    }
    
    // Check for spam patterns
    const spamPatterns = [
      /viagra/i,
      /casino/i,
      /lottery/i,
      /winner/i
    ];
    
    const content = \`\${name} \${message}\`;
    if (spamPatterns.some(pattern => pattern.test(content))) {
      // Log potential spam attempt
      console.log('Potential spam detected:', { email, name });
      return res.status(400).json({
        error: 'Message appears to be spam'
      });
    }
    
    try {
      // Store in database (with parameterized queries)
      await saveContactMessage({
        name,
        email,
        message,
        website,
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      res.json({ success: true, message: 'Contact form submitted successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Database function with parameterized queries (PostgreSQL example)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
});

async function saveContactMessage(data) {
  const query = \`
    INSERT INTO contact_messages (name, email, message, website, timestamp, ip, user_agent)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  \`;
  
  const values = [
    data.name,
    data.email,
    data.message,
    data.website,
    data.timestamp,
    data.ip,
    data.userAgent
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}`} />
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Output Encoding & XSS Prevention</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            When displaying user-generated content, always encode output properly to prevent XSS attacks.
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Safe Content Rendering in React</Typography>
            <CodeBlock code={`// utils/contentRenderer.js
import DOMPurify from 'dompurify';

export class ContentRenderer {
  // For displaying HTML content safely
  static sanitizeHtml(dirty, options = {}) {
    const config = {
      ALLOWED_TAGS: options.allowedTags || ['p', 'br', 'strong', 'em', 'u'],
      ALLOWED_ATTR: options.allowedAttrs || [],
      ALLOW_DATA_ATTR: false,
      ...options
    };
    
    return DOMPurify.sanitize(dirty, config);
  }
  
  // For displaying plain text that might contain HTML
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // For rendering user comments or messages
  static renderUserContent(content, allowBasicFormatting = false) {
    if (!content) return '';
    
    if (allowBasicFormatting) {
      return this.sanitizeHtml(content, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
        ALLOWED_ATTR: []
      });
    }
    
    return this.escapeHtml(content);
  }
}

// React component for safe content display
const SafeContent = ({ content, allowHtml = false, className }) => {
  if (!content) return null;
  
  if (allowHtml) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{
          __html: ContentRenderer.sanitizeHtml(content)
        }}
      />
    );
  }
  
  // Safe text rendering (React automatically escapes)
  return <div className={className}>{content}</div>;
};

// User comment component
const UserComment = ({ comment }) => {
  return (
    <div className="comment">
      <div className="comment-author">
        {/* User name is automatically escaped by React */}
        {comment.author}
      </div>
      <div className="comment-content">
        <SafeContent 
          content={comment.content} 
          allowHtml={comment.allowFormatting}
        />
      </div>
      <div className="comment-meta">
        Posted on {new Date(comment.timestamp).toLocaleDateString()}
      </div>
    </div>
  );
};

export { SafeContent, UserComment };`} />
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Content Security Policy Implementation</Typography>
            <CodeBlock code={`// CSP configuration to prevent XSS
// next.config.js
const ContentSecurityPolicy = \`
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.yourdomain.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
\`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

// Alternative: CSP with nonce for inline scripts
export default function RootLayout({ children }) {
  const nonce = generateNonce(); // Generate unique nonce
  
  return (
    <html>
      <head>
        <meta 
          httpEquiv="Content-Security-Policy" 
          content={\`script-src 'self' 'nonce-\${nonce}'\`}
        />
      </head>
      <body>
        {children}
        <script nonce={nonce}>
          {/* Inline script with nonce */}
          console.log('Safe inline script');
        </script>
      </body>
    </html>
  );
}

function generateNonce() {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}`} />
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="h6">Data Sanitization Checklist</Typography>
        <Typography variant="body2">
          ✓ Validate all input on both client and server<br />
          ✓ Sanitize data before storing in database<br />
          ✓ Encode output when displaying user content<br />
          ✓ Use parameterized queries for database operations<br />
          ✓ Implement Content Security Policy<br />
          ✓ Regular security testing and updates<br />
          ✓ Monitor for unusual patterns and potential attacks
        </Typography>
      </Alert>
    </Container>
  );
}