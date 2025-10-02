import axios from "axios";
import { getErrorMessage, handleApiError } from "../utils/errorHandler";

// Base URL for your Flask backend
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create a new test request
export const createTestRequest = async (testRequestData) => {
  try {
    const response = await axios.post(`${BASE_URL}/test-requests`, testRequestData);
    return response.data;
  } catch (error) {
    console.error("Error creating test request:", error);
    
    // Extract user-friendly error message
    const errorMessage = getErrorMessage(error);
    
    // Show user-friendly alert
    handleApiError(error, "Failed to create test request. Please try again.");
    
    // Re-throw with user-friendly message
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    throw enhancedError;
  }
};

// Fetch all test requests
export const getTestRequests = async (page = 1, perPage = 50) => {
  try {
    const response = await axios.get(`${BASE_URL}/test-requests?page=${page}&per_page=${perPage}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test requests:", error);
    throw error;
  }
};

// Fetch test request details
export const getTestRequestDetails = async (testRequestId) => {
  try {
    const response = await axios.get(`${BASE_URL}/test-requests/${testRequestId}/details`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test request details:", error);
    throw error;
  }
};
