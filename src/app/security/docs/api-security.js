import React from 'react';
import { Container, Typography, Paper, Box, Alert, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeBlock from '../components/CodeBlock';

export default function ApiSecurity() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        API Security Guidelines
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        API security is critical for protecting your application and user data. Implement multiple layers of security.
      </Alert>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Authentication & Authorization</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Always authenticate users and authorize access to resources. Never trust client-side validation alone.
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>JWT Token Implementation</Typography>
            <CodeBlock language="javascript" code={`// Frontend: Secure API call with JWT
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    throw new Error(\`API Error: \${response.status}\`);
  }

  return response.json();
};

// Usage example
try {
  const userData = await apiCall('/api/user/profile');
  console.log(userData);
} catch (error) {
  console.error('Failed to fetch user data:', error);
}`} />
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Backend Token Validation</Typography>
            <CodeBlock language="javascript" code={`// Backend: JWT middleware validation
const jwt = require('jsonwebtoken');

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

// Protected route example
app.get('/api/user/profile', authenticateToken, (req, res) => {
  // User is authenticated, req.user contains user info
  res.json({ 
    id: req.user.id, 
    email: req.user.email 
  });
});`} />
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Input Validation & Sanitization</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Always validate and sanitize user input on both client and server sides.
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Frontend Input Validation</Typography>
            <CodeBlock language="javascript" code={`// Frontend validation utility
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\\//g, '&#x2F;');
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
};

// React form validation example
const ContactForm = () => {
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const sanitizedData = {
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message)
    };
    
    try {
      await apiCall('/api/contact', {
        method: 'POST',
        body: JSON.stringify(sanitizedData)
      });
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };
};`} />
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Backend Validation with Joi</Typography>
            <CodeBlock language="javascript" code={`const Joi = require('joi');

// Define validation schemas
const contactSchema = Joi.object({
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(1000).required(),
  name: Joi.string().alphanum().min(2).max(50).optional()
});

// Validation middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

// Usage in route
app.post('/api/contact', 
  validateInput(contactSchema),
  (req, res) => {
    // Input is validated and safe to process
    const { email, message, name } = req.body;
    
    // Additional server-side sanitization if needed
    const sanitizedMessage = DOMPurify.sanitize(message);
    
    // Process the request...
    res.json({ success: true });
  }
);`} />
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Rate Limiting & Protection</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Implement rate limiting to prevent abuse and DDoS attacks.
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Express Rate Limiting</Typography>
            <CodeBlock language="javascript" code={`const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

app.use(limiter);
app.use('/api/auth', authLimiter);
app.use(helmet()); // Security headers

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  optionsSuccessStatus: 200
}));`} />
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Error Handling & Logging</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Proper error handling prevents information disclosure while maintaining good user experience.
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Secure Error Handling</Typography>
            <CodeBlock language="javascript" code={`// Frontend error handling
const handleApiError = (error, showUserMessage = true) => {
  // Log error details for debugging (remove in production)
  console.error('API Error:', error);
  
  let userMessage = 'An unexpected error occurred. Please try again.';
  
  if (error.status === 400) {
    userMessage = 'Please check your input and try again.';
  } else if (error.status === 401) {
    userMessage = 'Please log in to continue.';
    // Redirect to login
  } else if (error.status === 403) {
    userMessage = 'You do not have permission to perform this action.';
  } else if (error.status === 429) {
    userMessage = 'Too many requests. Please wait before trying again.';
  }
  
  if (showUserMessage) {
    // Show user-friendly message (using your preferred notification system)
    showNotification(userMessage, 'error');
  }
  
  return { userMessage, originalError: error };
};

// Backend error handling middleware
app.use((error, req, res, next) => {
  // Log error details for monitoring
  console.error('Server Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Don't leak sensitive information
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(isDevelopment && { stack: error.stack })
  });
});`} />
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="h6">Key Takeaways</Typography>
        <Typography variant="body2">
          • Always authenticate and authorize on the server side<br />
          • Validate and sanitize all input data<br />
          • Implement rate limiting for all public endpoints<br />
          • Use secure error handling that doesn&apos;t leak sensitive information<br />
          • Regularly update dependencies and monitor for vulnerabilities
        </Typography>
      </Alert>
    </Container>
  );
}