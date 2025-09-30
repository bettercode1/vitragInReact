import { useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Custom hook for handling API errors with loading states
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { execute, loading, error, success, reset }
 */
export const useApiError = (apiFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);

  const {
    showAlert = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed',
    onSuccess,
    onError
  } = options;

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setData(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      
      if (onError) {
        onError(error, errorMsg);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setData(null);
  }, []);

  return {
    execute,
    loading,
    error,
    success,
    data,
    reset
  };
};

/**
 * Hook for handling form submissions with error handling
 * @param {Function} submitFunction - The submit function
 * @param {Object} options - Configuration options
 * @returns {Object} - { handleSubmit, loading, error, success, reset }
 */
export const useFormSubmission = (submitFunction, options = {}) => {
  const apiHook = useApiError(submitFunction, options);
  
  const handleSubmit = useCallback(async (formData) => {
    try {
      return await apiHook.execute(formData);
    } catch (error) {
      // Error is already handled by useApiError
      return null;
    }
  }, [apiHook.execute]);

  return {
    handleSubmit,
    loading: apiHook.loading,
    error: apiHook.error,
    success: apiHook.success,
    data: apiHook.data,
    reset: apiHook.reset
  };
};
