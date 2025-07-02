import React from 'react';
import { Container, Typography, Paper, Box, Alert, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeBlock from '../components/CodeBlock';

export default function HttpsImplementation() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        HTTPS Implementation Guide
      </Typography>
      
      <Alert severity="error" sx={{ mb: 3 }}>
        <strong>Never serve a production application over HTTP.</strong> HTTPS is essential for protecting user data and maintaining trust.
      </Alert>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">SSL/TLS Certificate Setup</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Setting up SSL certificates is the first step to enabling HTTPS. Here are common approaches:
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Production Setup with Let&apos;s Encrypt (Free)</Typography>
            <CodeBlock code={`# Install Certbot for automatic SSL certificate management
sudo apt update
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Create symbolic link
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get certificate for your domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Automatic renewal (add to crontab)
0 12 * * * /usr/bin/certbot renew --quiet`} language="bash" />
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Nginx Configuration with SSL</Typography>
            <CodeBlock code={`# /etc/nginx/sites-available/yourdomain.com
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL certificate paths (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    # Proxy to your application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`} language="nginx" />
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Development Setup with mkcert</Typography>
            <CodeBlock code={`# Install mkcert for local development
brew install mkcert # macOS
# or
sudo apt install libnss3-tools && wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64 && chmod +x mkcert && sudo mv mkcert /usr/local/bin/

# Create a local CA
mkcert -install

# Generate certificates for localhost
mkcert localhost 127.0.0.1 ::1

# This creates localhost.pem and localhost-key.pem`} language="bash" />
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Next.js with Custom Server for HTTPS</Typography>
            <CodeBlock code={`// server.js - Custom Next.js server with HTTPS
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3443;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost-key.pem'),
  cert: fs.readFileSync('./certificates/localhost.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(\`> Ready on https://\${hostname}:\${port}\`);
  });
});

// package.json script
// "dev:https": "node server.js"`} />
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Security Headers Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Security headers provide additional protection against various attacks. Here&apos;s how to implement them:
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Next.js Security Headers</Typography>
            <CodeBlock code={`// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self'; frame-ancestors 'self';"
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;`} />
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Express.js Security Headers with Helmet</Typography>
            <CodeBlock code={`const express = require('express');
const helmet = require('helmet');

const app = express();

// Use Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
}));

// Additional custom headers
app.use((req, res, next) => {
  res.setHeader('X-API-Version', '1.0');
  res.setHeader('X-Powered-By', 'Custom-Server'); // Override default
  next();
});`} />
          </Paper>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Security Headers Explanation:</strong><br />
              • <strong>HSTS:</strong> Forces HTTPS connections<br />
              • <strong>X-Frame-Options:</strong> Prevents clickjacking<br />
              • <strong>X-Content-Type-Options:</strong> Prevents MIME sniffing<br />
              • <strong>CSP:</strong> Prevents XSS attacks<br />
              • <strong>Referrer-Policy:</strong> Controls referrer information
            </Typography>
          </Alert>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Certificate Management & Monitoring</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Proper certificate management ensures your HTTPS setup remains secure and functional.
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Certificate Monitoring Script</Typography>
            <CodeBlock code={`#!/bin/bash
# check-ssl.sh - Monitor SSL certificate expiration

DOMAIN="yourdomain.com"
DAYS_BEFORE_EXPIRY=30

# Get certificate expiration date
EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep 'notAfter' | cut -d= -f2)

# Convert to epoch time
EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_EPOCH=$(date +%s)

# Calculate days until expiry
DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))

echo "SSL certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRY days"

if [ $DAYS_UNTIL_EXPIRY -lt $DAYS_BEFORE_EXPIRY ]; then
    echo "WARNING: Certificate expires soon!"
    # Send alert (email, Slack, etc.)
    # curl -X POST -H 'Content-type: application/json' --data '{"text":"SSL certificate for '$DOMAIN' expires in '$DAYS_UNTIL_EXPIRY' days!"}' YOUR_SLACK_WEBHOOK_URL
fi

# Add to crontab to run daily:
# 0 9 * * * /path/to/check-ssl.sh`} language="bash" />
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Health Check Endpoint</Typography>
            <CodeBlock code={`// API route for SSL/security health check
// pages/api/health/ssl.js or app/api/health/ssl/route.js

export async function GET(request) {
  const checks = {
    timestamp: new Date().toISOString(),
    ssl: {
      enabled: request.url.startsWith('https://'),
      headers: {
        hsts: request.headers.get('strict-transport-security') !== null,
        csp: request.headers.get('content-security-policy') !== null,
        xframe: request.headers.get('x-frame-options') !== null,
      }
    },
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION || '1.0.0'
  };

  return Response.json({
    status: 'healthy',
    checks,
    security: {
      httpsRedirect: checks.ssl.enabled,
      securityHeaders: Object.values(checks.ssl.headers).every(h => h),
      recommendations: generateRecommendations(checks)
    }
  });
}

function generateRecommendations(checks) {
  const recommendations = [];
  
  if (!checks.ssl.enabled) {
    recommendations.push('Enable HTTPS for all traffic');
  }
  
  if (!checks.ssl.headers.hsts) {
    recommendations.push('Add HSTS header for better security');
  }
  
  if (!checks.ssl.headers.csp) {
    recommendations.push('Implement Content Security Policy');
  }
  
  return recommendations;
}`} />
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="h6">HTTPS Checklist</Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="✓ SSL certificate installed and valid" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✓ HTTP to HTTPS redirect configured" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✓ Security headers implemented" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✓ Certificate auto-renewal configured" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✓ SSL/TLS configuration tested and optimized" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✓ Monitoring and alerting set up" />
          </ListItem>
        </List>
      </Alert>
    </Container>
  );
}