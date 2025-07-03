/**
 * Secure API Client for Frontend-Backend Communication
 * 
 * This module provides a secure wrapper for making API requests
 * with built-in security features like token management,
 * request validation, and error handling.
 */

/**
 * Configuration for the API client
 */
const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  return {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 
             (isDevelopment ? 'http://localhost:3001' : 'https://api.example.com'),
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  }
}

/**
 * Secure API Client Class
 */
class SecureApiClient {
  constructor() {
    this.config = getApiConfig()
    this.tokenKey = 'authToken'
    this.refreshTokenKey = 'refreshToken'
  }

  /**
   * Get authentication token from storage
   * @returns {string|null} - Auth token or null
   */
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey)
    }
    return null
  }

  /**
   * Set authentication token in storage
   * @param {string} token - Auth token to store
   */
  setAuthToken(token) {
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem(this.tokenKey, token)
    }
  }

  /**
   * Remove authentication token from storage
   */
  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.refreshTokenKey)
    }
  }

  /**
   * Generate secure headers for API requests
   * @param {Object} additionalHeaders - Additional headers to include
   * @returns {Object} - Headers object
   */
  generateHeaders(additionalHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...additionalHeaders
    }

    // Add auth token if available
    const token = this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Sleep function for retry delays
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} - Promise that resolves after delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Make a secure API request with automatic retry
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - Promise that resolves with response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.config.baseURL}${endpoint}`
    let attempt = 0

    while (attempt < this.config.retryAttempts) {
      try {
        const requestOptions = {
          ...options,
          headers: this.generateHeaders(options.headers),
          credentials: 'include', // Include cookies for CSRF protection
        }

        // Add timeout using AbortController
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        // Handle different response statuses
        if (response.status === 401) {
          // Token might be expired, try to refresh
          const refreshed = await this.refreshToken()
          if (refreshed) {
            // Retry the request with new token
            return this.request(endpoint, options)
          } else {
            // Refresh failed, redirect to login
            this.removeAuthToken()
            throw new Error('Authentication required')
          }
        }

        if (response.status === 429) {
          // Rate limited, wait and retry
          if (attempt < this.config.retryAttempts - 1) {
            await this.sleep(this.config.retryDelay * (attempt + 1))
            attempt++
            continue
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP Error: ${response.status}`)
        }

        // Return successful response
        return await response.json()

      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout')
        }

        // If this is the last attempt, throw the error
        if (attempt === this.config.retryAttempts - 1) {
          throw error
        }

        // Wait before retrying
        await this.sleep(this.config.retryDelay * (attempt + 1))
        attempt++
      }
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<boolean>} - True if refresh successful
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(this.refreshTokenKey)
      if (!refreshToken) return false

      const response = await fetch(`${this.config.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      })

      if (response.ok) {
        const data = await response.json()
        this.setAuthToken(data.accessToken)
        return true
      }

      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  /**
   * Convenient GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise that resolves with response data
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    
    return this.request(url, {
      method: 'GET'
    })
  }

  /**
   * Convenient POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} - Promise that resolves with response data
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * Convenient PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} - Promise that resolves with response data
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * Convenient DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Promise that resolves with response data
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    })
  }

  /**
   * Upload file securely
   * @param {string} endpoint - API endpoint
   * @param {File} file - File to upload
   * @param {Object} additionalData - Additional form data
   * @returns {Promise} - Promise that resolves with response data
   */
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    // Add additional data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
  }
}

// Create and export singleton instance
export const apiClient = new SecureApiClient()

/**
 * React hook for secure API requests
 * @returns {Object} - Hook utilities
 */
export const useSecureRequest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const makeRequest = async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.request(endpoint, options)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return { 
    makeRequest, 
    loading, 
    error, 
    clearError 
  }
}

// Import useState for the hook
import { useState } from 'react'