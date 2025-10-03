// Mock database service for development
import API_BASE_URL from "../config/api";

class DatabaseService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Database request failed:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server is taking too long to respond');
      }
      throw error;
    }
  }

  // Test Requests
  async getTestRequests() {
    try {
      const response = await this.request(`/test-requests`);
      console.log('🔍 Database Service - Raw response:', response);
      console.log('🔍 Database Service - response.test_requests:', response.test_requests?.length || 'undefined');
      const result = response.test_requests || response;
      console.log('🔍 Database Service - Final result:', result?.length || 'undefined');
      return result; // Handle both old and new format
    } catch (error) {
      console.error('Failed to fetch test requests:', error);
      return [];
    }
  }

  async getTestRequestById(id) {
    try {
      return await this.request(`/test-requests/${id}`);
    } catch (error) {
      console.error('Failed to fetch test request:', error);
      return null;
    }
  }

  // Customers
  async getCustomers() {
    try {
      return await this.request('/customers');
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      return [];
    }
  }

  async getCustomerById(id) {
    try {
      return await this.request(`/customers/${id}`);
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      return null;
    }
  }

  // Samples/Test Results
  async getSamples() {
    try {
      return await this.request('/samples');
    } catch (error) {
      console.error('Failed to fetch samples:', error);
      return [];
    }
  }

  async getTestResults(testRequestId) {
    try {
      return await this.request(`/test-results/${testRequestId}`);
    } catch (error) {
      console.error('Failed to fetch test results:', error);
      return null;
    }
  }

  // Test Observations
  async saveTestObservations(testRequestId, observationsData) {
    try {
      return await this.request(`/test-observations/${testRequestId}`, {
        method: 'POST',
        body: JSON.stringify(observationsData),
      });
    } catch (error) {
      console.error('Failed to save test observations:', error);
      throw error;
    }
  }

  async getTestObservations(testRequestId) {
    try {
      return await this.request(`/test-observations/${testRequestId}`);
    } catch (error) {
      console.error('Failed to fetch test observations:', error);
      return null;
    }
  }

  // PDF Data - Fetch complete data for PDF generation
  async getTestRequestPDFData(testRequestId) {
    try {
      console.log(`📄 Fetching PDF data for test request: ${testRequestId}`);
      const response = await this.request(`/test-requests/${testRequestId}/pdf-data`);
      console.log('✅ PDF data fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to get PDF data:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        testRequestId: testRequestId
      });
      
      // Provide more specific error messages
      if (error.message.includes('404')) {
        throw new Error(`Test request with ID ${testRequestId} not found in database`);
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server. Make sure Flask is running on port 5000');
      } else {
        throw error;
      }
    }
  }

  // Strength Graph Data - Save strength graph data and observations
  async saveStrengthGraphData(testRequestId, strengthData) {
    try {
      console.log(`📊 Saving strength graph data for test request: ${testRequestId}`);
      const response = await this.request(`/strength-graph/${testRequestId}`, {
        method: 'POST',
        body: JSON.stringify(strengthData),
      });
      console.log('✅ Strength graph data saved successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to save strength graph data:', error);
      throw error;
    }
  }

  // PDF Generation
  async generatePDF(testRequestId) {
    try {
      const response = await this.request(`/generate-pdf/${testRequestId}`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      throw error;
    }
  }
}

export default new DatabaseService();
