import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import databaseService from '../services/database';

const TestObservations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get test data from location state
  const { testData, testRequest, testIndex } = location.state || {};
  
  const [formData, setFormData] = useState({
    sampleDescription: 'Concrete Cube Specimen',
    cubeCondition: 'Good',
    curingCondition: '',
    machineUsed: 'Universal Testing Machine',
    testMethod: 'IS 516 (Part1/Sec1):2021',
    averageStrength: '',
    testedBy: '',
    checkedBy: '',
    verifiedBy: 'Mr. P A Sanghave',
    testRemarks: '',
    rows: []
  });

  const [testRows, setTestRows] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedImages, setCapturedImages] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [saveProgress, setSaveProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState(null);

  // Initialize test rows based on number of cubes
  useEffect(() => {
    const numCubes = testData?.quantity || 3;
    const actualCubes = Math.min(Math.max(numCubes, 1), 3);
    
    const initialRows = [];
    for (let i = 1; i <= actualCubes; i++) {
      initialRows.push({
        id: i,
        cubeId: `C${i}`,
        length: '',
        breadth: '',
        height: '',
        area: '',
        weight: '',
        density: '',
        crushingLoad: '',
        compressiveStrength: '',
        failureType: ''
      });
    }
    setTestRows(initialRows);
  }, [testData]);

  // Load saved data if available
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const testRequestId = testRequest?.id || testData?.id;
        if (testRequestId) {
          // Try to load from database first
          const savedData = await databaseService.getTestObservations(testRequestId);
          if (savedData) {
            setFormData(prev => ({ ...prev, ...savedData.formData }));
            setTestRows(savedData.testRows || []);
            setCapturedImages(savedData.capturedImages || {});
            return;
          }
        }
        
        // Fallback to localStorage
        const storageKey = `test_observations_${testRequest?.id || testData?.id || 'temp'}`;
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData(prev => ({ ...prev, ...parsedData.formData }));
          setTestRows(parsedData.testRows || []);
          setCapturedImages(parsedData.capturedImages || {});
        }
      } catch (error) {
        console.warn('Failed to load saved data:', error);
      }
    };

    loadSavedData();
  }, [testRequest?.id, testData?.id]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateWeight = (weight) => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum)) return 'Please enter a valid number';
    if (weightNum < 8.3 || weightNum > 8.4) {
      return 'Please enter a valid value, from 8.3 to 8.4';
    }
    return null;
  };

  const handleRowChange = (rowIndex, field, value) => {
    setTestRows(prev => prev.map((row, index) => {
      if (index === rowIndex) {
        const updatedRow = { ...row, [field]: value };
        
        // Validate weight field
        if (field === 'weight') {
          const weightError = validateWeight(value);
          setValidationErrors(prev => ({
            ...prev,
            [`weight_${rowIndex}`]: weightError
          }));
        }
        
        // Calculate area if length and breadth are provided
        if (field === 'length' || field === 'breadth') {
          const length = field === 'length' ? parseFloat(value) : parseFloat(row.length);
          const breadth = field === 'breadth' ? parseFloat(value) : parseFloat(row.breadth);
          
          if (length && breadth && length > 0 && breadth > 0) {
            updatedRow.area = (length * breadth).toFixed(1);
          }
        }
        
        // Calculate density if all dimensions and weight are provided
        if (['length', 'breadth', 'height', 'weight'].includes(field)) {
          const length = field === 'length' ? parseFloat(value) : parseFloat(row.length);
          const breadth = field === 'breadth' ? parseFloat(value) : parseFloat(row.breadth);
          const height = field === 'height' ? parseFloat(value) : parseFloat(row.height);
          const weight = field === 'weight' ? parseFloat(value) : parseFloat(row.weight);
          
          if (length && breadth && height && weight && 
              length > 0 && breadth > 0 && height > 0 && weight > 0) {
            const lengthInMeters = length / 1000;
            const breadthInMeters = breadth / 1000;
            const heightInMeters = height / 1000;
            const volumeInCubicMeters = lengthInMeters * breadthInMeters * heightInMeters;
            const density = weight / volumeInCubicMeters;
            updatedRow.density = density.toFixed(1);
          }
        }
        
        return updatedRow;
      }
      return row;
    }));
  };

  const addRow = () => {
    if (testRows.length < 3) {
      const newRow = {
        id: testRows.length + 1,
        cubeId: `C${testRows.length + 1}`,
        length: '',
        breadth: '',
        height: '',
        area: '',
        weight: '',
        density: '',
        crushingLoad: '',
        compressiveStrength: '',
        failureType: ''
      };
      setTestRows(prev => [...prev, newRow]);
    }
  };

  const removeRow = (rowIndex) => {
    if (testRows.length > 1) {
      setTestRows(prev => prev.filter((_, index) => index !== rowIndex));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    setSaveProgress(0);
    
    // Check for validation errors before submitting
    const hasValidationErrors = Object.values(validationErrors).some(error => error !== null);
    if (hasValidationErrors) {
      setSubmitMessage({ 
        type: 'danger', 
        text: 'Please fix validation errors before submitting.' 
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Simulate progress updates
      const interval = setInterval(() => {
        setSaveProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      setProgressInterval(interval);

      // Prepare data for saving
      setSaveProgress(10);
      const observationsData = {
        formData: {
          ...formData,
          testRows: testRows
        },
        testRows: testRows,
        capturedImages: capturedImages,
        testRequestId: testRequest?.id || testData?.id,
        timestamp: new Date().toISOString()
      };

      setSaveProgress(30);

      try {
        // Try to save to database first
        setSaveProgress(50);
        await databaseService.saveTestObservations(testRequest?.id || testData?.id, observationsData);
        setSaveProgress(80);
        setSubmitMessage({ type: 'success', text: 'Test observations saved successfully!' });
      } catch (dbError) {
        console.warn('Database save failed, using localStorage fallback:', dbError);
        
        // Fallback to localStorage
        setSaveProgress(60);
        const storageKey = `test_observations_${testRequest?.id || testData?.id || 'temp'}`;
        localStorage.setItem(storageKey, JSON.stringify(observationsData));
        setSaveProgress(80);
        
        setSubmitMessage({ type: 'success', text: 'Test observations saved locally!' });
      }
      
      setSaveProgress(100);
      clearInterval(interval);
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/strength-graph', { 
          state: { 
            formData: testRequest,
            testData: testData,
            testIndex: testIndex,
            observationsData: observationsData
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error saving test observations:', error);
      setSubmitMessage({ 
        type: 'danger', 
        text: 'Failed to save test observations. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
      setSaveProgress(0);
    }
  };

  // Camera functionality
  const openCamera = (photoType) => {
    const modal = document.getElementById('cameraModal');
    if (modal) {
      modal.setAttribute('data-photo-type', photoType);
      modal.style.display = 'flex';
      startCamera();
    }
  };

  const startCamera = async () => {
    try {
      const video = document.getElementById('camera');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      video.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  const capturePhoto = () => {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    
    // Show loading indicator
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      // Save the image to state
      const currentPhotoType = document.getElementById('cameraModal').getAttribute('data-photo-type');
      if (currentPhotoType) {
        setCapturedImages(prev => ({
          ...prev,
          [currentPhotoType]: imageData
        }));
      }
      
      setIsUploading(false);
      closeCamera();
    }, 2000);
  };

  const closeCamera = () => {
    const modal = document.getElementById('cameraModal');
    const video = document.getElementById('camera');
    
    if (modal) modal.style.display = 'none';
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  // Fill random data function
  const fillRandomData = () => {
    // Fill form data
    setFormData(prev => ({
      ...prev,
      curingCondition: 'Water curing at 27°C ± 2°C',
      averageStrength: '28.5',
      testedBy: 'Dr. Rajesh Kumar',
      checkedBy: 'Ms. Priya Sharma',
      testRemarks: 'All specimens tested as per IS 516 standards. Results within acceptable limits.'
    }));

    // Fill test rows with random data
    const randomRows = testRows.map((row, index) => ({
      ...row,
      cubeId: `C${index + 1}`,
      length: (150 + Math.random() * 2).toFixed(1),
      breadth: (150 + Math.random() * 2).toFixed(1),
      height: (150 + Math.random() * 2).toFixed(1),
      weight: (8.3 + Math.random() * 0.1).toFixed(3),
      crushingLoad: (650 + Math.random() * 100).toFixed(1),
      compressiveStrength: (28.5 + Math.random() * 5).toFixed(1),
      failureType: Math.floor(Math.random() * 3) + 1
    }));

    // Calculate area and density for each row
    const updatedRows = randomRows.map(row => {
      const length = parseFloat(row.length);
      const breadth = parseFloat(row.breadth);
      const height = parseFloat(row.height);
      const weight = parseFloat(row.weight);
      
      const area = (length * breadth).toFixed(1);
      
      let density = '';
      if (length && breadth && height && weight) {
        const lengthInMeters = length / 1000;
        const breadthInMeters = breadth / 1000;
        const heightInMeters = height / 1000;
        const volumeInCubicMeters = lengthInMeters * breadthInMeters * heightInMeters;
        density = (weight / volumeInCubicMeters).toFixed(1);
      }
      
      return {
        ...row,
        area,
        density
      };
    });

    setTestRows(updatedRows);

    // Fill average strength
    const avgStrength = (updatedRows.reduce((sum, row) => sum + parseFloat(row.compressiveStrength), 0) / updatedRows.length).toFixed(1);
    setFormData(prev => ({
      ...prev,
      averageStrength: avgStrength
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <Container className="py-4">
      <style jsx>{`
        .test-results-professional {
          table-layout: fixed;
          width: 100%;
          border-radius: 12px !important;
          overflow: hidden;
          margin: 0 !important;
        }
        
        .test-results-professional th,
        .test-results-professional td {
          text-align: center !important;
          vertical-align: middle !important;
          padding: 8px 6px !important;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .test-results-professional input.form-control {
          width: 100% !important;
          text-align: center !important;
          padding: 6px 8px !important;
          font-size: 0.875rem !important;
          border: 2px solid #6c757d !important;
          border-radius: 6px !important;
          background-color: transparent !important;
          color: #fff !important;
          box-sizing: border-box !important;
          min-width: 0 !important;
          height: auto !important;
          min-height: 38px !important;
        }
        
        .test-results-professional input.form-control::placeholder {
          color: #adb5bd !important;
          opacity: 0.8 !important;
        }
        
        .test-results-professional input.form-control:focus {
          border-color: #FFA500 !important;
          box-shadow: 0 0 0 0.25rem rgba(255, 165, 0, 0.25) !important;
          background-color: rgba(255, 165, 0, 0.1) !important;
        }
        
        .test-results-professional input[readonly] {
          background-color: rgba(108, 117, 125, 0.1) !important;
          border-color: #495057 !important;
          opacity: 0.8;
        }
        
        .test-results-professional .invalid-feedback {
          font-size: 0.75rem;
          color: #dc3545 !important;
          margin-top: 2px;
        }
        
        .test-results-professional .is-invalid {
          border-color: #dc3545 !important;
          box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
        }
        
        .table th {
          background-color: #6c757d !important;
          color: white !important;
        }
        .table td {
          background-color: #1C2333 !important;
          color: white !important;
        }
        .bg-secondary {
          background-color: #6c757d !important;
        }
        .bg-dark {
          background-color: #1C2333 !important;
        }
      `}</style>

      {/* Breadcrumb */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">COMPRESSIVE STRENGTH OF CONCRETE CUBE</h1>
          <p className="lead">Job Number: {testRequest?.jobNumber || 'N/A'}</p>
          <p>Concrete Test: {testData?.idMark || `Test ${testIndex + 1}`}</p>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Button variant="link" className="p-0" onClick={() => navigate('/')}>Home</Button>
              </li>
              <li className="breadcrumb-item">
                <Button variant="link" className="p-0" onClick={() => navigate('/dashboard')}>Dashboard</Button>
              </li>
              <li className="breadcrumb-item">
                <Button variant="link" className="p-0" onClick={() => navigate('/view-sample', { state: { formData: testRequest } })}>Test Details</Button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Test Observations</li>
            </ol>
          </nav>
        </Col>
      </Row>

      {/* Loading Overlay for Image Upload */}
      {isUploading && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div 
              className="spinner-border text-warning" 
              role="status" 
              style={{ width: '3rem', height: '3rem' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="mt-3">
              <h5 className="text-dark mb-2">Uploading Image...</h5>
              <p className="text-muted mb-0">Please wait while we process your photo</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay for Data Saving */}
      {isSubmitting && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              minWidth: '400px',
              maxWidth: '500px'
            }}
          >
            <div className="mb-4">
              <div 
                className="spinner-border text-warning" 
                role="status" 
                style={{ width: '4rem', height: '4rem' }}
              >
                <span className="visually-hidden">Saving...</span>
              </div>
            </div>
            
            <h4 className="text-dark mb-3">Saving Test Observations</h4>
            <p className="text-muted mb-4">Please wait while we save your data...</p>
            
            {/* Progress Bar */}
            <div className="progress mb-3" style={{ height: '8px', borderRadius: '4px' }}>
              <div 
                className="progress-bar bg-warning progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                style={{ width: `${saveProgress}%` }}
                aria-valuenow={saveProgress} 
                aria-valuemin="0" 
                aria-valuemax="100"
              >
              </div>
            </div>
            
            <div className="d-flex justify-content-between text-muted small">
              <span>Preparing data...</span>
              <span>{Math.round(saveProgress)}%</span>
              <span>Processing...</span>
            </div>
            
            {/* Status Messages */}
            <div className="mt-3">
              {saveProgress < 30 && (
                <small className="text-info">Validating form data...</small>
              )}
              {saveProgress >= 30 && saveProgress < 60 && (
                <small className="text-info">Preparing for save...</small>
              )}
              {saveProgress >= 60 && saveProgress < 90 && (
                <small className="text-info">Saving to database...</small>
              )}
              {saveProgress >= 90 && (
                <small className="text-success">Almost done...</small>
              )}
            </div>
          </div>
        </div>
      )}

      <Row>
        <Col>
          <Card className="bg-dark">
            <Card.Header className="text-white" style={{ backgroundColor: '#FFA500' }}>
              <h3 className="card-title mb-0">Enter Test Observations</h3>
            </Card.Header>
            <Card.Body>
              {/* Success/Error Message */}
              {submitMessage.text && (
                <Alert variant={submitMessage.type} className="mb-4">
                  {submitMessage.text}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                {/* Concrete Cube Details */}
                <Row className="mb-4">
                  <Col md={12}>
                    <h4 className="mb-3 text-white">Concrete Cube Details</h4>
                  </Col>
                  
                  <div className="table-responsive">
                    <Table bordered className="table-dark">
                      <tbody>
                        <tr>
                          <td className="bg-secondary" width="25%">Reference Number</td>
                          <td width="25%">{testData?.referenceNumber || testRequest?.referenceNumber || ""}</td>
                          <td className="bg-secondary" width="25%">Sample Description</td>
                          <td width="25%">
                            <Form.Control
                              name="sampleDescription"
                              value={formData.sampleDescription}
                              onChange={handleInputChange}
                              readOnly
                              className="bg-transparent text-white"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-secondary">Quantity of Cubes</td>
                          <td>{testData?.quantity || ""}</td>
                          <td className="bg-secondary">Date of Receipt</td>
                          <td>{formatDate(testRequest?.receiptDate)}</td>
                        </tr>
                        <tr>
                          <td className="bg-secondary">Date of Casting</td>
                          <td>{formatDate(testData?.castingDate)}</td>
                          <td className="bg-secondary">Date of Testing</td>
                          <td>{formatDate(testData?.testingDate)}</td>
                        </tr>
                        <tr>
                          <td className="bg-secondary">Grade of Cube</td>
                          <td>{testData?.grade || ""}</td>
                          <td className="bg-secondary">Cube Condition</td>
                          <td>
                            <Form.Control
                              name="cubeCondition"
                              value={formData.cubeCondition}
                              onChange={handleInputChange}
                              readOnly
                              className="bg-transparent text-white"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-secondary">Age of Cube</td>
                          <td>
                            {testData?.castingDate && testData?.testingDate ? 
                              Math.ceil((new Date(testData.testingDate) - new Date(testData.castingDate)) / (1000 * 60 * 60 * 24)) : 
                              'N/A'
                            } days
                          </td>
                          <td className="bg-secondary">Curing Condition <span className="text-danger">*</span></td>
                          <td>
                            <Form.Control
                              name="curingCondition"
                              value={formData.curingCondition}
                              onChange={handleInputChange}
                              placeholder="Enter curing condition (Required)"
                              required
                              className="bg-transparent text-white"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-secondary">Machine used for Testing</td>
                          <td>
                            <Form.Control
                              name="machineUsed"
                              value={formData.machineUsed}
                              onChange={handleInputChange}
                              readOnly
                              className="bg-transparent text-white"
                            />
                          </td>
                          <td className="bg-secondary">Test Method</td>
                          <td>
                            <Form.Control
                              name="testMethod"
                              value={formData.testMethod}
                              onChange={handleInputChange}
                              readOnly
                              className="bg-transparent text-white"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Row>
                
                {/* Test Results */}
                <Row className="mb-4">
                  <Col md={12}>
                    <h4 className="mb-3 text-white">Test Results</h4>
                  </Col>
                  
                  <div className="table-responsive p-0 rounded" style={{ borderRadius: '12px', overflowX: 'auto', overflowY: 'visible', margin: 0, border: '2px solid #495057', maxHeight: 'none' }}>
                    <Table bordered className="table-dark test-results-professional mb-0" style={{ minWidth: '1200px', whiteSpace: 'nowrap' }}>
                      <thead className="bg-secondary">
                        <tr>
                          <th className="text-center">Sr. No.</th>
                          <th className="text-center">Cube ID</th>
                          <th className="text-center">Length (mm) <span className="text-danger">*</span></th>
                          <th className="text-center">Breadth (mm) <span className="text-danger">*</span></th>
                          <th className="text-center">Height (mm) <span className="text-danger">*</span></th>
                          <th className="text-center">Area (mm²)</th>
                          <th className="text-center">Cube Weight <span className="text-danger">*</span></th>
                          <th className="text-center">Density</th>
                          <th className="text-center">Maximum Load <span className="text-danger">*</span></th>
                          <th className="text-center">Compressive Strength <span className="text-danger">*</span></th>
                          <th className="text-center">Type of Failure</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testRows.map((row, index) => (
                          <tr key={row.id}>
                            <td className="text-center">{index + 1}</td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.cubeId}
                                onChange={(e) => handleRowChange(index, 'cubeId', e.target.value)}
                                placeholder="Cube ID"
                                className="text-center"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                value={row.length}
                                onChange={(e) => handleRowChange(index, 'length', e.target.value)}
                                placeholder="Length"
                                step="0.1"
                                min="0"
                                className="text-center"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                value={row.breadth}
                                onChange={(e) => handleRowChange(index, 'breadth', e.target.value)}
                                placeholder="Breadth"
                                step="0.1"
                                min="0"
                                className="text-center"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                value={row.height}
                                onChange={(e) => handleRowChange(index, 'height', e.target.value)}
                                placeholder="Height"
                                step="0.1"
                                min="0"
                                className="text-center"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.area}
                                readOnly
                                className="text-center"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                value={row.weight}
                                onChange={(e) => handleRowChange(index, 'weight', e.target.value)}
                                placeholder="Weight"
                                step="0.001"
                                min="8.3"
                                max="8.4"
                                className={`text-center ${validationErrors[`weight_${index}`] ? 'is-invalid' : ''}`}
                              />
                              {validationErrors[`weight_${index}`] && (
                                <div className="invalid-feedback d-block text-center">
                                  {validationErrors[`weight_${index}`]}
                                </div>
                              )}
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.density}
                                readOnly
                                className="text-center"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                value={row.crushingLoad}
                                onChange={(e) => handleRowChange(index, 'crushingLoad', e.target.value)}
                                placeholder="Load"
                                step="0.1"
                                min="0"
                                className="text-center"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                value={row.compressiveStrength}
                                onChange={(e) => handleRowChange(index, 'compressiveStrength', e.target.value)}
                                placeholder="Strength"
                                step="0.1"
                                min="0"
                                required
                                className="text-center"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                value={row.failureType}
                                onChange={(e) => handleRowChange(index, 'failureType', e.target.value)}
                                placeholder="Failure Type"
                                step="0.1"
                                className="text-center"
                              />
                            </td>
                            <td className="text-center">
                              {testRows.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removeRow(index)}
                                  title="Delete Row"
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-secondary">
                          <td colSpan="8" className="text-end fw-bold pe-3">
                            <div className="d-flex flex-column align-items-end">
                              <span>Average:</span>
                              <small className="text-warning">(Manual Input Required)</small>
                            </div>
                          </td>
                          <td className="text-center">
                            <Form.Control
                              type="number"
                              name="averageStrength"
                              value={formData.averageStrength}
                              onChange={handleInputChange}
                              className="text-center"
                              placeholder="Enter Average"
                              step="0.1"
                              min="0"
                              required
                              style={{ width: '120px', minWidth: '120px' }}
                            />
                          </td>
                          <td colSpan="2"></td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                  
                  {/* Add Row Button */}
                  {testRows.length < 3 && (
                    <div className="mt-3">
                      <Button type="button" variant="outline-primary" onClick={addRow}>
                        <i className="fas fa-plus me-2"></i>Add Row
                      </Button>
                    </div>
                  )}
                  
                  {/* Remarks Section */}
                  <Row className="my-4">
                    <Col md={12}>
                      <div className="p-3 rounded" style={{ border: '2px solid #495057', backgroundColor: 'rgba(73, 80, 87, 0.1)' }}>
                        <Form.Label className="fw-bold mb-3 text-white">Remarks</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="testRemarks"
                          value={formData.testRemarks}
                          onChange={handleInputChange}
                          placeholder="Additional observations or notes about the test results"
                          className="bg-transparent text-white"
                        />
                      </div>
                    </Col>
                  </Row>
                  
                  {/* Test verification section */}
                  <div className="table-responsive mt-4">
                    <Table bordered className="table-dark">
                      <tbody>
                        <tr>
                          <td width="33%">Tested By:</td>
                          <td width="33%">Checked By:</td>
                          <td width="33%">Verified By:</td>
                        </tr>
                        <tr>
                          <td>
                            <Form.Control
                              name="testedBy"
                              value={formData.testedBy}
                              onChange={handleInputChange}
                              placeholder="Name"
                              className="bg-transparent text-white"
                            />
                          </td>
                          <td>
                            <Form.Control
                              name="checkedBy"
                              value={formData.checkedBy}
                              onChange={handleInputChange}
                              placeholder="Name"
                              className="bg-transparent text-white"
                            />
                          </td>
                          <td>
                            <Form.Control
                              name="verifiedBy"
                              value={formData.verifiedBy}
                              readOnly
                              className="bg-transparent text-white"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span className="text-white">Date:</span>
                              <Form.Control
                                type="date"
                                className="form-control-sm bg-transparent text-white"
                                defaultValue={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span className="text-white">Date:</span>
                              <Form.Control
                                type="date"
                                className="form-control-sm bg-transparent text-white"
                                defaultValue={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span className="text-white">Date:</span>
                              <Form.Control
                                type="date"
                                className="form-control-sm bg-transparent text-white"
                                defaultValue={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Sign:</td>
                          <td>Sign:</td>
                          <td>Sign:</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Row>

                {/* Photo Capture Section */}
                <div className="mt-5 pt-4">
                  <div className="d-flex align-items-center mb-4 p-3 bg-dark rounded-3 border">
                    <div className="bg-primary rounded-circle p-3 me-3">
                      <i className="fas fa-camera fa-lg text-white"></i>
                    </div>
                    <div>
                      <h4 className="mb-1 text-white">Cube Test Photos</h4>
                      <p className="text-muted mb-0">Capture photos of cube specimens during testing</p>
                    </div>
                  </div>
                  
                  {testRows.map((row, cubeNum) => (
                    <Card key={row.id} className="mb-4 bg-dark border-primary shadow-sm">
                      <Card.Header className="bg-primary text-white border-0">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-cube me-2"></i>
                          <h6 className="mb-0 fw-bold">Cube/Core Specimen #{cubeNum + 1}</h6>
                        </div>
                      </Card.Header>
                      <Card.Body className="p-4">
                        <Row className="g-3">
                          {/* Front Failure Photo */}
                          <Col md={4}>
                            <div className="text-center mb-3">
                              <h6 className="text-white fw-semibold mb-0">Front Side Failure</h6>
                            </div>
                            <div className="photo-container border border-secondary rounded-3 bg-dark" style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                              {capturedImages[`front_failure_${cubeNum + 1}`] ? (
                                <img 
                                  src={capturedImages[`front_failure_${cubeNum + 1}`]} 
                                  alt="Front Failure" 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover', 
                                    borderRadius: '8px'
                                  }}
                                />
                              ) : (
                                <div className="no-photo-placeholder text-center d-flex flex-column align-items-center justify-content-center" style={{ height: '100%' }}>
                                  <i className="fas fa-image fa-2x text-muted"></i>
                                  <p className="text-muted">No photo</p>
                                </div>
                              )}
                            </div>
                            <div className="photo-controls mt-3">
                              <div className="d-grid gap-2">
                                <Button 
                                  variant="warning" 
                                  className="fw-semibold"
                                  onClick={() => openCamera(`front_failure_${cubeNum + 1}`)}
                                >
                                  <i className="fas fa-camera me-2"></i>Capture
                                </Button>
                                <Button variant="outline-light">
                                  <i className="fas fa-upload me-2"></i>Upload
                                </Button>
                              </div>
                            </div>
                          </Col>
                          
                          {/* Digital Reading Photo */}
                          <Col md={4}>
                            <div className="text-center mb-3">
                              <h6 className="text-white fw-semibold mb-0">Digital Reading</h6>
                            </div>
                            <div className="photo-container border border-secondary rounded-3 bg-dark" style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                              {capturedImages[`digital_reading_${cubeNum + 1}`] ? (
                                <img 
                                  src={capturedImages[`digital_reading_${cubeNum + 1}`]} 
                                  alt="Digital Reading" 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover', 
                                    borderRadius: '8px'
                                  }}
                                />
                              ) : (
                                <div className="no-photo-placeholder text-center d-flex flex-column align-items-center justify-content-center" style={{ height: '100%' }}>
                                  <i className="fas fa-image fa-2x text-muted"></i>
                                  <p className="text-muted">No photo</p>
                                </div>
                              )}
                            </div>
                            <div className="photo-controls mt-3">
                              <div className="d-grid gap-2">
                                <Button 
                                  variant="warning" 
                                  className="fw-semibold"
                                  onClick={() => openCamera(`digital_reading_${cubeNum + 1}`)}
                                >
                                  <i className="fas fa-camera me-2"></i>Capture
                                </Button>
                                <Button variant="outline-light">
                                  <i className="fas fa-upload me-2"></i>Upload
                                </Button>
                              </div>
                            </div>
                          </Col>
                          
                          {/* Back Failure Photo */}
                          <Col md={4}>
                            <div className="text-center mb-3">
                              <h6 className="text-white fw-semibold mb-0">Back Side Failure</h6>
                            </div>
                            <div className="photo-container border border-secondary rounded-3 bg-dark" style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                              {capturedImages[`back_failure_${cubeNum + 1}`] ? (
                                <img 
                                  src={capturedImages[`back_failure_${cubeNum + 1}`]} 
                                  alt="Back Failure" 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover', 
                                    borderRadius: '8px'
                                  }}
                                />
                              ) : (
                                <div className="no-photo-placeholder text-center d-flex flex-column align-items-center justify-content-center" style={{ height: '100%' }}>
                                  <i className="fas fa-image fa-2x text-muted"></i>
                                  <p className="text-muted">No photo</p>
                                </div>
                              )}
                            </div>
                            <div className="photo-controls mt-3">
                              <div className="d-grid gap-2">
                                <Button 
                                  variant="warning" 
                                  className="fw-semibold"
                                  onClick={() => openCamera(`back_failure_${cubeNum + 1}`)}
                                >
                                  <i className="fas fa-camera me-2"></i>Capture
                                </Button>
                                <Button variant="outline-light">
                                  <i className="fas fa-upload me-2"></i>Upload
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 border-top pt-3">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button 
                      variant="outline-light" 
                      className="me-md-2"
                      onClick={() => navigate('/view-sample', { state: { formData: testRequest } })}
                    >
                      <i className="fas fa-times me-2"></i> Cancel
                    </Button>
                    <Button 
                      type="button"
                      variant="info" 
                      className="me-md-2"
                      onClick={fillRandomData}
                    >
                      <i className="fas fa-magic me-2"></i> Fill Random Data
                    </Button>
                    <Button 
                      type="submit" 
                      variant="warning" 
                      className="me-md-2"
                      disabled={isSubmitting}
                      style={{ minWidth: '200px' }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving... ({Math.round(saveProgress)}%)
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i> Save Test Observations
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Camera Modal */}
      <div 
        id="cameraModal" 
        style={{ 
          display: 'none', 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'rgba(0,0,0,0.8)', 
          zIndex: 9999, 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          maxWidth: '500px',
          width: '90%'
        }}>
          <h5 className="mb-3">Capture Photo</h5>
          <video 
            id="camera" 
            width="400" 
            height="300" 
            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
            autoPlay
          ></video>
          <canvas id="canvas" style={{ display: 'none' }}></canvas>
          <div className="mt-3 d-flex gap-2 justify-content-center">
            <Button variant="primary" onClick={capturePhoto}>
              <i className="fas fa-camera me-2"></i>Capture
            </Button>
            <Button variant="secondary" onClick={closeCamera}>
              <i className="fas fa-times me-2"></i>Cancel
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TestObservations;
