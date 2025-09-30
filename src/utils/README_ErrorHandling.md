# Flask API Error Handling in React

This guide shows you how to handle Flask API errors in React with user-friendly alerts and proper error management.

## 🚀 Quick Start

### 1. Basic Error Handling

```javascript
import { getErrorMessage, handleApiError } from '../utils/errorHandler';

// In your component
const handleSubmit = async (formData) => {
  try {
    const result = await createTestRequest(formData);
    // Success handling
  } catch (error) {
    // Get user-friendly error message
    const errorMessage = getErrorMessage(error);
    setError(errorMessage);
    
    // Or use the helper function for automatic alert
    handleApiError(error, "Failed to create test request");
  }
};
```

### 2. Using Custom Hooks (Recommended)

```javascript
import { useFormSubmission } from '../hooks/useApiError';
import { createTestRequest } from '../apis/testRequests';

const MyComponent = () => {
  const {
    handleSubmit,
    loading,
    error,
    success,
    reset
  } = useFormSubmission(createTestRequest, {
    successMessage: 'Test request created successfully!',
    onSuccess: (data) => console.log('Success:', data),
    onError: (error, message) => console.error('Error:', error)
  });

  const onSubmit = async (formData) => {
    await handleSubmit(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Your form fields */}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Success!</Alert>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};
```

## 📁 File Structure

```
src/
├── utils/
│   ├── errorHandler.js          # Core error handling utilities
│   └── README_ErrorHandling.md  # This guide
├── hooks/
│   └── useApiError.js           # Custom hooks for error handling
├── components/
│   ├── ErrorHandlingExample.js  # Basic examples
│   └── CleanErrorHandlingExample.js # Hook-based examples
└── apis/
    └── testRequests.js          # Updated with error handling
```

## 🛠️ Available Functions

### `getErrorMessage(error)`
Extracts user-friendly error messages from Flask API responses.

**Supported error formats:**
- `{ error: "message" }`
- `{ message: "message" }`
- `{ detail: "message" }`
- Network errors
- Timeout errors

### `handleApiError(error, defaultMessage)`
Shows user-friendly alerts and handles error logging.

### `useApiError(apiFunction, options)`
Custom hook for API calls with loading states and error handling.

### `useFormSubmission(submitFunction, options)`
Specialized hook for form submissions.

## 🎯 Error Types Handled

1. **Flask Validation Errors**
   ```json
   { "error": "ULR number already exists. Please try again with a different ULR number." }
   ```

2. **Database Constraint Violations**
   ```json
   { "error": "Job number already exists. Please try again with a different job number." }
   ```

3. **Network Errors**
   - Connection timeouts
   - Server unavailable
   - Network connectivity issues

4. **Server Errors**
   - 500 Internal Server Error
   - 400 Bad Request
   - 404 Not Found

## 🔧 Configuration Options

### useApiError Options
```javascript
const options = {
  showAlert: true,                    // Show browser alerts
  successMessage: 'Success!',        // Custom success message
  errorMessage: 'Error occurred',     // Custom error message
  onSuccess: (data) => {},           // Success callback
  onError: (error, message) => {}    // Error callback
};
```

## 📝 Examples

### Example 1: Basic Form Submission
```javascript
const MyForm = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createTestRequest(formData);
      alert('Success!');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};
```

### Example 2: Using Custom Hook
```javascript
const MyForm = () => {
  const [formData, setFormData] = useState({});
  
  const {
    handleSubmit,
    loading,
    error,
    success,
    reset
  } = useFormSubmission(createTestRequest);

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Success!</Alert>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};
```

## 🚨 Common Issues & Solutions

### Issue: Raw backend errors showing
**Solution:** Use `getErrorMessage()` to extract user-friendly messages.

### Issue: Multiple error alerts
**Solution:** Use the custom hooks which handle alerts automatically.

### Issue: Network errors not handled
**Solution:** The error handler automatically detects and handles network issues.

### Issue: Form not resetting after error
**Solution:** Use the `reset()` function from the custom hooks.

## 🔄 Migration Guide

### Before (Old Error Handling)
```javascript
try {
  const result = await createTestRequest(data);
} catch (error) {
  let errorMessage = 'Failed to submit test request. Please try again.';
  
  if (error.response?.data?.error) {
    errorMessage = `Backend Error: ${error.response.data.error}`;
  } else if (error.response?.status) {
    errorMessage = `Server Error (${error.response.status}): ${error.response.statusText}`;
  } else if (error.message) {
    errorMessage = `Network Error: ${error.message}`;
  }
  
  setSubmitError(errorMessage);
}
```

### After (New Error Handling)
```javascript
try {
  const result = await createTestRequest(data);
} catch (error) {
  const errorMessage = getErrorMessage(error);
  setSubmitError(errorMessage);
}
```

## 🎉 Benefits

1. **Cleaner Code**: Reduced boilerplate for error handling
2. **User-Friendly**: Automatic extraction of meaningful error messages
3. **Consistent**: Standardized error handling across the app
4. **Maintainable**: Centralized error handling logic
5. **Flexible**: Multiple approaches for different use cases

## 🔍 Testing

Test your error handling with these scenarios:

1. **Duplicate ULR Number**: Submit the same ULR number twice
2. **Network Issues**: Disconnect internet and try submitting
3. **Server Errors**: Stop your Flask backend and try submitting
4. **Validation Errors**: Submit invalid data

The error handler should show user-friendly messages for all these cases.
