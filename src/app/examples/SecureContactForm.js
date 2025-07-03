/**
 * Secure Contact Form Component
 * 
 * This component demonstrates secure form handling with:
 * - Input validation and sanitization
 * - Secure API communication
 * - Error handling
 * - Loading states
 */

'use client'

import React, { useState } from 'react'
import { sanitizeInput, validate } from '../../lib/sanitize'
import { useSecureRequest } from '../../lib/apiClient'
import { handleClientError } from '../../lib/errorHandler'
import { TextField, Button, Box, Alert, Typography, CircularProgress } from '@mui/material'

export default function SecureContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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

    // Validate name
    if (!validate.text(formData.name, 2, 50)) {
      newErrors.name = 'Name must be 2-50 characters long'
    }

    // Validate email
    if (!validate.email(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate subject
    if (!validate.text(formData.subject, 5, 100)) {
      newErrors.subject = 'Subject must be 5-100 characters long'
    }

    // Validate message
    if (!validate.text(formData.message, 10, 1000)) {
      newErrors.message = 'Message must be 10-1000 characters long'
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
      case 'name':
      case 'subject':
      case 'message':
        sanitizedValue = sanitizeInput.text(value)
        break
      case 'email':
        sanitizedValue = value.toLowerCase().trim()
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

    // Sanitize all data before sending
    const sanitizedData = {
      name: sanitizeInput.text(formData.name),
      email: sanitizeInput.email(formData.email),
      subject: sanitizeInput.text(formData.subject),
      message: sanitizeInput.text(formData.message)
    }

    try {
      // Make secure API request
      await makeRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify(sanitizedData)
      })

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      setErrors({})
    } catch (err) {
      const handledError = handleClientError(err)
      console.error('Contact form submission failed:', handledError)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Secure Contact Form
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        This form demonstrates secure communication with input validation,
        sanitization, and error handling.
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Thank you! Your message has been sent successfully.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Name"
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
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        error={!!errors.subject}
        helperText={errors.subject}
        margin="normal"
        required
        inputProps={{
          maxLength: 100
        }}
      />

      <TextField
        fullWidth
        label="Message"
        name="message"
        multiline
        rows={4}
        value={formData.message}
        onChange={handleChange}
        error={!!errors.message}
        helperText={errors.message}
        margin="normal"
        required
        inputProps={{
          maxLength: 1000
        }}
      />

      <Box sx={{ mt: 3, position: 'relative' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Send Message'}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        <strong>Security Features:</strong>
        <br />
        • Input validation and sanitization
        <br />
        • Secure API communication
        <br />
        • Error handling without exposing sensitive data
        <br />
        • Rate limiting protection
        <br />
        • CSRF protection
      </Typography>
    </Box>
  )
}