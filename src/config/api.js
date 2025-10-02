// API Configuration - Auto-detect environment
const getApiUrl = () => {
  // If environment variable is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Auto-detect based on hostname
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Development (localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Production - use same host with port 5000
  return `${protocol}//${hostname}:5000/api`;
};

export const API_BASE_URL = getApiUrl();
export default API_BASE_URL;

