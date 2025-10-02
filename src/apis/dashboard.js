import axios from "axios";
import API_BASE_URL from "../config/api";

// Base URL for your Flask backend
const BASE_URL = API_BASE_URL;

// Fetch dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      total_tests: 0,
      pending_tests: 0,
      completed_tests: 0,
      recent_tests: 0,
      completion_rate: 0
    };
  }
};

// Fetch recent test requests
export const getRecentTests = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/recent-tests`);
    return response.data.tests || response.data; // Handle both old and new format
  } catch (error) {
    console.error("Error fetching recent tests:", error);
    return [];
  }
};

// Fetch pending test requests
export const getPendingTests = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/pending-tests`);
    return response.data.tests || response.data; // Handle both old and new format
  } catch (error) {
    console.error("Error fetching pending tests:", error);
    return [];
  }
};

// Fetch all dashboard data at once
export const getDashboardData = async () => {
  try {
    const [stats, recentTests, pendingTests] = await Promise.all([
      getDashboardStats(),
      getRecentTests(),
      getPendingTests()
    ]);
    
    return {
      stats,
      recentTests,
      pendingTests
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      stats: {
        total_tests: 0,
        pending_tests: 0,
        completed_tests: 0,
        recent_tests: 0,
        completion_rate: 0
      },
      recentTests: [],
      pendingTests: []
    };
  }
};
