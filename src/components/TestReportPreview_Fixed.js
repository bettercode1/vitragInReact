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
import databaseService from '../services/database';

const TestReportPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  
  // Get test request ID from location state
  const testRequestId = location.state?.testRequestId || location.state?.testData?.id || location.state?.id;
  
  // Debug logging
  console.log('🔍 TestReportPreview - testRequestId:', testRequestId);
  console.log('🔍 TestReportPreview - location.state:', location.state);
  
  // Fetch data from backend
  useEffect(() => {
    const fetchTestData = async () => {
      if (!testRequestId) {
        console.error('❌ NO TEST REQUEST ID!');
        setError('No test request ID provided. Please navigate from a test sample.');
        setLoading(false);
        return;
      }
      
      try {
        console.log('🔍 Fetching COMPLETE PDF data for ID:', testRequestId);
        
        // Use the new PDF data endpoint that fetches from ALL required tables
        const data = await databaseService.getTestRequestPDFData(testRequestId);
        console.log('✅ Fetched COMPLETE PDF data:', data);
        
        // Transform PDF data to match component's expected format
        const mainTest = data.main_test || {};
        const strengthData = mainTest.test_results_json || {};
        const observationsData = mainTest.observations_json || {};
        
        console.log('🔍 Data Structure:');
        console.log('  test_request:', data.test_request);
        console.log('  customer:', data.customer);
        console.log('  main_test:', mainTest);
        console.log('  strengthData:', strengthData);
        console.log('  observationsData:', observationsData);
        console.log('  photos:', data.photos);
        
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
          siteName: data.test_request.site_name || 'N/A',
          siteAddress: data.customer.address || 'N/A',
          receiptDate: data.test_request.receipt_date || 'N/A',
          status: data.test_request.status || 'pending',
          ulrNumber: data.test_request.ulr_number || 'N/A',
          referenceNumber: mainTest.sample_code_number || 'N/A',
          cubeTests: [{
            id: mainTest.id || 1,
            idMark: mainTest.id_mark || 'N/A',
            locationNature: mainTest.location_nature || 'N/A',
            grade: mainTest.grade || 'N/A',
            castingDate: mainTest.casting_date || 'N/A',
            testingDate: mainTest.testing_date || 'N/A',
            ageInDays: mainTest.age_in_days || calculateAge(mainTest.casting_date, mainTest.testing_date),
            quantity: mainTest.num_of_cubes || 3,
            testMethod: mainTest.test_method || 'IS 516 (Part1/Sec1):2021',
            sampleCodeNumber: mainTest.sample_code_number || 'N/A',
            ulrNumber: mainTest.ulr_number || data.test_request.ulr_number || 'N/A',
            machineUsed: mainTest.machine_used || 'CTM (2000KN)',
            cubeCondition: mainTest.cube_condition || 'Acceptable',
            curingCondition: mainTest.curing_condition || 'N/A',
            averageStrength: mainTest.average_strength || 'N/A',
            testedBy: mainTest.tested_by || 'N/A',
            checkedBy: mainTest.checked_by || 'N/A',
            verifiedBy: mainTest.verified_by || 'Mr. P A Sanghave',
            testRemarks: mainTest.test_remarks || 'N/A',
            // Use testRows from observations data for individual cube data
            testResults: observationsData.testRows?.map((row, i) => {
              // Calculate density if not provided
              let density = row.density;
              if (!density && row.length && row.breadth && row.height && row.weight) {
                const length = parseFloat(row.length);
                const breadth = parseFloat(row.breadth);
                const height = parseFloat(row.height);
                const weight = parseFloat(row.weight);
                const volume = (length * breadth * height) / 1000000; // Convert mm³ to m³
                density = volume > 0 ? (weight / volume).toFixed(0) : 'N/A';
              }
              
              return {
                srNo: row.id || i + 1,
                idMark: row.cubeId || 'N/A',
                dimensionLength: parseFloat(row.length) || 150,
                dimensionWidth: parseFloat(row.breadth) || 150,
                dimensionHeight: parseFloat(row.height) || 150,
                area: parseFloat(row.area) ? parseFloat(row.area).toFixed(3) : '22500.000',
                weight: row.weight || 'N/A',
                crushingLoad: row.crushingLoad || 'N/A',
                density: density || 'N/A',
                compressiveStrength: row.compressiveStrength || 'N/A'
              };
            }) || []
          }],
          // Add strength data from graph
          strengthData: strengthData,
          // Add photos data
          photos: data.photos || []
        };
        
        console.log('✅ Transformed data for preview:', transformedData);
        setTestData(transformedData);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Error fetching test data:', error);
        setError(`Failed to fetch test data: ${error.message}`);
        setLoading(false);
      }
    };
    
    fetchTestData();
  }, [testRequestId]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleGeneratePDF = () => {
    if (testData) {
      navigate(`/generate-pdf/${testData.id}`, {
        state: { testData }
      });
    }
  };
  
  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading test data...</p>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }
  
  if (!testData) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>No Data</Alert.Heading>
          <p>No test data found for this request.</p>
          <Button variant="outline-warning" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }
  
  const firstCubeTest = testData.cubeTests[0];
  
  return (
    <Container className="mt-4">
      <style jsx>{`
        .report-container {
          background-color: #1C2333;
          color: #ffffff;
          min-height: 100vh;
          padding: 20px;
        }
        .report-header {
          background-color: #2C3E50;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .report-section {
          background-color: #34495E;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }
        .table-dark th {
          background-color: #2C3E50;
          color: #FFD700;
        }
        .table-dark td {
          background-color: #1C2333;
          color: #ffffff;
        }
      `}</style>
      
      <div className="report-container">
        {/* Header */}
        <div className="report-header">
          <Row className="align-items-center">
            <Col>
              <h2 className="mb-0 text-center text-warning">
                <FontAwesomeIcon icon={faFlask} className="me-2" />
                TEST REPORT PREVIEW
              </h2>
              <p className="text-center text-muted mb-0">
                Complete data from database - test_request, concrete_test, test_photo tables
              </p>
            </Col>
            <Col xs="auto">
              <Button variant="outline-light" onClick={handleBack}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back
              </Button>
            </Col>
          </Row>
        </div>
        
        {/* Test Request Information */}
        <div className="report-section">
          <h4 className="text-warning mb-3">
            <FontAwesomeIcon icon={faBuilding} className="me-2" />
            Test Request Information
          </h4>
          <Row>
            <Col md={6}>
              <p><strong>Job Number:</strong> {testData.jobNumber}</p>
              <p><strong>Customer:</strong> {testData.customerName}</p>
              <p><strong>Site:</strong> {testData.siteName}</p>
              <p><strong>Address:</strong> {testData.siteAddress}</p>
            </Col>
            <Col md={6}>
              <p><strong>ULR Number:</strong> {testData.ulrNumber}</p>
              <p><strong>Reference Number:</strong> {testData.referenceNumber}</p>
              <p><strong>Receipt Date:</strong> {testData.receiptDate}</p>
              <p><strong>Status:</strong> <Badge bg="success">{testData.status}</Badge></p>
            </Col>
          </Row>
        </div>
        
        {/* Test Details */}
        <div className="report-section">
          <h4 className="text-warning mb-3">
            <FontAwesomeIcon icon={faCog} className="me-2" />
            Test Details
          </h4>
          <Row>
            <Col md={6}>
              <p><strong>ID Mark:</strong> {firstCubeTest.idMark}</p>
              <p><strong>Location/Nature:</strong> {firstCubeTest.locationNature}</p>
              <p><strong>Grade:</strong> {firstCubeTest.grade}</p>
              <p><strong>Age in Days:</strong> {firstCubeTest.ageInDays}</p>
            </Col>
            <Col md={6}>
              <p><strong>Casting Date:</strong> {firstCubeTest.castingDate}</p>
              <p><strong>Testing Date:</strong> {firstCubeTest.testingDate}</p>
              <p><strong>Test Method:</strong> {firstCubeTest.testMethod}</p>
              <p><strong>Machine Used:</strong> {firstCubeTest.machineUsed}</p>
            </Col>
          </Row>
        </div>
        
        {/* Test Results */}
        {firstCubeTest.testResults && firstCubeTest.testResults.length > 0 && (
          <div className="report-section">
            <h4 className="text-warning mb-3">
              <FontAwesomeIcon icon={faFlask} className="me-2" />
              Test Results (From Database)
            </h4>
            <Table striped bordered hover variant="dark" className="table-sm">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>ID Mark</th>
                  <th>Length (mm)</th>
                  <th>Breadth (mm)</th>
                  <th>Height (mm)</th>
                  <th>Area (mm²)</th>
                  <th>Weight (kg)</th>
                  <th>Density (kg/m³)</th>
                  <th>Crushing Load (kN)</th>
                  <th>Compressive Strength (MPa)</th>
                </tr>
              </thead>
              <tbody>
                {firstCubeTest.testResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.srNo}</td>
                    <td>{result.idMark}</td>
                    <td>{result.dimensionLength}</td>
                    <td>{result.dimensionWidth}</td>
                    <td>{result.dimensionHeight}</td>
                    <td>{result.area}</td>
                    <td>{result.weight}</td>
                    <td>{result.density}</td>
                    <td>{result.crushingLoad}</td>
                    <td>{result.compressiveStrength}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        
        {/* Strength Data from Graph */}
        {testData.strengthData && Object.keys(testData.strengthData).length > 0 && (
          <div className="report-section">
            <h4 className="text-warning mb-3">
              <FontAwesomeIcon icon={faFlask} className="me-2" />
              Strength Graph Data (From Database)
            </h4>
            <Row>
              <Col md={4}>
                <p><strong>7 Days:</strong> Required: {testData.strengthData.required_7 || 'N/A'}, Actual: {testData.strengthData.actual_7 || 'N/A'}</p>
              </Col>
              <Col md={4}>
                <p><strong>14 Days:</strong> Required: {testData.strengthData.required_14 || 'N/A'}, Actual: {testData.strengthData.actual_14 || 'N/A'}</p>
              </Col>
              <Col md={4}>
                <p><strong>28 Days:</strong> Required: {testData.strengthData.required_28 || 'N/A'}, Actual: {testData.strengthData.actual_28 || 'N/A'}</p>
              </Col>
            </Row>
          </div>
        )}
        
        {/* Photos */}
        {testData.photos && testData.photos.length > 0 && (
          <div className="report-section">
            <h4 className="text-warning mb-3">
              <FontAwesomeIcon icon={faFlask} className="me-2" />
              Test Photos (From Database)
            </h4>
            <p><strong>Number of Photos:</strong> {testData.photos.length}</p>
            <Row>
              {testData.photos.map((photo, index) => (
                <Col md={4} key={index} className="mb-3">
                  <Card className="bg-dark text-white">
                    <Card.Body>
                      <p><strong>Type:</strong> {photo.photo_type}</p>
                      <p><strong>Cube:</strong> {photo.cube_number}</p>
                      <p><strong>Filename:</strong> {photo.filename}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
        
        {/* Verification */}
        <div className="report-section">
          <h4 className="text-warning mb-3">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Verification
          </h4>
          <Row>
            <Col md={4}>
              <p><strong>Tested By:</strong> {firstCubeTest.testedBy}</p>
            </Col>
            <Col md={4}>
              <p><strong>Checked By:</strong> {firstCubeTest.checkedBy}</p>
            </Col>
            <Col md={4}>
              <p><strong>Verified By:</strong> {firstCubeTest.verifiedBy}</p>
            </Col>
          </Row>
          <p><strong>Average Strength:</strong> {firstCubeTest.averageStrength}</p>
          <p><strong>Test Remarks:</strong> {firstCubeTest.testRemarks}</p>
        </div>
        
        {/* Actions */}
        <div className="report-section">
          <h4 className="text-warning mb-3">Actions</h4>
          <Button variant="success" size="lg" onClick={handleGeneratePDF}>
            <FontAwesomeIcon icon={faFilePdf} className="me-2" />
            Generate PDF with Real Data
          </Button>
        </div>
        
        {/* Debug Info */}
        <div className="report-section">
          <h4 className="text-warning mb-3">Debug Information</h4>
          <p><strong>Test Request ID:</strong> {testRequestId}</p>
          <p><strong>Data Source:</strong> Database (test_request + concrete_test + test_photo tables)</p>
          <p><strong>Status:</strong> ✅ Using real data from database</p>
        </div>
      </div>
    </Container>
  );
};

export default TestReportPreview;
