import React, { useState } from 'react';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { InputSanitizer, InputValidator, SecureApiClient } from '../utils/securityUtils';

const SecureContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const api = new SecureApiClient('/api');

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!InputValidator.hasMinLength(value, 2)) {
          error = 'Name must be at least 2 characters';
        } else if (!InputValidator.hasMaxLength(value, 50)) {
          error = 'Name must be less than 50 characters';
        }
        break;
        
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!InputValidator.isEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'message':
        if (!InputValidator.hasMinLength(value, 10)) {
          error = 'Message must be at least 10 characters';
        } else if (!InputValidator.hasMaxLength(value, 1000)) {
          error = 'Message must be less than 1000 characters';
        }
        break;
        
      case 'website':
        if (value && !InputValidator.isUrl(value)) {
          error = 'Please enter a valid URL';
        }
        break;
    }
    
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Real-time sanitization
    let sanitizedValue = value;
    
    switch (name) {
      case 'name':
        sanitizedValue = InputSanitizer.sanitizeString(value, {
          removeHtml: true,
          removeScripts: true,
          maxLength: 50
        });
        break;
        
      case 'email':
        sanitizedValue = InputSanitizer.sanitizeEmail(value);
        break;
        
      case 'message':
        sanitizedValue = InputSanitizer.sanitizeString(value, {
          removeScripts: true,
          maxLength: 1000
        });
        break;
        
      case 'website':
        if (value) {
          sanitizedValue = InputSanitizer.sanitizeUrl(value);
        }
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Real-time validation
    const error = validateField(name, sanitizedValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Final validation
    const validationErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        validationErrors[key] = error;
      }
    });
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Submit with additional sanitization
      const sanitizedData = {
        name: InputSanitizer.sanitizeString(formData.name, { removeHtml: true }),
        email: InputSanitizer.sanitizeEmail(formData.email),
        message: InputSanitizer.sanitizeString(formData.message, { removeScripts: true }),
        website: formData.website ? InputSanitizer.sanitizeUrl(formData.website) : ''
      };
      
      await api.post('/contact', sanitizedData);
      
      setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', message: '', website: '' });
      setErrors({});
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Failed to send message. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <h2>Secure Contact Form Example</h2>
      
      {submitStatus && (
        <Alert severity={submitStatus.type} sx={{ mb: 2 }}>
          {submitStatus.message}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        error={!!errors.name}
        helperText={errors.name || 'Required field'}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        error={!!errors.email}
        helperText={errors.email || 'Required field'}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Website"
        name="website"
        type="url"
        value={formData.website}
        onChange={handleInputChange}
        error={!!errors.website}
        helperText={errors.website || 'Optional field'}
        margin="normal"
      />
      
      <TextField
        fullWidth
        label="Message"
        name="message"
        multiline
        rows={4}
        value={formData.message}
        onChange={handleInputChange}
        error={!!errors.message}
        helperText={errors.message || 'Required field (10-1000 characters)'}
        margin="normal"
        required
      />
      
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{ mt: 2 }}
        fullWidth
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Send Message'}
      </Button>
    </Box>
  );
};

export default SecureContactForm;