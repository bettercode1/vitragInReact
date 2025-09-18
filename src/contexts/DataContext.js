import React, { createContext, useContext, useState, useEffect } from 'react';
import databaseService from '../services/database';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [testRequests, setTestRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all data in parallel
      const [testRequestsData, customersData, samplesData] = await Promise.all([
        databaseService.getTestRequests(),
        databaseService.getCustomers(),
        databaseService.getSamples()
      ]);

      setTestRequests(testRequestsData);
      setCustomers(customersData);
      setSamples(samplesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
      
      // Fallback to mock data if database connection fails
      setTestRequests(getMockTestRequests());
      setCustomers(getMockCustomers());
      setSamples(getMockSamples());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockTestRequests = () => [
    {
      id: 1,
      job_number: '1414141414',
      customer_name: 'Shashwat Paratwar',
      site_name: 'Pune',
      receipt_date: '04-09-2025',
      ulr_number: 'ULR-2024-001',
      test_type: 'CC'
    }
  ];

  const getMockCustomers = () => [
    {
      id: 1,
      name: 'Shashwat Paratwar',
      address: 'Pune, Maharashtra'
    }
  ];

  const getMockSamples = () => [
    {
      id: 1,
      sample_code_number: 'SC-2024-001',
      location_nature: 'Construction Site',
      age_in_days: 28,
      casting_date: '04-08-2025',
      testing_date: '04-09-2025',
      grade: 'M25',
      cube_condition: 'Acceptable',
      curing_condition: 'Water Curing',
      machine_used: 'CTM (2000KN)',
      test_method: 'IS 516 (Part 1/Sec 1):2021',
      num_of_cubes: 3,
      id_mark: 'C1',
      dimension_length: 150,
      dimension_width: 150,
      dimension_height: 150,
      weight: 8.5,
      crushing_load: 562.5,
      compressive_strength: 25.0,
      average_strength: 25.0,
      failure_type: 'Conical',
      test_results_json: JSON.stringify([
        { cube_id: 1, id_mark: 'C1', dimension_length: 150, dimension_width: 150, dimension_height: 150, weight: 8.5, crushing_load: 562.5, compressive_strength: 25.0, failure_type: 'Conical', area: 22500 },
        { cube_id: 2, id_mark: 'C2', dimension_length: 150, dimension_width: 150, dimension_height: 150, weight: 8.4, crushing_load: 555.0, compressive_strength: 24.7, failure_type: 'Conical', area: 22500 },
        { cube_id: 3, id_mark: 'C3', dimension_length: 150, dimension_width: 150, dimension_height: 150, weight: 8.6, crushing_load: 570.0, compressive_strength: 25.3, failure_type: 'Conical', area: 22500 }
      ])
    }
  ];

  // Get test request with all related data for PDF generation
  const getTestRequestForPDF = async (testRequestId) => {
    try {
      const testRequest = await databaseService.getTestRequestById(testRequestId);
      const testResults = await databaseService.getTestResults(testRequestId);
      const customer = await databaseService.getCustomerById(testRequest.customer_id);
      
      return {
        test_request: testRequest,
        customer: customer,
        main_test: testResults,
        reviewer_info: {
          name: 'Lalita S. Dussa',
          designation: 'Quality Manager',
          graduation: 'B.Tech.(Civil)'
        }
      };
    } catch (err) {
      console.error('Error fetching test request for PDF:', err);
      // Return mock data as fallback
      return {
        test_request: getMockTestRequests()[0],
        customer: getMockCustomers()[0],
        main_test: getMockSamples()[0],
        reviewer_info: {
          name: 'Lalita S. Dussa',
          designation: 'Quality Manager',
          graduation: 'B.Tech.(Civil)'
        }
      };
    }
  };

  const value = {
    testRequests,
    customers,
    samples,
    loading,
    error,
    loadAllData,
    getTestRequestForPDF
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
