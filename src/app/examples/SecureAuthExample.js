/**
 * Secure Authentication Example Component
 * 
 * This component demonstrates secure authentication practices:
 * - Password validation
 * - Secure token management
 * - Session handling
 * - Error handling
 */

'use client'

import React, { useState } from 'react'
import { sanitizeInput, validate } from '../../lib/sanitize'
import { useSecureRequest } from '../../lib/apiClient'
import { handleClientError } from '../../lib/errorHandler'
import { 
  TextField, 
  Button, 
  Box, 
  Alert, 
  Typography, 
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Paper
} from '@mui/material'
import { Visibility, VisibilityOff, Security, Info } from '@mui/icons-material'

export default function SecureAuthExample() {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const { makeRequest, loading, error } = useSecureRequest()

  /**
   * Validate form data
   * @returns {Object} - Validation errors
   */
  const validateForm = () => {
    const newErrors = {}

    // Validate email
    if (!validate.email(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate password
    const passwordValidation = validate.password(formData.password)
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors.join(', ')
    }

    // For registration mode
    if (mode === 'register') {
      // Validate name
      if (!validate.text(formData.name, 2, 50)) {
        newErrors.name = 'Name must be 2-50 characters long'
      }

      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    return newErrors
  }

  /**
   * Handle form input changes with sanitization
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Sanitize input based on field type
    let sanitizedValue = value
    
    switch (name) {
      case 'email':
        sanitizedValue = value.toLowerCase().trim()
        break
      case 'name':
        sanitizedValue = sanitizeInput.text(value)
        break
      case 'password':
      case 'confirmPassword':
        // Don't sanitize passwords, just validate
        sanitizedValue = value
        break
      default:
        break
    }

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)

    // Validate form
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Prepare data for API
    const apiData = {
      email: sanitizeInput.email(formData.email),
      password: formData.password
    }

    if (mode === 'register') {
      apiData.name = sanitizeInput.text(formData.name)
    }

    try {
      // Make secure API request
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(apiData)
      })

      setSuccess(true)
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
      })
      setErrors({})

      // Handle successful authentication
      if (response.token) {
        // Token is automatically stored by the API client
        console.log('Authentication successful')
      }
    } catch (err) {
      const handledError = handleClientError(err)
      console.error('Authentication failed:', handledError)
    }
  }

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  /**
   * Switch between login and register modes
   */
  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    })
    setErrors({})
    setSuccess(false)
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Security sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Secure Authentication
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          This form demonstrates secure authentication with password validation,
          token management, and secure communication.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {mode === 'login' ? 'Login successful!' : 'Registration successful!'}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              required
              inputProps={{
                maxLength: 50
              }}
            />
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            required
            inputProps={{
              maxLength: 100
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {mode === 'register' && (
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              required
            />
          )}

          <Box sx={{ mt: 3, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                mode === 'login' ? 'Login' : 'Register'
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </Typography>
            <Button
              variant="text"
              color="primary"
              onClick={switchMode}
              sx={{ mt: 1 }}
            >
              {mode === 'login' ? 'Register' : 'Login'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.main', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Info sx={{ mr: 1, color: 'white' }} />
            <Typography variant="subtitle2" color="white">
              Security Features:
            </Typography>
          </Box>
          <Typography variant="body2" color="white">
            • Password strength validation
            <br />
            • Secure token storage
            <br />
            • Input sanitization
            <br />
            • Rate limiting protection
            <br />
            • Automatic token refresh
            <br />
            • Secure session management
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}