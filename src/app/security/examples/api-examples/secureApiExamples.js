/**
 * Backend API Security Examples
 * 
 * These examples demonstrate secure API implementations
 * for common use cases with proper validation, sanitization,
 * and security measures.
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true,
});

app.use(generalLimiter);
app.use('/api/auth', authLimiter);

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  const DOMPurify = require('isomorphic-dompurify');
  
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj, { 
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
      }).trim();
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
  
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
};

// Validation schemas
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces')
];

const contactValidation = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
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

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// EXAMPLE 1: User Registration with Security
app.post('/api/auth/register',
  sanitizeInput,
  registerValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create user
      const user = await createUser({
        email,
        password: hashedPassword,
        name,
        createdAt: new Date(),
        isVerified: false
      });
      
      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// EXAMPLE 2: Secure Login
app.post('/api/auth/login',
  sanitizeInput,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Get user
      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// EXAMPLE 3: Protected Route
app.get('/api/user/profile',
  authenticateToken,
  async (req, res) => {
    try {
      const user = await getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      });
      
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// EXAMPLE 4: Contact Form with Security
app.post('/api/contact',
  sanitizeInput,
  contactValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, message, website } = req.body;
      
      // Additional security checks
      const blockedDomains = ['tempmail.com', '10minutemail.com'];
      const emailDomain = email.split('@')[1];
      
      if (blockedDomains.includes(emailDomain)) {
        return res.status(400).json({ error: 'Email domain not allowed' });
      }
      
      // Spam detection
      const spamPatterns = [
        /viagra/i, /casino/i, /lottery/i, /winner/i,
        /congratulations/i, /million dollars/i
      ];
      
      const content = `${name} ${message}`;
      if (spamPatterns.some(pattern => pattern.test(content))) {
        console.log('Potential spam detected:', { email, name, ip: req.ip });
        return res.status(400).json({ error: 'Message appears to be spam' });
      }
      
      // Store message
      const contactMessage = await saveContactMessage({
        name,
        email,
        message,
        website,
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      res.json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        id: contactMessage.id
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// EXAMPLE 5: File Upload with Security
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

app.post('/api/upload',
  authenticateToken,
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Additional security: scan file content if needed
    // const fileContent = fs.readFileSync(req.file.path);
    // if (containsMaliciousContent(fileContent)) {
    //   fs.unlinkSync(req.file.path);
    //   return res.status(400).json({ error: 'File rejected' });
    // }
    
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  }
);

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(isDevelopment && { stack: error.stack })
  });
});

// Database functions (implement with your preferred database)
async function getUserByEmail(email) {
  // Implement with your database
  // Example with PostgreSQL:
  // const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  // return result.rows[0];
}

async function getUserById(id) {
  // Implement with your database
}

async function createUser(userData) {
  // Implement with your database
}

async function saveContactMessage(messageData) {
  // Implement with your database
}

module.exports = app;