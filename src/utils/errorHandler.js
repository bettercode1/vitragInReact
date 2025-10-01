/**
 * Error handling utilities for Flask API responses
 */

/**
 * Extract user-friendly error message from Flask API response
 * @param {Error} error - The error object from axios/fetch
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  // Check if it's an axios error with response data
  if (error.response && error.response.data) {
    const data = error.response.data;
    
    // Flask returns error messages in different formats
    if (typeof data === 'string') {
      return data;
    }
    
    if (data.error) {
      return data.error;
    }
    
    if (data.message) {
      return data.message;
    }
    
    if (data.detail) {
      return data.detail;
    }
    
    // If it's an object with multiple error fields
    if (typeof data === 'object') {
      const errorMessages = [];
      for (const [key, value] of Object.entries(data)) {
        if (key.toLowerCase().includes('error') || key.toLowerCase().includes('message')) {
          if (Array.isArray(value)) {
            errorMessages.push(...value);
          } else {
            errorMessages.push(value);
          }
        }
      }
      if (errorMessages.length > 0) {
        return errorMessages.join(', ');
      }
    }
  }
  
  // Network or other errors
  if (error.message) {
    if (error.message.includes('Network Error')) {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    return error.message;
  }
  
  // Fallback error message
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Show error alert to user
 * @param {string} message - Error message to display
 * @param {string} type - Alert type (danger, warning, info)
 */
export const showErrorAlert = (message, type = 'danger') => {
  // You can customize this based on your UI library
  // This example uses browser's native alert, but you can replace with your preferred method
  
  // For React Bootstrap Alert component
  if (window.showAlert) {
    window.showAlert(message, type);
    return;
  }
  
  // Fallback to browser alert
  alert(`Error: ${message}`);
};

/**
 * Handle API errors with user-friendly alerts
 * @param {Error} error - The error object from axios/fetch
 * @param {string} defaultMessage - Default message if no specific error found
 */
export const handleApiError = (error, defaultMessage = 'Something went wrong. Please try again.') => {
  const errorMessage = getErrorMessage(error);
  console.error('API Error:', error);
  showErrorAlert(errorMessage || defaultMessage);
};

/**
 * Enhanced axios interceptor for global error handling
 */
export const setupAxiosInterceptors = () => {
  const axios = require('axios');
  
  // Response interceptor for global error handling
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Don't show alerts for 401 (unauthorized) - let components handle login redirects
      if (error.response && error.response.status === 401) {
        return Promise.reject(error);
      }
      
      // Show user-friendly error for other errors
      const errorMessage = getErrorMessage(error);
      showErrorAlert(errorMessage);
      
      return Promise.reject(error);
    }
  );
};

/**
 * Wrapper function for API calls with error handling
 * @param {Function} apiCall - The API function to call
 * @param {string} errorMessage - Custom error message
 * @returns {Promise} - Promise that resolves with data or rejects with handled error
 */
export const withErrorHandling = async (apiCall, errorMessage = 'Operation failed') => {
  try {
    return await apiCall();
  } catch (error) {
    handleApiError(error, errorMessage);
    throw error; // Re-throw so calling code can handle if needed
  }
};
