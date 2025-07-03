import React from 'react';
import { Container, Typography, Paper, Box, Alert, List, ListItem, ListItemText, Chip, Divider, Grid } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CodeBlock from '../components/CodeBlock';

export default function BestPractices() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h3" component="h1">
          Security Best Practices
        </Typography>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Following these best practices will significantly improve your application&apos;s security posture.
      </Alert>

      <Grid container spacing={3}>
        {/* Frontend Best Practices */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Frontend Security
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                Do&apos;s
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Always validate and sanitize user input" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Use HTTPS for all communications" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Implement Content Security Policy (CSP)" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Store sensitive data securely (not in localStorage)" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Use secure HTTP headers" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Implement proper error handling" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Regular dependency updates" />
                </ListItem>
              </List>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                Don&apos;ts
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Never trust client-side validation alone" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Don't expose sensitive information in client-side code" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Don't use innerHTML with user-generated content" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Don't store passwords or tokens in plain text" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Don't ignore security warnings from tools" />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Backend Best Practices */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Backend Security
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                Do&apos;s
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Use parameterized queries for database operations" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Implement proper authentication and authorization" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Use rate limiting on all endpoints" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Validate all input on the server side" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Use secure session management" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Log security events for monitoring" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Keep dependencies up to date" />
                </ListItem>
              </List>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                Don&apos;ts
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Never concatenate SQL queries with user input" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Don't expose detailed error messages to users" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Don't store passwords in plain text" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Don't trust any data from the client" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Don't use default credentials" />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Security Implementation Checklist */}
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Security Implementation Checklist
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Authentication & Authorization</Typography>
            <List dense>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="JWT token implementation" />
              </ListItem>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="Password hashing (bcrypt)" />
              </ListItem>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="Session management" />
              </ListItem>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="Role-based access control" />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Data Protection</Typography>
            <List dense>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="Input validation & sanitization" />
              </ListItem>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="SQL injection prevention" />
              </ListItem>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="XSS protection" />
              </ListItem>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="CSRF protection" />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Infrastructure</Typography>
            <List dense>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="HTTPS configuration" />
              </ListItem>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="Security headers" />
              </ListItem>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="Rate limiting" />
              </ListItem>
              <ListItem>
                <Chip size="small" label="TODO" color="warning" sx={{ mr: 1 }} />
                <ListItemText primary="Security monitoring" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Code Examples */}
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quick Reference Code Examples
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Secure API Request</Typography>
          <CodeBlock code={`// Secure API request with error handling
import { SecureApiClient, ErrorHandler } from './security/utils/securityUtils';

const api = new SecureApiClient('https://api.yourdomain.com');

const submitForm = async (formData) => {
  try {
    // Validate and sanitize data before sending
    const validatedData = validateFormData(formData);
    const response = await api.post('/contact', validatedData);
    
    return { success: true, data: response };
  } catch (error) {
    const errorInfo = ErrorHandler.handleApiError(error);
    return { success: false, error: errorInfo.userMessage };
  }
};`} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Input Sanitization</Typography>
          <CodeBlock code={`// Comprehensive input sanitization
import { InputSanitizer, InputValidator } from './security/utils/securityUtils';

const sanitizeUserInput = (input, type = 'text') => {
  switch (type) {
    case 'email':
      return InputSanitizer.sanitizeEmail(input);
    case 'url':
      return InputSanitizer.sanitizeUrl(input);
    case 'html':
      return InputSanitizer.sanitizeString(input, {
        removeScripts: true,
        removeHtml: true
      });
    default:
      return InputSanitizer.sanitizeString(input, {
        removeScripts: true,
        maxLength: 1000
      });
  }
};

// Validate before processing
if (InputValidator.isEmail(email) && InputValidator.hasMinLength(message, 10)) {
  // Process the validated data
}`} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Secure Backend Route</Typography>
          <CodeBlock code={`// Express.js secure route with validation
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

app.post('/api/contact',
  contactLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('message').isLength({ min: 10, max: 1000 }).trim().escape(),
    body('name').isLength({ min: 2, max: 50 }).trim().escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    // Process validated data
    processContactForm(req.body);
    res.json({ success: true });
  }
);`} />
        </Box>
      </Paper>

      {/* Security Testing */}
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Security Testing Guidelines
        </Typography>
        
        <Typography variant="body1" paragraph>
          Regular security testing is crucial for maintaining a secure application. Here are key areas to focus on:
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Automated Security Testing</Typography>
          <CodeBlock code={`// Example security tests
describe('Security Tests', () => {
  test('should prevent XSS attacks', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).not.toContain('<script>');
  });
  
  test('should validate email format', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });
  
  test('should enforce rate limits', async () => {
    // Test rate limiting implementation
    const responses = await Promise.all([
      makeRequest('/api/test'),
      makeRequest('/api/test'),
      makeRequest('/api/test')
    ]);
    
    expect(responses[2].status).toBe(429); // Too Many Requests
  });
});`} />
        </Box>

        <Typography variant="h6" gutterBottom>Manual Testing Checklist</Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="XSS Testing" 
              secondary="Try injecting scripts in form fields and URL parameters"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="SQL Injection Testing" 
              secondary="Test with SQL injection payloads in input fields"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Authentication Testing" 
              secondary="Verify token expiration and unauthorized access prevention"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Authorization Testing" 
              secondary="Ensure users can only access resources they're permitted to"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Rate Limiting Testing" 
              secondary="Verify that rate limits are enforced correctly"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Resources */}
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Security Resources & Tools
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Learning Resources</Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="OWASP Top 10" 
                  secondary="Essential security risks every developer should know"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="OWASP Cheat Sheets" 
                  secondary="Quick reference guides for secure coding"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Mozilla Web Security Guidelines" 
                  secondary="Comprehensive web security best practices"
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Security Tools</Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="OWASP ZAP" 
                  secondary="Free web application security scanner"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Snyk" 
                  secondary="Vulnerability scanning for dependencies"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="SecurityHeaders.com" 
                  secondary="Analyze your security headers configuration"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="h6">Remember</Typography>
        <Typography variant="body2">
          Security is not a one-time implementation but an ongoing process. Regularly review and update your security measures, 
          stay informed about new vulnerabilities, and always follow the principle of least privilege.
        </Typography>
      </Alert>
    </Container>
  );
}