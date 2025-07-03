'use client'

import React from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isDevelopment) {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }

    // In production, you would send this to an error reporting service
    // reportErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error)
      }

      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" paragraph>
              We're sorry, but something unexpected happened.
            </Typography>
            <Button 
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Reload Page
            </Button>
          </Alert>
        </Box>
      )
    }

    return this.props.children
  }
}