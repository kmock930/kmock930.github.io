/**
 * Security Examples Page
 * 
 * This page showcases all security features and best practices
 * implemented in the secure communication layer.
 */

'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  ExpandMore,
  Security,
  Shield,
  Lock,
  VerifiedUser,
  HttpsIcon,
  BugReport,
  Code,
  CheckCircle
} from '@mui/icons-material'

import SecureContactForm from './SecureContactForm'
import SecureAuthExample from './SecureAuthExample'

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`security-tabpanel-${index}`}
      aria-labelledby={`security-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function SecurityExamplesPage() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const securityFeatures = [
    {
      icon: <HttpsIcon />,
      title: 'HTTPS Implementation',
      description: 'Force HTTPS in production with security headers'
    },
    {
      icon: <Shield />,
      title: 'Input Validation',
      description: 'Comprehensive client and server-side validation'
    },
    {
      icon: <Lock />,
      title: 'Data Sanitization',
      description: 'Sanitize all user inputs to prevent XSS attacks'
    },
    {
      icon: <VerifiedUser />,
      title: 'Authentication',
      description: 'Secure JWT-based authentication with token refresh'
    },
    {
      icon: <Security />,
      title: 'Rate Limiting',
      description: 'Protect against abuse and DDoS attacks'
    },
    {
      icon: <BugReport />,
      title: 'Error Handling',
      description: 'Secure error responses without information leakage'
    }
  ]

  const vulnerabilityPrevention = [
    {
      vulnerability: 'Cross-Site Scripting (XSS)',
      prevention: 'Input sanitization, output encoding, CSP headers'
    },
    {
      vulnerability: 'Cross-Site Request Forgery (CSRF)',
      prevention: 'CSRF tokens, SameSite cookies, origin validation'
    },
    {
      vulnerability: 'SQL Injection',
      prevention: 'Parameterized queries, input validation'
    },
    {
      vulnerability: 'Man-in-the-Middle',
      prevention: 'HTTPS enforcement, HSTS headers'
    },
    {
      vulnerability: 'Session Hijacking',
      prevention: 'Secure cookies, session timeout, token rotation'
    },
    {
      vulnerability: 'Brute Force Attacks',
      prevention: 'Rate limiting, account lockout, strong passwords'
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Secure Communication Layer
        </Typography>
        <Typography variant="h5" color="text.secondary" align="center" paragraph>
          Complete security implementation guide and examples
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body1">
          This page demonstrates a comprehensive secure communication layer implementation 
          with practical examples and best practices for web applications.
        </Typography>
      </Alert>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ p: 3, pb: 2 }}>
          <Security sx={{ mr: 2, verticalAlign: 'middle' }} />
          Security Features Overview
        </Typography>
        <Box sx={{ px: 3, pb: 3 }}>
          <List>
            {securityFeatures.map((feature, index) => (
              <ListItem key={index}>
                <ListItemIcon>{feature.icon}</ListItemIcon>
                <ListItemText
                  primary={feature.title}
                  secondary={feature.description}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Contact Form Example" />
            <Tab label="Authentication Example" />
            <Tab label="Security Guide" />
            <Tab label="Implementation Details" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <SecureContactForm />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <SecureAuthExample />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Security Implementation Guide
          </Typography>
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">1. HTTPS Setup</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Always use HTTPS in production to encrypt data in transit:
              </Typography>
              <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                {`// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ]
  }
}`}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">2. Input Validation</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Always validate and sanitize user input on both client and server:
              </Typography>
              <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                {`// Client-side validation
const sanitizedData = {
  name: sanitizeInput.text(formData.name),
  email: sanitizeInput.email(formData.email),
  message: sanitizeInput.text(formData.message)
}`}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">3. Authentication</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Implement secure authentication with JWT tokens:
              </Typography>
              <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                {`// JWT implementation
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '1h',
  issuer: 'your-app',
  audience: 'your-users'
})`}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">4. Rate Limiting</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Protect your APIs from abuse with rate limiting:
              </Typography>
              <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                {`// Rate limiting middleware
export const rateLimiter = (limit = 10) => {
  return (req, res, next) => {
    const ip = req.ip
    const key = \`\${ip}:\${req.url}\`
    // Implementation...
  }
}`}
              </Box>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Vulnerability Prevention
          </Typography>
          
          <List>
            {vulnerabilityPrevention.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.vulnerability}
                    secondary={item.prevention}
                  />
                </ListItem>
                {index < vulnerabilityPrevention.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Additional Resources
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><Code /></ListItemIcon>
                <ListItemText 
                  primary="Security Documentation" 
                  secondary="Complete security guide in docs/SECURITY.md"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Code /></ListItemIcon>
                <ListItemText 
                  primary="Utility Libraries" 
                  secondary="Security utilities in src/lib/ directory"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Code /></ListItemIcon>
                <ListItemText 
                  primary="Example Components" 
                  secondary="Secure component examples in src/app/examples/"
                />
              </ListItem>
            </List>
          </Box>
        </TabPanel>
      </Paper>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Implementation Checklist
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircle sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="HTTPS enforcement with security headers" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Input validation and sanitization utilities" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Secure API client with retry logic" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Error handling without information leakage" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Authentication with JWT tokens" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Rate limiting protection" />
          </ListItem>
        </List>
      </Box>
    </Container>
  )
}