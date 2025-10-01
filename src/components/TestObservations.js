import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Row, Col, Form, Alert, Badge, Modal } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import databaseService from '../services/database';
import axios from 'axios';

const TestObservations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testRequestId: urlTestRequestId } = useParams();
  
  // Get test data from location state or will fetch from API
  const { testData, testRequest, testIndex, editMode } = location.state || {};
  
  // Get testRequestId from URL params, location state, or testRequest object
  const testRequestId = urlTestRequestId || testRequest?.id || testData?.test_request_id;
  
  console.log('🔍 TestObservations Edit Mode:', editMode);
  console.log('🔍 TestObservations testData:', testData);
  
  const [apiTestRequest, setApiTestRequest] = useState(null);
  const [apiConcreteTests, setApiConcreteTests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    sampleDescription: 'Concrete Cube Specimen',
    cubeCondition: 'Acceptable',
    curingCondition: '',
    machineUsed: 'CTM (2000KN)',
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePhotoKey, setDeletePhotoKey] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fetch test request data if URL has testRequestId
  useEffect(() => {
    const fetchTestData = async () => {
      if (testRequestId && !testData && !testRequest) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:5000/api/test-requests/${testRequestId}/details`);
          setApiTestRequest(response.data.test_request);
          setApiConcreteTests(response.data.concrete_tests);
          console.log('✅ Fetched test data for observations:', response.data);
        } catch (error) {
          console.error('Error fetching test data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchTestData();
  }, [testRequestId]);

  // Load saved data when in edit mode
  useEffect(() => {
    const loadSavedData = async () => {
      if (editMode && testRequestId) {
        console.log('📥 Loading saved observations for edit mode...');
        console.log('📥 Test Request ID:', testRequestId);
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/api/test-observations/${testRequestId}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 10000
            }
          );
          const savedData = response.data;
          
          console.log('✅ Loaded saved observations:', savedData);
          console.log('✅ Form Data:', savedData.formData);
          console.log('✅ Test Rows:', savedData.testRows);
          
          // Check if data is empty (no saved observations yet)
          if (savedData.isEmpty) {
            console.log('ℹ️ No saved observations found - user can enter fresh data');
            setLoading(false);
            return;
          }
          
          // Pre-fill form data
          if (savedData.formData) {
            setFormData(prev => ({
              ...prev,
              sampleDescription: savedData.formData.sampleDescription || 'Concrete Cube Specimen',
              cubeCondition: savedData.formData.cubeCondition || 'Acceptable',
              curingCondition: savedData.formData.curingCondition || '',
              machineUsed: savedData.formData.machineUsed || 'CTM (2000KN)',
              testMethod: savedData.formData.testMethod || 'IS 516 (Part1/Sec1):2021',
              averageStrength: savedData.formData.averageStrength || '',
              testedBy: savedData.formData.testedBy || '',
              checkedBy: savedData.formData.checkedBy || '',
              verifiedBy: savedData.formData.verifiedBy || 'Mr. P A Sanghave',
              testRemarks: savedData.formData.testRemarks || ''
            }));
            console.log('✅ Form data pre-filled');
          }
          
          // Pre-fill test rows
          if (savedData.testRows && savedData.testRows.length > 0) {
            console.log(`✅ Setting ${savedData.testRows.length} test rows`);
            setTestRows(savedData.testRows);
          }
          
          // Pre-fill captured images
          if (savedData.capturedImages) {
            console.log('✅ Setting captured images');
            setCapturedImages(savedData.capturedImages);
          }
          
          console.log('✅ All saved data loaded successfully!');
          
        } catch (error) {
          console.error('❌ Error loading saved observations:', error);
          console.error('❌ Error response:', error.response);
          console.error('❌ Error message:', error.message);
          
          if (error.response) {
            console.error('❌ Server error:', error.response.data);
          } else if (error.request) {
            console.error('❌ No response from server');
          }
          
          // Show error to user
          setErrorMessage('Could not load saved observations. You can still enter data manually.');
          setShowErrorModal(true);
          setTimeout(() => setShowErrorModal(false), 3000);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadSavedData();
  }, [editMode, testRequestId]);

  // Initialize test rows based on number of cubes (only if NOT in edit mode)
  useEffect(() => {
    // Skip initialization if in edit mode - data will be loaded from backend
    if (editMode) {
      console.log('⏭️ Skipping test rows initialization - Edit mode active');
      return;
    }
    
    const numCubes = testData?.quantity || apiConcreteTests?.[0]?.quantity || apiConcreteTests?.length || 3;
    const actualCubes = Math.min(Math.max(numCubes, 1), 3);
    
    const initialRows = [];
    for (let i = 1; i <= actualCubes; i++) {
      initialRows.push({
        id: i,
        cubeId: '',
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
  }, [testData, apiConcreteTests, editMode]);

  // DISABLED - Don't load old localStorage data (causes dummy data issue)
  // Load saved data if available
  // useEffect(() => {
  //   const loadSavedData = async () => {
  //     try {
  //       const testRequestId = testRequest?.id || testData?.id;
  //       if (testRequestId) {
  //         // Try to load from database first
  //         const savedData = await databaseService.getTestObservations(testRequestId);
  //         if (savedData) {
  //           setFormData(prev => ({ ...prev, ...savedData.formData }));
  //           setTestRows(savedData.testRows || []);
  //           setCapturedImages(savedData.capturedImages || {});
  //           return;
  //         }
  //       }
  //       
  //       // Fallback to localStorage
  //       const storageKey = `test_observations_${testRequest?.id || testData?.id || 'temp'}`;
  //       const savedData = localStorage.getItem(storageKey);
  //       if (savedData) {
  //         const parsedData = JSON.parse(savedData);
  //         setFormData(prev => ({ ...prev, ...savedData.formData }));
  //         setTestRows(parsedData.testRows || []);
  //         setCapturedImages(parsedData.capturedImages || {});
  //       }
  //     } catch (error) {
  //       console.warn('Failed to load saved data:', error);
  //     }
  //   };

  //   loadSavedData();
  // }, [testRequest?.id, testData?.id]);

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
    // Weight can be any value - no restrictions
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

  // Rows are automatically generated based on number of cubes from test request

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
      setErrorMessage('Please fix validation errors before submitting.');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      setIsSubmitting(false);
      return;
    }
    
    // Validate all required fields are filled
    if (!formData.curingCondition || formData.curingCondition.trim() === '') {
      setErrorMessage('Please fill in all required fields (Curing Condition is required).');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      setIsSubmitting(false);
      return;
    }
    
    // Validate all test rows have required data
    const hasEmptyRows = testRows.some(row => 
      !row.cubeId || 
      !row.weight || 
      !row.length || 
      !row.breadth || 
      !row.height || 
      !row.crushingLoad || 
      !row.compressiveStrength
    );
    
    if (hasEmptyRows) {
      setErrorMessage('Please fill in all test result fields for all cubes.');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      setIsSubmitting(false);
      return;
    }
    
    // Validate all 3 images are captured for each cube
    const totalCubes = testRows.length;
    for (let i = 0; i < totalCubes; i++) {
      const frontImage = capturedImages[`front_failure_${i + 1}`];
      const digitalImage = capturedImages[`digital_reading_${i + 1}`];
      const backImage = capturedImages[`back_failure_${i + 1}`];
      
      if (!frontImage || !digitalImage || !backImage) {
        setErrorMessage(`Please capture all 3 photos (Front, Digital, Back) for Cube/Core Specimen #${i + 1}.`);
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 3000);
        setIsSubmitting(false);
        return;
      }
    }
    
    // Validate average strength is calculated
    if (!formData.averageStrength || formData.averageStrength === '') {
      setErrorMessage('Please calculate the average strength before saving.');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      setIsSubmitting(false);
      return;
    }
    
    // Validate Tested By and Checked By are filled
    if (!formData.testedBy || formData.testedBy.trim() === '') {
      setErrorMessage('Please enter "Tested By" name.');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.checkedBy || formData.checkedBy.trim() === '') {
      setErrorMessage('Please enter "Checked By" name.');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
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
        testRequestId: testRequestId,
        timestamp: new Date().toISOString()
      };

      setSaveProgress(30);

      // Validate we have a test request ID before saving
      if (!testRequestId) {
        setErrorMessage('Error: Test Request ID is missing. Cannot save observations.');
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 3000);
        setIsSubmitting(false);
        setSaveProgress(0);
        clearInterval(interval);
        return;
      }

      try {
        // Try to save to database first
        setSaveProgress(50);
        await axios.post(`http://localhost:5000/api/test-observations/${testRequestId}`, observationsData);
        setSaveProgress(80);
        setSubmitMessage({ type: 'success', text: 'Test observations saved successfully!' });
        setShowSuccessModal(true);
      } catch (dbError) {
        console.warn('Database save failed, using localStorage fallback:', dbError);
        
        // Fallback to localStorage
        setSaveProgress(60);
        const storageKey = `test_observations_${testRequestId || 'temp'}`;
        localStorage.setItem(storageKey, JSON.stringify(observationsData));
        setSaveProgress(80);
        
        setSubmitMessage({ type: 'success', text: 'Test observations saved locally!' });
        setShowSuccessModal(true);
      }
      
      setSaveProgress(100);
      clearInterval(interval);
      
    } catch (error) {
      console.error('Error saving test observations:', error);
      setErrorMessage('Failed to save test observations. Please try again.');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
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

  const [currentFacingMode, setCurrentFacingMode] = useState('environment');
  
  const startCamera = async (facingMode = 'environment') => {
    try {
      const video = document.getElementById('camera');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode } 
      });
      video.srcObject = stream;
      setCurrentFacingMode(facingMode);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please allow camera permissions.');
    }
  };
  
  const switchCamera = () => {
    const newMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    closeCamera();
    setTimeout(() => startCamera(newMode), 100);
  };
  
  const handleDeletePhoto = (photoKey) => {
    setDeletePhotoKey(photoKey);
    setShowDeleteConfirm(true);
  };
  
  const confirmDeletePhoto = () => {
    if (deletePhotoKey) {
      setCapturedImages(prev => {
        const updated = {...prev};
        delete updated[deletePhotoKey];
        return updated;
      });
    }
    setShowDeleteConfirm(false);
    setDeletePhotoKey(null);
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

  // Get test request info (from API or state)
  const currentTestRequest = apiTestRequest || testRequest;
  const currentConcreteTests = apiConcreteTests.length > 0 ? apiConcreteTests : (testData ? [testData] : []);
  
  console.log('🔍 TestObservations Data:');
  console.log('  urlTestRequestId (from URL):', urlTestRequestId);
  console.log('  testRequest?.id (from state):', testRequest?.id);
  console.log('  testRequestId (final):', testRequestId);
  console.log('  apiTestRequest:', apiTestRequest);
  console.log('  apiConcreteTests:', apiConcreteTests);
  console.log('  currentTestRequest:', currentTestRequest);
  console.log('  currentConcreteTests:', currentConcreteTests);
  
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
                          <td width="25%">{testRequest?.referenceNumber || currentConcreteTests?.[0]?.sample_code_number || 'N/A'}</td>
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
                          <td>{currentConcreteTests?.[0]?.quantity || testRows.length}</td>
                          <td className="bg-secondary">Date of Receipt</td>
                          <td>{formatDate(currentTestRequest?.receipt_date || testRequest?.receiptDate)}</td>
                        </tr>
                        <tr>
                          <td className="bg-secondary">Date of Casting</td>
                          <td>{formatDate(currentConcreteTests?.[0]?.castingDate || testData?.castingDate)}</td>
                          <td className="bg-secondary">Date of Testing</td>
                          <td>{formatDate(currentConcreteTests?.[0]?.testingDate || testData?.testingDate)}</td>
                        </tr>
                        <tr>
                          <td className="bg-secondary">Grade of Cube</td>
                          <td>{currentConcreteTests?.[0]?.grade || testData?.grade || ""}</td>
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
                            {(() => {
                              const casting = currentConcreteTests?.[0]?.castingDate || testData?.castingDate;
                              const testing = currentConcreteTests?.[0]?.testingDate || testData?.testingDate;
                              if (casting && testing) {
                                return Math.ceil((new Date(testing) - new Date(casting)) / (1000 * 60 * 60 * 24)) + ' days';
                              }
                              return 'N/A days';
                            })()}
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
                          <td className="bg-secondary" width="25%">Machine used for Testing</td>
                          <td colSpan="3">
                            <Form.Control
                              name="machineUsed"
                              value={formData.machineUsed}
                              onChange={handleInputChange}
                              readOnly
                              className="bg-transparent text-white"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-secondary" width="25%">Test Method</td>
                          <td colSpan="3">
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
                          <th className="text-center">Type of Failure <span className="text-muted">(Optional)</span></th>
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
                          <td colSpan="9" className="text-end fw-bold pe-3">
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
                          <td width="33%">Tested By: <span className="text-danger">*</span></td>
                          <td width="33%">Checked By: <span className="text-danger">*</span></td>
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
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              name="checkedBy"
                              value={formData.checkedBy}
                              onChange={handleInputChange}
                              placeholder="Name"
                              className="bg-transparent text-white"
                              required
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
                                <>
                                  <img 
                                    src={capturedImages[`front_failure_${cubeNum + 1}`]} 
                                    alt="Front Failure" 
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      objectFit: 'contain', 
                                      borderRadius: '8px'
                                    }}
                                  />
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeletePhoto(`front_failure_${cubeNum + 1}`)}
                                    style={{
                                      position: 'absolute',
                                      top: '5px',
                                      right: '5px',
                                      padding: '5px 10px',
                                      zIndex: 10
                                    }}
                                  >
                                    <i className="fas fa-times"></i>
                                  </Button>
                                </>
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
                                <Button 
                                  variant="outline-light"
                                  onClick={() => document.getElementById(`upload-front-${cubeNum + 1}`).click()}
                                >
                                  <i className="fas fa-upload me-2"></i>Upload
                                </Button>
                                <input
                                  type="file"
                                  id={`upload-front-${cubeNum + 1}`}
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        setCapturedImages(prev => ({
                                          ...prev,
                                          [`front_failure_${cubeNum + 1}`]: event.target.result
                                        }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
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
                                <>
                                  <img 
                                    src={capturedImages[`digital_reading_${cubeNum + 1}`]} 
                                    alt="Digital Reading" 
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      objectFit: 'contain', 
                                      borderRadius: '8px'
                                    }}
                                  />
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeletePhoto(`digital_reading_${cubeNum + 1}`)}
                                    style={{
                                      position: 'absolute',
                                      top: '5px',
                                      right: '5px',
                                      padding: '5px 10px',
                                      zIndex: 10
                                    }}
                                  >
                                    <i className="fas fa-times"></i>
                                  </Button>
                                </>
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
                                <Button 
                                  variant="outline-light"
                                  onClick={() => document.getElementById(`upload-digital-${cubeNum + 1}`).click()}
                                >
                                  <i className="fas fa-upload me-2"></i>Upload
                                </Button>
                                <input
                                  type="file"
                                  id={`upload-digital-${cubeNum + 1}`}
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        setCapturedImages(prev => ({
                                          ...prev,
                                          [`digital_reading_${cubeNum + 1}`]: event.target.result
                                        }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
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
                                <>
                                  <img 
                                    src={capturedImages[`back_failure_${cubeNum + 1}`]} 
                                    alt="Back Failure" 
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      objectFit: 'contain', 
                                      borderRadius: '8px'
                                    }}
                                  />
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeletePhoto(`back_failure_${cubeNum + 1}`)}
                                    style={{
                                      position: 'absolute',
                                      top: '5px',
                                      right: '5px',
                                      padding: '5px 10px',
                                      zIndex: 10
                                    }}
                                  >
                                    <i className="fas fa-times"></i>
                                  </Button>
                                </>
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
                                <Button 
                                  variant="outline-light"
                                  onClick={() => document.getElementById(`upload-back-${cubeNum + 1}`).click()}
                                >
                                  <i className="fas fa-upload me-2"></i>Upload
                                </Button>
                                <input
                                  type="file"
                                  id={`upload-back-${cubeNum + 1}`}
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        setCapturedImages(prev => ({
                                          ...prev,
                                          [`back_failure_${cubeNum + 1}`]: event.target.result
                                        }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
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

      {/* Success Modal */}
      <Modal 
        show={showSuccessModal} 
        backdrop="static" 
        keyboard={false} 
        centered
      >
        <Modal.Header style={{ backgroundColor: '#198754', borderBottom: 'none' }}>
          <Modal.Title style={{ color: '#fff' }}>
            <i className="fas fa-check-circle me-2"></i>Success!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1a1a1a', color: '#fff', textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-check-circle fa-4x mb-3" style={{ color: '#198754' }}></i>
          <h4>Test Observations Saved Successfully!</h4>
          <p className="text-muted mt-3">Your data has been saved to the database.</p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#2c2c2c', borderTop: '1px solid #444' }}>
          <Button 
            variant="success" 
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/strength-graph', { 
                state: { 
                  formData: testRequest,
                  testData: testData,
                  testIndex: testIndex,
                  testRequestId: testRequestId,
                  observationsData: {
                    formData: {
                      ...formData,
                      testRows: testRows
                    },
                    testRows: testRows,
                    capturedImages: capturedImages,
                    testRequestId: testRequestId,
                    timestamp: new Date().toISOString()
                  }
                } 
              });
            }}
          >
            Continue to Graph <i className="fas fa-arrow-right ms-2"></i>
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal - Auto-dismisses after 3 seconds */}
      <Modal 
        show={showErrorModal} 
        onHide={() => setShowErrorModal(false)}
        backdrop="static" 
        keyboard={false} 
        centered
      >
        <Modal.Header style={{ backgroundColor: '#dc3545', borderBottom: 'none' }}>
          <Modal.Title style={{ color: '#fff' }}>
            <i className="fas fa-exclamation-circle me-2"></i>Validation Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1a1a1a', color: '#fff', textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-exclamation-circle fa-4x mb-3" style={{ color: '#dc3545' }}></i>
          <h4>{errorMessage}</h4>
          <p className="text-muted mt-3">This message will close automatically in 3 seconds.</p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#2c2c2c', borderTop: '1px solid #444' }}>
          <Button 
            variant="outline-light" 
            onClick={() => setShowErrorModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#2c2c2c', borderBottom: '1px solid #444' }}>
          <Modal.Title style={{ color: '#fff' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1a1a1a', color: '#fff', textAlign: 'center', padding: '30px' }}>
          <i className="fas fa-exclamation-triangle fa-3x mb-3" style={{ color: '#ffc107' }}></i>
          <h5>Are you sure you want to delete this photo?</h5>
          <p className="text-muted mt-2">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#2c2c2c', borderTop: '1px solid #444' }}>
          <Button variant="outline-light" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeletePhoto}>
            <i className="fas fa-trash me-2"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>

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
            <Button variant="info" onClick={switchCamera}>
              <i className="fas fa-sync-alt me-2"></i>Switch Camera
            </Button>
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
