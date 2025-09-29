import axios from "axios";

// Base URL for your Flask backend
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Fetch all customers
export const getCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/customers`);
    return response.data;  // assuming Flask returns JSON
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

// Add a new customer
export const addCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${BASE_URL}/customers/add`, customerData);
    return response.data;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

// Update an existing customer
export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await axios.put(`${BASE_URL}/customers/${customerId}`, customerData);
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (customerId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/customers/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}