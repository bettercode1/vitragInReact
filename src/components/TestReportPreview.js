import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import axios from 'axios';

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
      if (!testRequestId) {
        console.error('❌ NO TEST REQUEST ID!');
        console.error('   location.state:', location.state);
        console.error('   location.state?.testData:', location.state?.testData);
        console.error('   location.state?.id:', location.state?.id);
        setError('No test request ID provided. Please navigate from a test sample.');
        setLoading(false);
        return;
      }
      
      try {
        console.log('🔍 Fetching test data for ID:', testRequestId);
        const response = await axios.get(`http://localhost:5000/api/test-requests/${testRequestId}/details`);
        const data = response.data;
        
        console.log('✅ Fetched data:', data);
        
        // Get the first concrete test
        const firstTest = data.concrete_tests?.[0] || {};
        
        // Parse JSON fields
        let strengthData = {};
        let observationsData = {};
        
        console.log('🔍 Raw JSON from DB:');
        console.log('  test_results_json:', firstTest.test_results_json);
        console.log('  observations_json:', firstTest.observations_json);
        
        try {
          if (firstTest.test_results_json) {
            strengthData = JSON.parse(firstTest.test_results_json);
            console.log('✅ Parsed strengthData:', strengthData);
          } else {
            console.warn('⚠️ No test_results_json found!');
          }
          
          if (firstTest.observations_json) {
            observationsData = JSON.parse(firstTest.observations_json);
            console.log('✅ Parsed observationsData:', observationsData);
          } else {
            console.warn('⚠️ No observations_json found!');
          }
        } catch (parseError) {
          console.error('❌ Error parsing JSON fields:', parseError);
        }
        
        // Calculate age in days
        const calculateAge = (castingDate, testingDate) => {
          if (!castingDate || !testingDate) return 'N/A';
          const casting = new Date(castingDate);
          const testing = new Date(testingDate);
          const diffTime = Math.abs(testing - casting);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        };
        
        // Transform backend data to match component's expected format
        const transformedData = {
          id: data.test_request.id,
          jobNumber: data.test_request.job_number || 'N/A',
          customerName: data.customer.name || 'N/A',
          siteName: data.test_request.site_name || 'N/A',
          siteAddress: data.customer.address || 'N/A',
          receiptDate: data.test_request.receipt_date || 'N/A',
          status: data.test_request.status || 'pending',
          ulrNumber: data.test_request.ulr_number || firstTest.ulr_number || data.test_request.ulr_number || 'N/A',
          referenceNumber: firstTest.sample_code_number || data.test_request.sample_code_number || 'N/A',
          cubeTests: data.concrete_tests.map((ct, index) => {
            // Build test results array from the single concrete test data
            const testResults = [];
            
            // If we have test data, create entries based on quantity
            const quantity = ct.quantity || ct.num_of_cubes || 3;
            
            for (let i = 0; i < quantity; i++) {
              const area = ct.dimension_length && ct.dimension_width 
                ? (ct.dimension_length * ct.dimension_width).toFixed(2)
                : 22500; // Default 150x150
              
              const density = ct.weight && ct.dimension_length && ct.dimension_width && ct.dimension_height
                ? ((ct.weight * 1000000) / (ct.dimension_length * ct.dimension_width * ct.dimension_height)).toFixed(0)
                : 'N/A';
              
              testResults.push({
                srNo: i + 1,
                idMark: `${ct.idMark || 'C'}${i + 1}`,
                dimensionLength: ct.dimension_length || 150,
                dimensionWidth: ct.dimension_width || 150,
                dimensionHeight: ct.dimension_height || 150,
                area: area,
                weight: ct.weight || 'N/A',
                crushingLoad: ct.crushing_load || 'N/A',
                density: density,
                compressiveStrength: ct.compressive_strength || 'N/A'
              });
            }
            
            return {
              id: ct.id,
              idMark: ct.idMark || 'N/A',
              locationNature: ct.locationNature || 'N/A',
              grade: ct.grade || 'N/A',
              castingDate: ct.castingDate || 'N/A',
              testingDate: ct.testingDate || 'N/A',
              ageInDays: ct.age_in_days || calculateAge(ct.castingDate, ct.testingDate),
              quantity: quantity,
              testMethod: ct.testMethod || 'IS 516 (Part1/Sec1):2021',
              sampleCodeNumber: ct.sample_code_number || 'N/A',
              ulrNumber: ct.ulr_number || 'N/A',
              machineUsed: ct.machine_used || 'CTM (2000KN)',
              cubeCondition: ct.cube_condition || 'Acceptable',
              curingCondition: ct.curing_condition || 'Water Curing',
              sampleDescription: ct.sample_description || 'Concrete Cube Specimen',
              testedBy: ct.tested_by || 'N/A',
              checkedBy: ct.checked_by || 'N/A',
              verifiedBy: ct.verified_by || 'Mr. P A Sanghave',
              averageStrength: ct.average_strength || ct.compressive_strength || 0,
              testResults: testResults,
              // Add individual measurements
              weight: ct.weight || 'N/A',
              dimensionLength: ct.dimension_length || 150,
              dimensionWidth: ct.dimension_width || 150,
              dimensionHeight: ct.dimension_height || 150,
              crushingLoad: ct.crushing_load || 'N/A',
              compressiveStrength: ct.compressive_strength || 'N/A',
              failureType: ct.failure_type || 'N/A',
              testRemarks: ct.test_remarks || ''
            };
          }),
          strengthData: strengthData,
          observationsData: observationsData
        };
        
        console.log('✅ Transformed data:', transformedData);
        setTestData(transformedData);
        setLoading(false);
        
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
  if (error || !testData) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Test Report</Alert.Heading>
          <p>{error || 'Test data not found'}</p>
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
    if (!dateString) return 'N/A';
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
    params.append('reference_number', cubeTest.sampleCodeNumber || testData.referenceNumber || '');
    params.append('date_of_testing', cubeTest.testingDate || '');
    params.append('date_of_casting', cubeTest.castingDate || '');
    params.append('grade_of_blocks', cubeTest.grade || testData.grade || 'M25'); // Grade of cube
    params.append('sample_description', testData.sampleDescription || 'Concrete Cube Specimen');
    params.append('blocks_condition', testData.cubeCondition || 'Acceptable');
    params.append('curing_condition', testData.curingCondition || '');
    params.append('machine_used_for_testing', testData.machineUsed || 'CTM (2000KN)');
    params.append('test_method', cubeTest.testMethod || testData.testMethod || 'IS 516 (Part1/Sec1):2021'); // Test method
    
    // Test results
    const testResults = cubeTest.testResults || [];
    testResults.forEach((result, index) => {
      const i = index + 1;
      params.append(`block_id_${i}`, result.idMark || `C${i}`);
      params.append(`length_${i}`, result.dimensionLength || '');
      params.append(`breadth_${i}`, result.dimensionWidth || '');
      params.append(`height_${i}`, result.dimensionHeight || '');
      params.append(`area_${i}`, result.area || '');
      params.append(`weight_${i}`, result.weight || '');
      params.append(`load_max_${i}`, result.crushingLoad || '');
      params.append(`compressive_strength_${i}`, result.compressiveStrength || '');
    });
    
    // Get tested/checked/verified by from cubeTest (user input from TestObservations)
    console.log('🔍 FULL cubeTest object:', cubeTest);
    console.log('🔍 cubeTest.testedBy:', cubeTest.testedBy);
    console.log('🔍 cubeTest.checkedBy:', cubeTest.checkedBy);
    console.log('🔍 cubeTest.verifiedBy:', cubeTest.verifiedBy);
    
    params.append('tested_by_name', cubeTest.testedBy || '');
    params.append('checked_by_name', cubeTest.checkedBy || '');
    params.append('verified_by_name', cubeTest.verifiedBy || '');
    
    // Add dates (use testing date as default for all signatures)
    const signatureDate = cubeTest.testingDate || new Date().toLocaleDateString('en-GB');
    params.append('tested_by_date', signatureDate);
    params.append('checked_by_date', signatureDate);
    params.append('verified_by_date', signatureDate);
    
    // Add remarks
    params.append('remarks', cubeTest.testRemarks || '');
    
    console.log('📋 Observation Sheet URL Params:', {
      tested_by_name: cubeTest.testedBy,
      checked_by_name: cubeTest.checkedBy,
      verified_by_name: cubeTest.verifiedBy,
      remarks: cubeTest.testRemarks,
      signatureDate: signatureDate
    });
    
    window.open(`/cubeTestingReport.html?${params.toString()}`, '_blank');
  };
  
  // Function to view FULL REPORT (Pages 2-4)
  const handleViewPDF = () => {
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
    params.append('ulr_number', testData.ulrNumber || cubeTest.ulrNumber || 'N/A');
    params.append('reference_number', testData.referenceNumber || cubeTest.sampleCodeNumber || 'N/A');
    
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
    const testResults = cubeTest.testResults || testData.testResults || testData.rows || [];
    console.log('Test Results:', testResults); // Debug log
    
    testResults.forEach((result, index) => {
      const i = index + 1;
      params.append(`block_id_${i}`, result.cubeId || result.idMark || '');
      params.append(`length_${i}`, result.length || result.dimensionLength || '');
      params.append(`breadth_${i}`, result.breadth || result.dimensionWidth || '');
      params.append(`height_${i}`, result.height || result.dimensionHeight || '');
      params.append(`area_${i}`, result.area || '');
      params.append(`weight_${i}`, result.weight || '');
      params.append(`load_max_${i}`, result.crushingLoad || '');
      params.append(`density_${i}`, result.density || '');
      params.append(`compressive_strength_${i}`, result.compressiveStrength || '');
      params.append(`failure_type_${i}`, result.failureType || '-');
    });
    
    // Average strength from backend or calculated
    const avgStrength = cubeTest.averageStrength || testData.averageStrength || '';
    params.append('average_strength', avgStrength);
    console.log('📊 Average Strength being sent:', avgStrength);
    
    // Remarks - from TestObservations
    params.append('remarks', cubeTest.testRemarks || testData.testRemarks || testData.remarks || '');
    
    // Verification/Authorization - from TestObservations
    params.append('tested_by_name', cubeTest.testedBy || testData.testedBy || 'John Doe');
    params.append('tested_by_date', testData.testedDate || new Date().toLocaleDateString('en-GB'));
    params.append('checked_by_name', testData.checkedBy || 'Jane Smith');
    params.append('checked_by_date', testData.checkedDate || new Date().toLocaleDateString('en-GB'));
    params.append('verified_by_name', testData.verifiedBy || reviewerInfo.name || 'Prakarsh A Sangave');
    params.append('verified_by_date', testData.verifiedDate || new Date().toLocaleDateString('en-GB'));
    
    // Strength Graph Data - from StrengthGraph
    console.log('🔍 FULL testData object:', testData);
    console.log('🔍 testData.strengthData:', testData.strengthData);
    console.log('🔍 testData.observationsData:', testData.observationsData);
    console.log('🔍 cubeTest:', cubeTest);
    
    if (testData.strengthData) {
      const r7 = testData.strengthData.required_7 || '15.0';
      const a7 = testData.strengthData.actual_7 || '0';
      const r14 = testData.strengthData.required_14 || '22.5';
      const a14 = testData.strengthData.actual_14 || '0';
      const r28 = testData.strengthData.required_28 || '30.0';
      const a28 = testData.strengthData.actual_28 || '0';
      
      console.log('📊 STRENGTH VALUES BEING SENT:', {r7, a7, r14, a14, r28, a28});
      
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
      console.warn('No strengthData found in testData!');
    }
    
    // Observations Data (6 observation points) - from StrengthGraph
    console.log('testData.observationsData:', testData.observationsData);
    if (testData.observationsData) {
      params.append('obs_strength_duration', testData.observationsData.obs_strength_duration || '');
      params.append('obs_test_results', testData.observationsData.obs_test_results || '');
      params.append('obs_weight', testData.observationsData.obs_weight || '');
      params.append('obs_failure_pattern', testData.observationsData.obs_failure_pattern || '');
      params.append('obs_bonding', testData.observationsData.obs_bonding || '');
      params.append('obs_strength_criteria', testData.observationsData.obs_strength_criteria || '');
    }
    
    // Store images in sessionStorage for PDF access
    if (testData.capturedImages || testData.cubeTests?.[0]?.capturedImages) {
      const images = testData.capturedImages || testData.cubeTests?.[0]?.capturedImages || {};
      console.log('📸 Storing images in sessionStorage:', Object.keys(images));
      sessionStorage.setItem('testImages_' + testData.id, JSON.stringify(images));
    } else {
      console.warn('⚠️ No capturedImages found in testData');
    }
    
    // Add cache buster to force browser to reload the HTML
    params.append('_t', Date.now());
    
    // Navigate to the existing HTML PDF file with parameters
    const reportUrl = `/cubeTestingReport.html?${params.toString()}`;
    console.log('🚀 Opening report with URL:', reportUrl);
    console.log('🚀 URL length:', reportUrl.length);
    window.open(reportUrl, '_blank');
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
                      {testData.ulrNumber || testData.cubeTests[0]?.ulrNumber || 'N/A'}
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
                      {testData.cubeTests[0]?.sampleCodeNumber || 'N/A'}
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
                      {testData.cubeTests[0]?.locationNature || 'N/A'}
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
                      {testData.cubeTests[0]?.ageInDays || 'N/A'} Days
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
                      {testData.cubeTests[0]?.grade || 'N/A'}
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
                      {testData.cubeTests[0]?.cubeCondition || 'N/A'}
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
                      {testData.cubeTests[0]?.curingCondition || 'N/A'}
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
                      {testData.cubeTests[0]?.machineUsed || 'N/A'}
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
                      {testData.cubeTests[0]?.testMethod || 'N/A'}
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
                    {testData.cubeTests[0]?.testResults?.map((result, index) => (
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
                    ))}
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
                    {testData.cubeTests[0]?.testResults?.map((result, index) => (
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
                          }} rowSpan={testData.cubeTests[0]?.testResults?.length}>
                            {testData.cubeTests[0]?.averageStrength}
                          </td>
                        )}
                      </tr>
                    ))}
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
                View Observation Sheet
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
                View Full Report
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TestReportPreview;
