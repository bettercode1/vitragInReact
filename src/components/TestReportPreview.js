import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import {
  faArrowLeft,
  faFilePdf,
  faSave,
  faUser,
  faBuilding,
  faCalendar,
  faCog,
  faFlask
} from '@fortawesome/free-solid-svg-icons';
import databaseService from '../services/database';

const TestReportPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ALL useState hooks MUST be at the top, before any returns!
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testData, setTestData] = useState(null);
  const [reviewerInfo, setReviewerInfo] = useState({
    id: 1,
    name: 'Lalita S. Dussa',
    designation: 'Quality Manager',
    graduation: 'B.Tech.(Civil)'
  });
  const [selectedReviewer, setSelectedReviewer] = useState('1');
  
  // Get test request ID from location state - CHECK MULTIPLE SOURCES
  const testRequestId = location.state?.testRequestId || location.state?.testData?.id || location.state?.id;
  
  // Debug logging
  console.log('🔍 TestReportPreview - Full Location State:', location.state);
  console.log('🔍 TestReportPreview - testRequestId (final):', testRequestId);
  console.log('🔍 TestReportPreview - location.state?.testRequestId:', location.state?.testRequestId);
  console.log('🔍 TestReportPreview - location.state?.testData?.id:', location.state?.testData?.id);
  console.log('🔍 TestReportPreview - location.state?.id:', location.state?.id);
  
  // Fetch data from backend
  useEffect(() => {
    const fetchTestData = async () => {
      // PRIORITY: Always fetch fresh data from database
      console.log('🔍 FETCHING FRESH DATA FROM DATABASE');
      console.log('🔍 Test Request ID:', testRequestId);
      
      if (!testRequestId) {
        console.error('❌ NO TEST REQUEST ID!');
        setError('No test request ID provided. Please navigate from a test sample.');
        setLoading(false);
        return;
      }
      
      try {
        console.log('🔍 Fetching COMPLETE PDF data for ID:', testRequestId);
        
        // Use the new PDF data endpoint that fetches from ALL required tables
        console.log('<------------Start DATA from DB----------->');
        const data = await databaseService.getTestRequestPDFData(testRequestId);
        console.log('✅ Fetched COMPLETE PDF data:', data);
        console.log('<------------End DATA from DB----------->');
        
        // Also fetch observations data from database
        let observationsData = null;
        try {
          console.log('<------------Start OBSERVATIONS DATA from DB----------->');
          const observationsResponse = await axios.get(`${API_BASE_URL}/test-observations/${testRequestId}`);
          if (!observationsResponse.data.isEmpty) {
            observationsData = observationsResponse.data;
            console.log('✅ Fetched observations data from database:', observationsData);
          } else {
            console.log('ℹ️ No observations data found in database');
          }
          console.log('<------------End OBSERVATIONS DATA from DB----------->');
        } catch (error) {
          console.warn('⚠️ Could not fetch observations data:', error);
        }
        
        // PRINT THE COMPLETE FETCHED DATA TO SEE EXACTLY WHAT WE GET
        console.log('<------------Start PROCESSING DATA----------->');
        console.log('🔍 ===== COMPLETE FETCHED DATA =====');
        console.log('🔍 RAW DATA FROM BACKEND:');
        console.log(JSON.stringify(data, null, 2));
        console.log('🔍 ===== END COMPLETE FETCHED DATA =====');
        
        // Transform PDF data to match component's expected format
        const mainTest = data.main_test || {};
        
        // Parse strength data from observations_json (where it's saved)
        let strengthData = {};
        let parsedObservationsData = {};
        
        if (mainTest.observations_json) {
          try {
            const observationsParsed = JSON.parse(mainTest.observations_json);
            // Check if strength data is in observations_json
            if (observationsParsed && typeof observationsParsed === 'object') {
              strengthData = observationsParsed; // The strength data is in observations_json
              parsedObservationsData = observationsParsed; // Also use for observations
            }
          } catch (e) {
            console.warn('Failed to parse observations_json:', e);
          }
        }
        
        // Fallback to test_results_json for strength data
        if (!strengthData || Object.keys(strengthData).length === 0) {
          strengthData = mainTest.test_results_json || {};
        }
        
        // Parse test results from test_results_json
        let testResults = [];
        if (mainTest.test_results_json) {
          try {
            const parsedData = JSON.parse(mainTest.test_results_json);
            // Check if it has cube_data array
            if (parsedData.cube_data && Array.isArray(parsedData.cube_data)) {
              testResults = parsedData.cube_data;
            } else if (Array.isArray(parsedData)) {
              testResults = parsedData;
            }
            console.log('✅ Parsed test results from JSON:', testResults);
            console.log('✅ Number of cubes in test results:', testResults.length);
            testResults.forEach((cube, index) => {
              console.log(`✅ Cube ${index + 1}:`, {
                cube_id: cube.cube_id,
                dimension_length: cube.dimension_length,
                dimension_width: cube.dimension_width,
                dimension_height: cube.dimension_height,
                weight: cube.weight,
                crushing_load: cube.crushing_load,
                compressive_strength: cube.compressive_strength,
                area: cube.area,
                density: cube.density
              });
            });
          } catch (e) {
            console.warn('Failed to parse test_results_json:', e);
          }
        } else {
          console.log('⚠️ No test_results_json found in mainTest');
        }
        
        console.log('🔍 Data Structure:');
        console.log('  test_request:', data.test_request);
        console.log('  customer:', data.customer);
        console.log('  main_test:', mainTest);
        console.log('  strengthData:', strengthData);
        console.log('  parsedObservationsData:', parsedObservationsData);
        console.log('  observationsData from DB:', observationsData);
        console.log('  photos:', data.photos);
        
        // Debug specific fields that are showing as N/A
        console.log('🔍 Debug missing fields:');
        console.log('  mainTest.grade:', mainTest.grade);
        console.log('  mainTest.grade_of_specimen:', mainTest.grade_of_specimen);
        console.log('  mainTest.sample_code_number:', mainTest.sample_code_number);
        console.log('  mainTest.id_mark:', mainTest.id_mark);
        console.log('  mainTest.reference_number:', mainTest.reference_number);
        console.log('  mainTest.testing_date:', mainTest.testing_date);
        console.log('  mainTest.casting_date:', mainTest.casting_date);
        console.log('  mainTest.average_strength:', mainTest.average_strength);
        console.log('  mainTest.average_strength type:', typeof mainTest.average_strength);
        console.log('  mainTest.age_in_days:', mainTest.age_in_days);
        console.log('  data.test_request.sample_code_number:', data.test_request.sample_code_number);
        console.log('  data.test_request.job_number:', data.test_request.job_number);
        console.log('🔍 ALL mainTest keys:', Object.keys(mainTest));
        console.log('🔍 ALL test_request keys:', Object.keys(data.test_request));
        console.log('🔍 COMPLETE mainTest object:', JSON.stringify(mainTest, null, 2));
        console.log('🔍 COMPLETE test_request object:', JSON.stringify(data.test_request, null, 2));
        console.log('🔍 testResults array:', testResults);
        console.log('🔍 testResults length:', testResults.length);
        
        // Calculate age in days
        const calculateAge = (castingDate, testingDate) => {
          if (!castingDate || !testingDate) return 'N/A';
          const casting = new Date(castingDate);
          const testing = new Date(testingDate);
          const diffTime = Math.abs(testing - casting);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        };
        
        // Transform data to match component's expected format
        const transformedData = {
          id: data.test_request.id,
          jobNumber: data.test_request.job_number || 'N/A',
          customerName: data.customer.name || 'N/A',
          siteName: data.test_request.site_name || data.customer.site_name || 'N/A',
          siteAddress: data.customer.address || 'N/A',
          receiptDate: data.test_request.receipt_date || 'N/A',
          status: data.test_request.status || 'pending',
          ulrNumber: data.test_request.ulr_number || 'N/A',
          referenceNumber: mainTest.sample_code_number || data.test_request.job_number || 'N/A',
          cubeTests: [{
            id: mainTest.id || 1,
            idMark: mainTest.id_mark || 'N/A',
            locationNature: mainTest.location_nature || 'N/A',
            grade: mainTest.grade || 'M25',
            castingDate: mainTest.casting_date || data.test_request.receipt_date || '2025-10-01',
            testingDate: mainTest.testing_date || '2025-10-03',
            ageInDays: mainTest.age_in_days || 28,
            quantity: mainTest.cube_results ? mainTest.cube_results.length : testResults.length || 3,
            testMethod: mainTest.test_method || 'IS 516 (Part1/Sec1):2021',
            sampleCodeNumber: mainTest.sample_code_number || data.test_request.job_number || 'N/A',
            ulrNumber: data.test_request.ulr_number || 'N/A',
            machineUsed: mainTest.machine_used || 'CTM (2000KN)',
            cubeCondition: mainTest.cube_condition || 'Acceptable',
            curingCondition: mainTest.curing_condition || 'Water Curing',
            sampleDescription: mainTest.sample_description || 'Concrete Cube Specimen',
            testedBy: mainTest.tested_by || 'N/A',
            checkedBy: mainTest.checked_by || 'N/A',
            verifiedBy: mainTest.verified_by || 'Mr. P A Sanghave',
            averageStrength: mainTest.average_strength ? mainTest.average_strength.toString() : 'N/A',
            weight: mainTest.weight || 'N/A',
            dimensionLength: mainTest.dimension_length || 'N/A',
            dimensionWidth: mainTest.dimension_width || 'N/A',
            dimensionHeight: mainTest.dimension_height || 'N/A',
            crushingLoad: mainTest.crushing_load || 'N/A',
            compressiveStrength: mainTest.compressive_strength || 'N/A',
            failureType: mainTest.failure_type || 'N/A',
            testRemarks: mainTest.test_remarks || 'N/A'
          }],
          // Use cube_results from main_test (this is the correct data from your JSON)
          allTestResults: mainTest.cube_results ? mainTest.cube_results.map((cube, index) => {
            console.log(`🔍 Processing cube ${index + 1} for display:`, cube);
            return {
              srNo: index + 1,
              idMark: cube.cube_id || `C${index + 1}`,
              dimensionLength: cube.dimension_length || '',
              dimensionWidth: cube.dimension_width || '',
              dimensionHeight: cube.dimension_height || '',
              area: cube.area ? parseFloat(cube.area).toFixed(3) : '',
              weight: cube.weight ? parseFloat(cube.weight).toFixed(3) : '',
              crushingLoad: cube.crushing_load ? parseFloat(cube.crushing_load).toFixed(3) : '',
              density: cube.density ? parseFloat(cube.density).toFixed(3) : '',
              compressiveStrength: cube.compressive_strength ? parseFloat(cube.compressive_strength).toFixed(3) : '',
              failureType: cube.failure_type || '-'
            };
          }) : [],
          strengthData: mainTest.observations_json || {},
          observationsData: mainTest.observations_json || {},
          photos: data.photos || [],
          // Handle captured images - try multiple sources
          capturedImages: (() => {
            console.log('📸 PROCESSING CAPTURED IMAGES:');
            console.log('📸 data.photos:', data.photos);
            console.log('📸 observationsData?.capturedImages:', observationsData?.capturedImages);
            
            // Priority 1: Use observationsData.capturedImages if available
            if (observationsData?.capturedImages && Object.keys(observationsData.capturedImages).length > 0) {
              console.log('📸 Using capturedImages from observationsData');
              return observationsData.capturedImages;
            }
            
            // Priority 2: Convert photos array to capturedImages format
            if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
              console.log('📸 Converting photos array to capturedImages format');
              const convertedImages = {};
              data.photos.forEach((photo) => {
                const { photo_type, cube_number, photo_data } = photo;
                if (photo_data && typeof photo_data === 'string') {
                  // Add data:image prefix if not present
                  const imageData = photo_data.startsWith('data:image') ? photo_data : `data:image/jpeg;base64,${photo_data}`;
                  // Create the key format expected by finalTestReport.html
                  const key = `${photo_type}_${cube_number}`;
                  convertedImages[key] = imageData;
                  console.log(`📸 Converted photo: ${key}`);
                }
              });
              return convertedImages;
            }
            
            console.log('⚠️ No images found in any source');
            return {};
          })(),
          averageStrength: mainTest.average_strength ? mainTest.average_strength.toString() : 'N/A'
        };
        
        console.log('✅ Transformed data:', transformedData);
        console.log('✅ allTestResults length:', transformedData.allTestResults.length);
        console.log('✅ allTestResults content:', transformedData.allTestResults);
        console.log('✅ Reference number:', transformedData.referenceNumber);
        console.log('✅ Sample code number:', transformedData.cubeTests[0]?.sampleCodeNumber);
        console.log('✅ mainTest.cube_results:', mainTest.cube_results);
        console.log('✅ mainTest structure:', Object.keys(mainTest));
        console.log('✅ Full mainTest object:', mainTest);
        if (mainTest.cube_results && mainTest.cube_results.length > 0) {
          console.log('✅ First cube in cube_results:', mainTest.cube_results[0]);
          console.log('✅ All cube_results keys:', mainTest.cube_results.map(cube => Object.keys(cube)));
        }
        console.log('🔍 About to set testData:', transformedData);
        console.log('🔍 transformedData keys:', Object.keys(transformedData));
        console.log('🔍 transformedData.allTestResults:', transformedData.allTestResults);
        console.log('🔍 transformedData.referenceNumber:', transformedData.referenceNumber);
        setTestData(transformedData);
        setLoading(false);
        console.log('🔍 testData state set, loading set to false');
        console.log('<------------End PROCESSING DATA----------->');
        
      } catch (err) {
        console.error('❌ Error fetching test data:', err);
        setError(err.message || 'Failed to fetch test data');
        setLoading(false);
      }
    };
    
    fetchTestData();
  }, [testRequestId]);
  
  // Show loading state
  if (loading) {
    return (
      <Container className="mt-5">
        <Card style={{ backgroundColor: '#1C2333', border: '2px solid #FFA500' }}>
          <Card.Body className="text-center p-5">
            <Spinner animation="border" variant="warning" style={{ width: '4rem', height: '4rem' }} />
            <h2 className="mt-4 text-white">Loading Test Report...</h2>
            <p className="text-muted mt-2">Please wait while we fetch your test data from the database</p>
            <div className="mt-4">
              <div className="progress" style={{ height: '4px', backgroundColor: '#333' }}>
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: '100%', animation: 'progress 2s ease-in-out infinite' }}></div>
              </div>
            </div>
          </Card.Body>
        </Card>
        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 100%; }
            100% { width: 0%; }
          }
        `}</style>
      </Container>
    );
  }
  
  // Show error state
  console.log('🔍 RENDER CHECK - error:', error);
  console.log('🔍 RENDER CHECK - testData:', testData);
  console.log('🔍 RENDER CHECK - loading:', loading);
  console.log('🔍 RENDER CHECK - testData type:', typeof testData);
  console.log('🔍 RENDER CHECK - testData keys:', testData ? Object.keys(testData) : 'null');
  
  if (error || !testData) {
    console.log('🔍 RENDERING ERROR STATE');
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Test Report</Alert.Heading>
          <p>{error || 'Test data not found'}</p>
          <p>Debug: testData = {testData ? 'exists' : 'null'}, error = {error || 'none'}</p>
          <Button variant="outline-danger" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} /> Go Back
          </Button>
        </Alert>
      </Container>
    );
  }
  
  // Reviewers list
  const reviewers = [
    { id: 1, name: 'Lalita S. Dussa', designation: 'Quality Manager', graduation: 'B.Tech.(Civil)' },
    { id: 2, name: 'Harsha Prakarsha Sangave', designation: 'Quality Manager', graduation: 'M.E(Civil-Structures)' },
    { id: 3, name: 'Amol A Adam', designation: 'Quality Manager', graduation: 'B.E(Civil)' },
    { id: 4, name: 'Aaquib J. Shaikh', designation: 'Quality Manager', graduation: 'B.E(Civil)' },
    { id: 5, name: 'Prakarsha A. Sangave', designation: 'Chief Executive Officer', graduation: 'M.E(Civil-Structures)' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString;
  };

  const handleReviewerChange = (e) => {
    const reviewerId = e.target.value;
    setSelectedReviewer(reviewerId);
    const reviewer = reviewers.find(r => r.id === parseInt(reviewerId));
    if (reviewer) {
      setReviewerInfo(reviewer);
    }
  };


  // Function to view OBSERVATION SHEET (Page 1 only)
  const handleViewObservationSheet = () => {
    // Navigate to observation sheet page
    const params = new URLSearchParams();
    const cubeTest = testData.cubeTests ? testData.cubeTests[0] : testData;
    
    // Pass only observation-related data
    params.append('page_type', 'observation'); // Flag to show only page 1
    params.append('customer_name', testData.customerName || '');
    params.append('site_name', testData.siteName || '');
    params.append('job_code_number', testData.jobNumber || '');
    params.append('ulr_number', cubeTest.ulrNumber || testData.ulrNumber || '');
    const referenceNumber = cubeTest.sampleCodeNumber || testData.referenceNumber || '';
    params.append('reference_number', referenceNumber);
    console.log('📋 Reference number being sent (obs sheet):', referenceNumber);
    params.append('date_of_testing', cubeTest.testingDate || '');
    params.append('date_of_casting', cubeTest.castingDate || '');
    params.append('sample_description', testData.sampleDescription || 'Concrete Cube Specimen');
    params.append('blocks_condition', testData.cubeCondition || 'Acceptable');
    params.append('curing_condition', testData.curingCondition || '');
    params.append('machine_used_for_testing', testData.machineUsed || 'CTM (2000KN)');
    
    // Test results - use allTestResults from transformed data
    const testResults = testData.allTestResults || [];
    console.log('🔍 DEBUG: testData:', testData);
    console.log('🔍 DEBUG: testData.allTestResults:', testData.allTestResults);
    console.log('🔍 DEBUG: testResults length:', testResults.length);
    console.log('Test Results for observation sheet:', testResults);
    testResults.forEach((result, index) => {
      const i = index + 1;
      console.log(`🔍 DEBUG OBS: Processing cube ${i}:`, result);
      params.append(`block_id_${i}`, result.idMark || `C${i}`);
      params.append(`length_${i}`, result.dimensionLength || '');
      params.append(`breadth_${i}`, result.dimensionWidth || '');
      params.append(`height_${i}`, result.dimensionHeight || '');
      params.append(`area_${i}`, result.area || '');
      params.append(`weight_${i}`, result.weight || '');
      params.append(`load_max_${i}`, result.crushingLoad || '');
      params.append(`compressive_strength_${i}`, result.compressiveStrength || '');
      console.log(`🔍 DEBUG OBS: Added params for cube ${i}:`, {
        block_id: result.idMark || `C${i}`,
        length: result.dimensionLength,
        weight: result.weight,
        load_max: result.crushingLoad
      });
    });
    
    params.append('tested_by_name', testData.testedBy || '');
    params.append('checked_by_name', testData.checkedBy || '');
    params.append('verified_by_name', testData.verifiedBy || reviewerInfo.name);
    
    // DYNAMIC FIX: Access the main_test data correctly from your structure
    // From your log: main_test: { curing_condition: "Water curing at 27°C ± 2°C", tested_by: "Shashwat", etc. }
    console.log('🔍 DYNAMIC DEBUG - Raw testData structure:', testData);
    
    // FALLBACK: Check if data is nested in main_test or other structure
    const mainTestData = testData.main_test || testData;
    console.log('🐛 CHECKING MAIN_TEST DATA:');
    console.log('  mainTestData.curing_condition:', mainTestData.curing_condition);
    console.log('  mainTestData.tested_by:', mainTestData.tested_by);
    console.log('  mainTestData.checked_by:', mainTestData.checked_by);
    console.log('  mainTestData.test_remarks:', mainTestData.test_remarks);
    
    // Use the correct data source - try direct access first, then fallback
    const curingCondition = testData.curing_condition || mainTestData.curing_condition || '';
    const testedBy = testData.tested_by || mainTestData.tested_by || '';
    const checkedBy = testData.checked_by || mainTestData.checked_by || '';
    const testRemarks = testData.test_remarks || mainTestData.test_remarks || '';
    // CEO is always the verified_by
    const verifiedBy = 'Mr. P A Sanghave';
    
    // FINAL FIX: Try multiple sources for the data
    const finalCuringCondition = 
      testData.curing_condition || 
      testData.curingCondition ||
      (testData.cubeTests && testData.cubeTests[0] && testData.cubeTests[0].curing_condition) ||
      (testData.cubeTests && testData.cubeTests[0] && testData.cubeTests[0].curingCondition) ||
      mainTestData.curing_condition || 
      '';
      
    const finalTestedBy = 
      testData.tested_by || 
      testData.testedBy ||
      (testData.cubeTests && testData.cubeTests[0] && testData.cubeTests[0].tested_by) ||
      (testData.cubeTests && testData.cubeTests[0] && testData.cubeTests[0].testedBy) ||
      mainTestData.tested_by || 
      '';
      
    const finalCheckedBy = 
      testData.checked_by || 
      testData.checkedBy ||
      (testData.cubeTests && testData.cubeTests[0] && testData.cubeTests[0].checked_by) ||
      (testData.cubeTests && testData.cubeTests[0] && testData.cubeTests[0].checkedBy) ||
      mainTestData.checked_by || 
      '';
      
    const finalTestRemarks = 
      testData.test_remarks || 
      testData.testRemarks ||
      (testData.cubeTests && testData.cubeTests[0] && testData.cubeTests[0].test_remarks) ||
      (testData.cubeTests && testData.cubeTests[0] && testData.cubeTests[0].testRemarks) ||
      mainTestData.test_remarks || 
      '';
    
    // ADD MORE REQUIRED FIELDS FOR OBSERVATION SHEET
    params.append('test_request_id', testData.id || testRequestId || '');
    
    // Get data from the correct database fields (based on the actual database schema)
    // These field names match the main_tests table structure exactly
    params.append('curing_condition', finalCuringCondition);
    params.append('tested_by', finalTestedBy);
    params.append('checked_by', finalCheckedBy);
    params.append('verified_by', verifiedBy);
    params.append('test_remarks', finalTestRemarks);
    params.append('machine_used', testData.machineUsed || 'CTM (2000KN)');
    params.append('test_method', testData.testMethod || 'IS 516 (Part1/Sec1):2021');
    
    console.log('🚀 FINAL URL PARAMETERS BEING SET:');
    console.log('  curing_condition:', finalCuringCondition);
    console.log('  tested_by:', finalTestedBy);
    console.log('  checked_by:', finalCheckedBy);
    console.log('  verified_by:', verifiedBy);
    console.log('  test_remarks:', finalTestRemarks);
    
    // CRITICAL: Log what we're extracting
    console.log('🐛 EXTRACTING FROM TESTDATA:');
    console.log('  testData.curing_condition:', testData.curing_condition);
    console.log('  testData.tested_by:', testData.tested_by);
    console.log('  testData.checked_by:', testData.checked_by);
    console.log('  testData.test_remarks:', testData.test_remarks);
    console.log('  Full testData keys:', Object.keys(testData));
    console.log('  Complete testData object:', testData);
    
    console.log('✅ DYNAMIC VALUES FROM MAIN_TEST:');
    console.log('  curing_condition:', curingCondition);
    console.log('  tested_by:', testedBy);
    console.log('  checked_by:', checkedBy);
    console.log('  verified_by:', verifiedBy, '(CEO - always)');
    console.log('  test_remarks:', testRemarks);
    
    // CRITICAL: Debug what data exists in testData
    console.log('🐛 CRITICAL DEBUG - testData structure:');
    console.log('  typeof testData:', typeof testData);
    console.log('  testData keys:', Object.keys(testData));
    console.log('  testData.cubeTests:', testData.cubeTests);
    if (testData.cubeTests && testData.cubeTests[0]) {
      console.log('  cubeTests[0] keys:', Object.keys(testData.cubeTests[0]));
      console.log('  cubeTests[0].curing_condition:', testData.cubeTests[0].curing_condition);
      console.log('  cubeTests[0].curingCondition:', testData.cubeTests[0].curingCondition);
      console.log('  cubeTests[0].tested_by:', testData.cubeTests[0].tested_by);
      console.log('  cubeTests[0].testedBy:', testData.cubeTests[0].testedBy);
    }
    
    console.log('🎯 FINAL VALUES AFTER ALL FALLBACKS:');
    console.log('  finalCuringCondition:', finalCuringCondition);
    console.log('  finalTestedBy:', finalTestedBy);
    console.log('  finalCheckedBy:', finalCheckedBy);
    console.log('  finalTestRemarks:', finalTestRemarks);
    
    // Also add alternative parameter names for compatibility
    params.append('tested_by_name', finalTestedBy);
    params.append('checked_by_name', finalCheckedBy);
    params.append('verified_by_name', verifiedBy);  // CEO always
    params.append('testedBy', finalTestedBy);
    params.append('checkedBy', finalCheckedBy);
    params.append('verifiedBy', verifiedBy);  // CEO always
    params.append('curingCondition', finalCuringCondition);
    params.append('machineUsed', testData.machineUsed || 'CTM (2000KN)');
    params.append('testMethod', testData.testMethod || 'IS 516 (Part1/Sec1):2021');
    params.append('testRemarks', finalTestRemarks);
    params.append('remarks', finalTestRemarks);
    params.append('grade', cubeTest.grade || testData.grade || 'M25');
    params.append('grade_of_specimen', cubeTest.grade || testData.grade || 'M25');
    params.append('quantity', testResults.length || '');
    
    // Add console logging to debug what data we're sending
    console.log('🔍 OBSERVATION SHEET DEBUG - Data being sent:');
    console.log('  📷 testData.curingCondition:', testData.curingCondition);
    console.log('  📷 testData.testedBy:', testData.testedBy);
    console.log('  📷 testData.checkedBy:', testData.checkedBy);
    console.log('  📷 testData.verifiedBy:', testData.verifiedBy);
    console.log('  📷 testData.testRemarks:', testData.testRemarks);
    console.log('  📷 Complete testData object:', testData);
    
    // CRITICAL: Log the actual values being used
    console.log('🐛 ACTUAL VALUES BEING SET:');
    console.log('  finalCuringCondition variable:', finalCuringCondition);
    console.log('  finalTestedBy variable:', finalTestedBy);
    console.log('  finalCheckedBy variable:', finalCheckedBy);
    console.log('  verifiedBy variable:', verifiedBy);
    console.log('  finalTestRemarks variable:', finalTestRemarks);
    
    // Store testData WITHOUT images in sessionStorage to avoid quota exceeded
    if (testData.id || testRequestId) {
      const sessionKey = `testData_${testData.id || testRequestId}`;
      
      // Create a copy without large image data
      const testDataWithoutImages = { ...testData };
      delete testDataWithoutImages.capturedImages;
      delete testDataWithoutImages.photos;
      
      sessionStorage.setItem(sessionKey, JSON.stringify(testDataWithoutImages));
      console.log('✅ DYNAMIC: Stored testData WITHOUT images in sessionStorage:', sessionKey);
      console.log('  📷 testData.curing_condition:', testData.curing_condition);
      console.log('  📷 testData.tested_by:', testData.tested_by);
      console.log('  📷 testData.checked_by:', testData.checked_by);
      console.log('  📷 testData.verified_by:', testData.verified_by);
      console.log('  📷 capturedImages available:', testData.capturedImages ? 'YES' : 'NO');
    }
    
    // Add average compressive strength - dynamic calculation
    const averageStrengthObs = testData.averageStrength || cubeTest.averageStrength || '';
    if (averageStrengthObs && averageStrengthObs !== '0' && averageStrengthObs !== 'N/A' && averageStrengthObs !== '') {
      params.append('average_compressive_strength', averageStrengthObs);
      console.log('📊 Using saved average (observation sheet):', averageStrengthObs);
    } else {
      // Calculate from cube results
      const cubeResults = testData.allTestResults || [];
      if (cubeResults.length > 0) {
        const strengths = cubeResults.map(cube => parseFloat(cube.compressiveStrength)).filter(s => !isNaN(s));
        if (strengths.length > 0) {
          const calculated = (strengths.reduce((sum, s) => sum + s, 0) / strengths.length).toFixed(2);
          params.append('average_compressive_strength', calculated);
          console.log('📊 Calculated average (observation sheet):', calculated);
        } else {
          params.append('average_compressive_strength', '0.00');
        }
      } else {
        params.append('average_compressive_strength', '0.00');
      }
    }
    
    window.open(`/observationSheet.html?${params.toString()}`, '_blank');
    
    // DEBUG: Log what's actually in the URL
    console.log('🚀 FINAL URL PARAMETERS BEING SENT:');
    console.log('  curing_condition:', params.get('curing_condition'));
    console.log('  tested_by:', params.get('tested_by'));
    console.log('  checked_by:', params.get('checked_by'));
    console.log('  verified_by:', params.get('verified_by'));
    console.log('  test_remarks:', params.get('test_remarks'));
    console.log('🚀 COMPLETE URL:', `/observationSheet.html?${params.toString()}`);
    
    // DEBUG: Also log the final URL for manual testing
    const finalObsUrl = `/observationSheet.html?${params.toString()}`;
    console.log('🚀 FINAL OBSERVATION SHEET URL:', finalObsUrl);
    console.log('🚀 Manual test URL:', window.location.origin + finalObsUrl);
    
    // CRITICAL: Show a preview of the URL parameters to verify data
    console.log('🔍 URL PREVIEW - PARAMETERS:');
    console.log('  URL length:', finalObsUrl.length);
    console.log('  curing_condition param:', params.get('curing_condition') ? 'HAS VALUE' : 'EMPTY');
    console.log('  tested_by param:', params.get('tested_by') ? 'HAS VALUE' : 'EMPTY');
    console.log('  checked_by param:', params.get('checked_by') ? 'HAS VALUE' : 'EMPTY');
    console.log('  test_remarks param:', params.get('test_remarks') ? 'HAS VALUE' : 'EMPTY');
  };
  
  // Function to view FULL REPORT (Pages 2-4)
  const handleViewPDF = async () => {
    console.log('🚀 handleViewPDF CLICKED!');
    console.log('🚀 testData exists:', !!testData);
    console.log('🚀 testData:', testData);
    
    if (!testData) {
      console.error('❌ NO TESTDATA - Cannot open PDF');
      console.log('Error: No test data available. Please try refreshing the page.');
      return;
    }
    
    // Build URL parameters from testData
    const params = new URLSearchParams();
    
    console.log('Full testData:', testData); // Debug log
    
    params.append('page_type', 'full'); // Flag to show full report
    params.append('test_request_id', testData.id); // For sessionStorage image retrieval
    
    // Get cube test data - handle both old and new data structure
    const cubeTest = testData.cubeTests ? testData.cubeTests[0] : testData;
    
    // Customer Information (Page 1 & Page 2)
    params.append('customer_name', testData.customerName || '');
    params.append('site_name', testData.siteName || '');
    params.append('site_address', testData.siteAddress || '');
    params.append('job_code_number', testData.jobNumber || '');
    params.append('ulr_number', testData.ulrNumber || cubeTest.ulrNumber || '');
    const referenceNumberFull = testData.referenceNumber || cubeTest.sampleCodeNumber || '';
    params.append('reference_number', referenceNumberFull);
    console.log('📋 Reference number being sent (full report):', referenceNumberFull);
    
    // Dates
    params.append('date_of_report', new Date().toISOString().split('T')[0]);
    params.append('date_of_receipt', testData.receiptDate || '');
    params.append('date_of_material_receipt', testData.receiptDate || '');
    params.append('date_of_casting', cubeTest.castingDate || testData.castingDate || '');
    params.append('date_of_testing', cubeTest.testingDate || testData.testingDate || '');
    
    // Test Information (Page 1 & Page 2 - from TestObservations)
    params.append('sample_test_code', cubeTest.sampleCodeNumber || testData.referenceNumber || '');
    params.append('sample_description', cubeTest.sampleDescription || testData.sampleDescription || `Concrete Cube Specimen - Grade ${cubeTest.grade || testData.grade}` || '');
    params.append('material_description', cubeTest.sampleDescription || testData.sampleDescription || `Concrete Cube Specimen - Grade ${cubeTest.grade || testData.grade}` || '');
    params.append('quantity_of_blocks', cubeTest.quantity || testData.quantity || '');
    params.append('grade_of_blocks', cubeTest.grade || testData.grade || '');
    params.append('grade_of_specimen', cubeTest.grade || testData.grade || '');
    params.append('blocks_condition', cubeTest.cubeCondition || testData.cubeCondition || 'Acceptable');
    params.append('condition_of_specimen', cubeTest.cubeCondition || testData.cubeCondition || 'Acceptable');
    params.append('condition_of_sample', cubeTest.cubeCondition || testData.cubeCondition || 'Acceptable');
    params.append('manufacture_of_blocks', `${cubeTest.ageInDays || testData.ageInDays || ''} Days`);
    params.append('age_of_specimen', `${cubeTest.ageInDays || testData.ageInDays || ''}`);
    params.append('curing_condition', cubeTest.curingCondition || testData.curingCondition || '');
    params.append('machine_used', cubeTest.machineUsed || testData.machineUsed || 'Fully automatic Digital Compression Testing Machine');
    params.append('machine_used_for_testing', cubeTest.machineUsed || testData.machineUsed || 'Fully automatic Digital Compression Testing Machine');
    params.append('location_of_testing', 'Permanent');
    params.append('location_structure', cubeTest.locationNature || testData.locationNature || '');
    params.append('type_of_specimen', cubeTest.sampleDescription || 'Concrete Cube');
    params.append('environmental_conditions', 'Not Applicable');
    params.append('capacity_range', '2000KN');
    params.append('calibration_due_date', '01/10/2026');
    
    // Test Results - from TestObservations rows data
    const testResults = testData.allTestResults || [];
    console.log('🔍 DEBUG FULL: testData:', testData);
    console.log('🔍 DEBUG FULL: testData.allTestResults:', testData.allTestResults);
    console.log('🔍 DEBUG FULL: testResults length:', testResults.length);
    console.log('Test Results for full report:', testResults); // Debug log
    
    testResults.forEach((result, index) => {
      const i = index + 1;
      console.log(`🔍 DEBUG FULL: Processing cube ${i}:`, result);
      params.append(`block_id_${i}`, result.idMark || '');
      params.append(`length_${i}`, result.dimensionLength || '');
      params.append(`breadth_${i}`, result.dimensionWidth || '');
      params.append(`height_${i}`, result.dimensionHeight || '');
      params.append(`area_${i}`, result.area || '');
      params.append(`weight_${i}`, result.weight || '');
      params.append(`load_max_${i}`, result.crushingLoad || '');
      params.append(`density_${i}`, result.density || '');
      params.append(`compressive_strength_${i}`, result.compressiveStrength || '');
      params.append(`failure_type_${i}`, result.failureType || '-');
      console.log(`🔍 DEBUG FULL: Added params for cube ${i}:`, {
        block_id: result.idMark,
        length: result.dimensionLength,
        weight: result.weight,
        load_max: result.crushingLoad,
        density: result.density
      });
    });
    
    // Remarks - from TestObservations
    params.append('remarks', testData.testRemarks || testData.remarks || '');
    
    // Verification/Authorization - from TestObservations
    params.append('tested_by_name', testData.testedBy || 'John Doe');
    params.append('tested_by_date', testData.testedDate || new Date().toLocaleDateString('en-GB'));
    params.append('checked_by_name', testData.checkedBy || 'Jane Smith');
    params.append('checked_by_date', testData.checkedDate || new Date().toLocaleDateString('en-GB'));
    params.append('verified_by_name', testData.verifiedBy || reviewerInfo.name || 'Prakarsh A Sangave');
    params.append('verified_by_date', testData.verifiedDate || new Date().toLocaleDateString('en-GB'));
    
    // Add average compressive strength - FORCE IT TO USE THE CORRECT VALUE
    const averageStrength = testData.averageStrength || cubeTest.averageStrength || '';
    params.append('average_compressive_strength', averageStrength);
    console.log('📊 Average compressive strength being sent:', averageStrength);
    console.log('📊 testData.averageStrength:', testData.averageStrength);
    console.log('📊 cubeTest.averageStrength:', cubeTest.averageStrength);
    console.log('📊 Type of testData.averageStrength:', typeof testData.averageStrength);
    console.log('📊 Type of cubeTest.averageStrength:', typeof cubeTest.averageStrength);
    
    // Use the actual average strength from database or calculate from cube results
    if (averageStrength && averageStrength !== '0' && averageStrength !== 'N/A' && averageStrength !== '') {
      console.log('📊 USING SAVED AVERAGE:', averageStrength);
      params.set('average_compressive_strength', averageStrength);
    } else {
      // Calculate from cube results if not saved
      const cubeResults = testData.allTestResults || [];
      if (cubeResults.length > 0) {
        const strengths = cubeResults.map(cube => parseFloat(cube.compressiveStrength)).filter(s => !isNaN(s));
        if (strengths.length > 0) {
          const calculated = (strengths.reduce((sum, s) => sum + s, 0) / strengths.length).toFixed(2);
          console.log('📊 CALCULATED AVERAGE:', calculated);
          params.set('average_compressive_strength', calculated);
        } else {
          params.set('average_compressive_strength', '0.00');
        }
      } else {
        params.set('average_compressive_strength', '0.00');
      }
    }
    
    // Strength Graph Data - from StrengthGraph
    console.log('🔍 FULL testData object:', testData);
    console.log('🔍 testData.strengthData:', testData.strengthData);
    console.log('🔍 testData.observationsData:', testData.observationsData);
    console.log('🔍 cubeTest:', cubeTest);
    
    // Check if strength graph data exists
    if (testData.strengthData && Object.keys(testData.strengthData).length > 0) {
      console.log('📊 COMPLETE strengthData object:', JSON.stringify(testData.strengthData, null, 2));
      
      const r7 = testData.strengthData.required_7 || '15.0';
      const a7 = testData.strengthData.actual_7 || '0';
      const r14 = testData.strengthData.required_14 || '22.5';
      const a14 = testData.strengthData.actual_14 || '0';
      const r28 = testData.strengthData.required_28 || '30.0';
      const a28 = testData.strengthData.actual_28 || '0';
      
      console.log('📊 STRENGTH VALUES BEING SENT:', {r7, a7, r14, a14, r28, a28});
      console.log('📊 ORIGINAL strengthData values:', {
        required_7: testData.strengthData.required_7,
        actual_7: testData.strengthData.actual_7,
        required_14: testData.strengthData.required_14,
        actual_14: testData.strengthData.actual_14,
        required_28: testData.strengthData.required_28,
        actual_28: testData.strengthData.actual_28
      });
      
      params.append('required_7', r7);
      params.append('actual_7', a7);
      params.append('required_14', r14);
      params.append('actual_14', a14);
      params.append('required_28', r28);
      params.append('actual_28', a28);
      console.log('Strength params:', {
        required_7: testData.strengthData.required_7,
        actual_7: testData.strengthData.actual_7,
        required_14: testData.strengthData.required_14,
        actual_14: testData.strengthData.actual_14,
        required_28: testData.strengthData.required_28,
        actual_28: testData.strengthData.actual_28
      });
    } else {
      console.log('📊 NO STRENGTH DATA - using defaults');
      params.append('required_7', '15.0');
      params.append('actual_7', '0');
      params.append('required_14', '22.5');
      params.append('actual_14', '0');
      params.append('required_28', '30.0');
      params.append('actual_28', '0');
    }
    
    // Observations Data (6 observation points) - from StrengthGraph
    console.log('testData.observationsData:', testData.observationsData);
    if (testData.observationsData && Object.keys(testData.observationsData).length > 0) {
      params.append('obs_strength_duration', testData.observationsData.obs_strength_duration || '');
      params.append('obs_test_results', testData.observationsData.obs_test_results || '');
      params.append('obs_weight', testData.observationsData.obs_weight || '');
      params.append('obs_failure_pattern', testData.observationsData.obs_failure_pattern || '');
      params.append('obs_bonding', testData.observationsData.obs_bonding || '');
      params.append('obs_strength_criteria', testData.observationsData.obs_strength_criteria || '');
    } else {
      console.log('📊 NO OBSERVATIONS DATA - using defaults');
      params.append('obs_strength_duration', '');
      params.append('obs_test_results', '');
      params.append('obs_weight', '');
      params.append('obs_failure_pattern', '');
      params.append('obs_bonding', '');
      params.append('obs_strength_criteria', '');
    }
    
    // PASS COMPLETE TESTDATA TO HTML PAGE
    console.log('🔍 PASSING COMPLETE TESTDATA TO HTML PAGE');
    console.log('🔍 testData:', testData);
    console.log('🔍 testData.photos:', testData.photos);
    console.log('🔍 testData.capturedImages:', testData.capturedImages);
    console.log('🔍 testData keys:', Object.keys(testData));
    
    // CRITICAL DEBUG: Check if we have capturedImages from Node.js backend
    if (testData.capturedImages && Object.keys(testData.capturedImages).length > 0) {
      console.log('✅ FOUND capturedImages from Node.js backend!');
      console.log('📸 capturedImages keys:', Object.keys(testData.capturedImages));
      console.log('📸 Sample image data:', Object.keys(testData.capturedImages)[0], ':', testData.capturedImages[Object.keys(testData.capturedImages)[0]]?.substring(0, 50) + '...');
    } else {
      console.log('❌ NO capturedImages found in testData!');
      console.log('🔍 Available testData properties:', Object.keys(testData));
    }
    
    // Store testData WITHOUT images in sessionStorage to avoid quota exceeded
    const testDataWithoutImages = { ...testData };
    delete testDataWithoutImages.capturedImages;
    delete testDataWithoutImages.photos;
    
    sessionStorage.setItem(`testData_${testData.id}`, JSON.stringify(testDataWithoutImages));
    console.log('✅ TESTDATA STORED WITHOUT IMAGES IN SESSIONSTORAGE');
    console.log('📸 Images will be loaded directly from database in finalTestReport.html');
    
    // PRIORITY 1: Use capturedImages from database (most reliable)
    let capturedImages = testData.capturedImages || {};
    
    console.log('📸 Database capturedImages:', Object.keys(capturedImages));
    
    // If no capturedImages from database, try to convert photos array to capturedImages format
    if (!capturedImages || Object.keys(capturedImages).length === 0) {
      if (testData.photos && Array.isArray(testData.photos)) {
        console.log('📸 Converting photos array to capturedImages format');
        capturedImages = {};
        testData.photos.forEach((photo) => {
          const { photo_type, cube_number, photo_data } = photo;
          if (photo_data && typeof photo_data === 'string') {
            // Add data:image prefix if not present
            const imageData = photo_data.startsWith('data:image') ? photo_data : `data:image/jpeg;base64,${photo_data}`;
            // Create the key format expected by finalTestReport.html
            const key = `${photo_type}_${cube_number}`;
            capturedImages[key] = imageData;
            console.log(`📸 Converted photo: ${key}`);
          }
        });
      }
    }
    
    if (capturedImages && Object.keys(capturedImages).length > 0) {
      console.log('📸 Using capturedImages:', Object.keys(capturedImages));
      
      // DON'T pass images via URL parameters (too long) - use sessionStorage only
      console.log('📸 Images will be loaded from sessionStorage to avoid URL length issues');
      
    } else {
      console.log('⚠️ No capturedImages found in testData');
    }
    
    // Store the converted capturedImages in sessionStorage for finalTestReport.html
    if (capturedImages && Object.keys(capturedImages).length > 0) {
      sessionStorage.setItem(`testImages_${testRequestId}`, JSON.stringify(capturedImages));
      console.log('✅ Converted images stored in sessionStorage for test:', testRequestId);
    } else {
      console.warn('⚠️ No images to store in sessionStorage');
    }
    
    // Add cache buster to force browser to reload the HTML
    params.append('_t', Date.now());
    
    // Navigate to the existing HTML PDF file with parameters
    const reportUrl = `/finalTestReport.html?${params.toString()}`;
    console.log('🚀 Opening FINAL TEST REPORT with URL:', reportUrl);
    console.log('🚀 URL length:', reportUrl.length);
    
    // DEBUG: Check if images are in URL
    console.log('🔍 CHECKING URL FOR IMAGES:');
    console.log('🔍 front_failure_1:', params.get('front_failure_1') ? 'EXISTS' : 'MISSING');
    console.log('🔍 digital_reading_1:', params.get('digital_reading_1') ? 'EXISTS' : 'MISSING');
    console.log('🔍 back_failure_1:', params.get('back_failure_1') ? 'EXISTS' : 'MISSING');
    console.log('🔍 front_failure_2:', params.get('front_failure_2') ? 'EXISTS' : 'MISSING');
    console.log('🔍 digital_reading_2:', params.get('digital_reading_2') ? 'EXISTS' : 'MISSING');
    console.log('🔍 back_failure_2:', params.get('back_failure_2') ? 'EXISTS' : 'MISSING');
    
    // Open in new tab with proper handling
    console.log('🚀 Opening PDF in new tab...');
    const newWindow = window.open(reportUrl, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      console.error('❌ POPUP BLOCKED! Please allow popups for this site.');
      // Remove the alert popup - just log the error
      console.log('Please allow popups for this site and try again.');
    } else {
      console.log('✅ PDF opened in new tab successfully');
    }
  };

  return (
    <div style={{ backgroundColor: '#1C2333', minHeight: '100vh', padding: '20px 0' }}>
      <Container>
        {/* Header with Logos */}
        <Card style={{
          backgroundColor: '#1C2333',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          marginBottom: '20px'
        }}>
          <Card.Header style={{
            backgroundColor: '#1C2333',
            borderBottom: '2px solid #FFA500',
            padding: '20px'
          }}>
            <Row className="align-items-center">
              <Col md={2} className="text-center">
                <img 
                  src="/logo.png" 
                  alt="Vitrag Associates Logo" 
                  height="50"
                  style={{ borderRadius: '5px' }}
                />
              </Col>
              <Col md={8} className="text-center">
                <h2 style={{ 
                  color: '#ffffff', 
                  fontWeight: '700',
                  margin: '0'
                }}>
                  TEST REPORT
                </h2>
              </Col>
              <Col md={2} className="text-center">
                <img 
                  src="/nabl_logo_final.png" 
                  alt="NABL Logo" 
                  height="50"
                  style={{ borderRadius: '5px' }}
                />
              </Col>
            </Row>
          </Card.Header>

          <Card.Body style={{ backgroundColor: '#1C2333', padding: '30px' }}>
            {/* Customer Information Section */}
            <div className="mb-4">
              <Table style={{
                backgroundColor: '#1C2333',
                color: '#ffffff',
                borderCollapse: 'collapse'
              }}>
                <tbody>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: '25%'
                    }} rowSpan={2}>
                      Customer/Site Name & Address
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }} rowSpan={2}>
                      {testData.customerName}<br />
                      {testData.siteName}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: '18%'
                    }}>
                      Date of Report
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: '25%'
                    }}>
                      {new Date().toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      ULR Number
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.ulrNumber || testData.cubeTests[0]?.ulrNumber || ''}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Job Code Number
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.jobNumber}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Reference Number
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.sampleCodeNumber || ''}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Location/Structure Type
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }} colSpan={3}>
                      {testData.cubeTests[0]?.locationNature || ''}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Date of Receipt
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {formatDate(testData.receiptDate)}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Age of Specimen
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.ageInDays || ''} Days
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Date of Casting
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {formatDate(testData.cubeTests[0]?.castingDate)}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Date of Testing
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {formatDate(testData.cubeTests[0]?.testingDate)}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Type of Specimen
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Concrete Cube Specimen
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Grade of Specimen
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.grade || ''}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Condition of Specimen
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.cubeCondition || ''}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Curing Condition
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.curingCondition || ''}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Machine used for Testing
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }} colSpan={3}>
                      {testData.cubeTests[0]?.machineUsed || ''}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Location of Test
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }} colSpan={3}>
                      Permanent
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Capacity/Range
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      2000KN
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Calibration Due Date
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Test Method
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.testMethod || ''}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Environmental condition
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Not Applicable
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>

            {/* Test Sample Description */}
            <div className="mb-4">
              <h5 style={{
                backgroundColor: '#1C2333',
                color: '#FFD700',
                padding: '10px',
                textAlign: 'center',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px'
              }}>
                DESCRIPTION OF TEST SAMPLE
              </h5>
              <div className="table-responsive">
                <Table style={{
                  backgroundColor: '#1C2333',
                  color: '#ffffff',
                  borderCollapse: 'collapse',
                  margin: '0 auto',
                  width: 'auto'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: '#1C2333',
                      borderBottom: '2px solid #FFA500'
                    }}>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '70px'
                      }}>
                        Sr. No.
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100px'
                      }}>
                        ID Mark
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '70px'
                      }}>
                        L
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '70px'
                      }}>
                        B
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '70px'
                      }}>
                        H
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100px'
                      }}>
                        Area (mm²)
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100px'
                      }}>
                        Weight (kg)
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '120px'
                      }}>
                        Maximum Load (kN)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log('🔍 FIRST TABLE RENDER - testData.allTestResults:', testData?.allTestResults)}
                    {console.log('🔍 FIRST TABLE RENDER - length:', testData?.allTestResults?.length)}
                    {console.log('🔍 FIRST TABLE RENDER - testData exists:', !!testData)}
                    {console.log('🔍 FIRST TABLE RENDER - testData keys:', testData ? Object.keys(testData) : 'null')}
                    {console.log('🔍 FIRST TABLE RENDER - condition result:', testData?.allTestResults?.length > 0)}
                    {testData?.allTestResults?.length > 0 ? testData.allTestResults.map((result, index) => (
                      <tr key={index}>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.srNo}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.idMark}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.dimensionLength}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.dimensionWidth}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.dimensionHeight}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.area}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.weight}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.crushingLoad}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          fontStyle: 'italic'
                        }}>
                          {console.log('🔍 RENDERING NO DATA - testData:', testData)}
                          {console.log('🔍 RENDERING NO DATA - allTestResults:', testData?.allTestResults)}
                          {console.log('🔍 RENDERING NO DATA - length:', testData?.allTestResults?.length)}
                          {console.log('🔍 RENDERING NO DATA - condition failed:', !(testData?.allTestResults?.length > 0))}
                          No test data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* Test Results */}
            <div className="mb-4">
              <h5 style={{
                backgroundColor: '#1C2333',
                color: '#FFD700',
                padding: '10px',
                textAlign: 'center',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px'
              }}>
                Test Result for Compressive Strength of Concrete Cube
              </h5>
              <div className="table-responsive">
                <Table style={{
                  backgroundColor: '#1C2333',
                  color: '#ffffff',
                  borderCollapse: 'collapse',
                  margin: '0 auto',
                  width: 'auto'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: '#343a40',
                      borderBottom: '2px solid #FFA500'
                    }}>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100px'
                      }}>
                        Sr. No.
        
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '120px'
                      }}>
                        ID Mark
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '150px'
                      }}>
                        Density (kg/m³)
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '200px'
                      }}>
                        Compressive Strength (N/mm²)
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '220px'
                      }}>
                        Average Compressive Strength (N/mm²)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {testData?.allTestResults?.length > 0 ? testData.allTestResults.map((result, index) => (
                      <tr key={index}>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.srNo}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.idMark}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.density}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.compressiveStrength}
                        </td>
                        {index === 0 && (
                          <td style={{
                            color: '#ffffff',
                            textAlign: 'center',
                            padding: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            verticalAlign: 'middle'
                          }} rowSpan={testData.allTestResults?.length}>
                            {testData.averageStrength || testData.average_strength || 'N/A'}
                          </td>
                        )}
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          fontStyle: 'italic'
                        }}>
                          {console.log('🔍 SECOND TABLE NO DATA - testData:', testData)}
                          {console.log('🔍 SECOND TABLE NO DATA - allTestResults:', testData?.allTestResults)}
                          {console.log('🔍 SECOND TABLE NO DATA - length:', testData?.allTestResults?.length)}
                          {console.log('🔍 SECOND TABLE NO DATA - condition failed:', !(testData?.allTestResults?.length > 0))}
                          No test data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-4">
              <h5 style={{
                backgroundColor: '#1C2333',
                color: '#FFD700',
                padding: '10px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px'
              }}>
                Terms & Conditions –
              </h5>
              <ul style={{
                backgroundColor: '#1C2333',
                color: '#ffffff',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px'
              }}>
                <li style={{ marginBottom: '10px' }}>Samples were not drawn by VAs lab.</li>
                <li style={{ marginBottom: '10px' }}>The Test Reports & Results pertain to Sample/ Samples of material received by VAs.</li>
                <li style={{ marginBottom: '10px' }}>The Test Report cannot be reproduced without the written approval of CEO/QM of VAs.</li>
                <li style={{ marginBottom: '10px' }}>Any change/ correction/ alteration to the Test Report shall be invalid.</li>
                <li style={{ marginBottom: '10px' }}>The role VAs is restricted to testing of the material sample as received in the laboratory. VAs or any of its employees shall not be liable for any dispute/ litigation arising between the customer & Third Party on account of test results. VAs shall not interact with any Third Party in this regard.</li>
                <li>The CEO of VAs may make necessary changes to the terms & conditions without any prior notice.</li>
              </ul>
            </div>

            {/* Reviewer Selection */}
            <div className="mb-4">
              <Card style={{
                backgroundColor: '#1C2333',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Card.Header style={{
                  backgroundColor: '#FFA500',
                  color: '#000000',
                  padding: '10px'
                }}>
                  <h6 className="mb-0">Select Report Reviewer</h6>
                </Card.Header>
                <Card.Body style={{ padding: '15px' }}>
                  <Row>
                    <Col md={6}>
                      <Form.Label style={{ color: '#ffffff' }}>Select Reviewer:</Form.Label>
                      <Form.Select
                        value={selectedReviewer}
                        onChange={handleReviewerChange}
                        style={{
                          backgroundColor: '#495057',
                          borderColor: '#6c757d',
                          color: '#ffffff'
                        }}
                      >
                        {reviewers.map(reviewer => (
                          <option key={reviewer.id} value={reviewer.id}>
                            {reviewer.name} - {reviewer.designation}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={6} className="d-flex align-items-end">
                      <Button
                        variant="success"
                        size="sm"
                        style={{
                          backgroundColor: '#28a745',
                          borderColor: '#28a745',
                          color: '#ffffff'
                        }}
                      >
                        <FontAwesomeIcon icon={faSave} className="me-1" />
                        Update Reviewer
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>

            {/* Authorization Section */}
            <Row className="mb-4">
              <Col md={6}>
                <div className="text-center" style={{
                  backgroundColor: '#1C2333',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '5px'
                }}>
                  <p className="mb-2 fw-bold" style={{ color: '#FFD700' }}>Reviewed by –</p>
                  <p className="mb-1 fw-bold" style={{ color: '#ffffff' }}>{reviewerInfo.name}</p>
                  <p className="mb-1" style={{ color: '#ffffff' }}>({reviewerInfo.designation})</p>
                  <p className="mb-0 fst-italic" style={{ color: '#ffffff' }}>{reviewerInfo.graduation}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-center" style={{
                  backgroundColor: '#1C2333',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '5px'
                }}>
                  <p className="mb-2 fw-bold" style={{ color: '#FFD700' }}>Authorized by –</p>
                  <p className="mb-1 fw-bold" style={{ color: '#ffffff' }}>Mr. Prakarsh A Sangave</p>
                  <p className="mb-1" style={{ color: '#ffffff' }}>(Chief Executive Officer)</p>
                  <p className="mb-1 fst-italic" style={{ color: '#ffffff' }}>M.E(Civil-Structures)</p>
                  <p className="mb-0 fst-italic" style={{ color: '#ffffff' }}>MTech (Civil-Geotechnical), M.I.E, F.I.E.</p>
                </div>
              </Col>
            </Row>

            {/* Report Footer */}
            <div className="text-center border-top pt-3" style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              paddingTop: '20px'
            }}>
              <p style={{ color: '#ffffff' }}>
                X-----------X-----------X-----------X----------END OF REPORT----------X-----------X-----------X-----------X
              </p>
            </div>

            {/* Action Buttons */}
            <div className="text-center mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate('/view-sample', { state: { testData } })}
                style={{
                  backgroundColor: '#6c757d',
                  borderColor: '#6c757d',
                  color: '#ffffff'
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                Back to Test Details
              </Button>
              
              <Button
                variant="info"
                className="me-2"
                onClick={handleViewObservationSheet}
                style={{
                  backgroundColor: '#17a2b8',
                  borderColor: '#17a2b8',
                  color: '#ffffff'
                }}
              >
                <FontAwesomeIcon icon={faFlask} className="me-1" />
                View Observation Sheet (1 Page)
              </Button>
              
              <Button
                variant="warning"
                className="me-2"
                onClick={handleViewPDF}
                style={{
                  backgroundColor: '#FFA500',
                  borderColor: '#FFA500',
                  color: '#000000'
                }}
              >
                <FontAwesomeIcon icon={faFilePdf} className="me-1" />
                View Final Test Report (3 Pages)
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TestReportPreview;