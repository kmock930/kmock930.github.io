import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText, Alert } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ApiIcon from '@mui/icons-material/Api';
import HttpsIcon from '@mui/icons-material/Https';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function SecurityOverview() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h3" component="h1">
          Secure Communication Layer
        </Typography>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This section provides comprehensive guidance for developers on implementing secure communication between frontend and backend systems.
      </Alert>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Overview
        </Typography>
        <Typography variant="body1" paragraph>
          Secure communication between frontend and backend applications is crucial for protecting user data, 
          preventing unauthorized access, and maintaining the integrity of your application. This guide covers 
          essential security practices that every developer should implement.
        </Typography>
        <Typography variant="body1" paragraph>
          As a developer with limited security experience, you&apos;ll learn practical techniques for:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Implementing secure API communication patterns" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Setting up HTTPS and proper SSL/TLS configuration" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Sanitizing and validating data to prevent attacks" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Following security best practices and avoiding common vulnerabilities" />
          </ListItem>
        </List>
      </Paper>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <ApiIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
            <Typography variant="h5">API Security</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Learn how to secure your API endpoints with proper authentication, authorization, 
            rate limiting, and input validation techniques.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Topics: JWT tokens, OAuth 2.0, API keys, request validation, error handling
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <HttpsIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
            <Typography variant="h5">HTTPS Implementation</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Understand how to properly implement HTTPS, manage SSL certificates, 
            and configure security headers for your applications.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Topics: SSL/TLS setup, certificate management, HSTS, CSP headers
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <FilterAltIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
            <Typography variant="h5">Data Sanitization</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Master the techniques for sanitizing user input, encoding output, 
            and preventing common injection attacks like XSS and SQL injection.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Topics: Input validation, output encoding, XSS prevention, SQL injection protection
          </Typography>
        </Paper>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mt: 3, bgcolor: 'warning.light' }}>
        <Typography variant="h5" gutterBottom>
          Security First Mindset
        </Typography>
        <Typography variant="body1">
          Security should be built into your application from the ground up, not added as an afterthought. 
          The examples and patterns in this guide demonstrate how to integrate security considerations 
          into your development workflow from day one.
        </Typography>
      </Paper>
    </Container>
  );
}