import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCustomers } from '../apis/customers';
import { createTestRequest } from '../apis/testRequests';
import { getErrorMessage } from '../utils/errorHandler';

const TestRequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { editMode, testRequestData } = location.state || {};
  
  // Custom styles for form fields
  const formFieldStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #6c757d',
    color: 'white'
  };

  const [formData, setFormData] = useState({
    // Customer Information
    customerName: '',
    contactPerson: '',
    phone: '',
    email: '',
    siteName: '',
    siteAddress: '',
    
    // Test Specifications
    testType: 'CC',
    receiptDate: '',
    ulrNumber: '',
    referenceNumber: '',
    jobNumber: '',
    
    // Building Materials
    materials: [],
    
    // Concrete Cube Tests
    cubeTests: [{
      id: 1,
      idMark: '',
      locationNature: '',
      grade: '',
      castingDate: '',
      testingDate: '',
      quantity: 1,
      testMethod: 'IS 516 (Part1/Sec1):2021'
    }],
    
    // Office Use
    reviewRemarks: '',
    labRepresentative: '',
    customerRepresentative: '',
    qualityManager: '',
    termsAccepted: false
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  
  // Customer data state
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState(null);
  
  // Searchable dropdown state
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [dropdownSearchTerm, setDropdownSearchTerm] = useState('');

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        setCustomersLoading(true);
        setCustomersError(null);
        
        // Backend connection is working since customers page works
        
        const customersData = await getCustomers();
        setCustomers(customersData);
        setFilteredCustomers(customersData);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomersError('Failed to load customers');
      } finally {
        setCustomersLoading(false);
      }
    };

    fetchCustomersData();
  }, []);

  // Pre-fill form data when in edit mode
  useEffect(() => {
    if (editMode && testRequestData) {
      setFormData({
        customerName: testRequestData.customerName || '',
        contactPerson: testRequestData.contactPerson || '',
        phone: testRequestData.phone || '',
        email: testRequestData.email || '',
        siteName: testRequestData.siteName || '',
        siteAddress: testRequestData.siteAddress || '',
        testType: testRequestData.testType || 'CC',
        receiptDate: testRequestData.receiptDate || '',
        ulrNumber: testRequestData.ulrNumber || '',
        referenceNumber: testRequestData.referenceNumber || '',
        jobNumber: testRequestData.jobNumber || '',
        materials: [],
        cubeTests: testRequestData.cubeTests || [{
          id: 1,
          idMark: '',
          locationNature: '',
          grade: '',
          castingDate: '',
          testingDate: '',
          quantity: 1,
          testMethod: 'IS 516 (Part1/Sec1):2021'
        }],
        reviewRemarks: '',
        reviewedBy: '',
        reviewDate: ''
      });
    }
  }, [editMode, testRequestData]);

  // Filter customers based on dropdown search term
  useEffect(() => {
    if (dropdownSearchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(dropdownSearchTerm.toLowerCase()) ||
        (customer.contact_person && customer.contact_person.toLowerCase().includes(dropdownSearchTerm.toLowerCase())) ||
        (customer.phone && customer.phone.includes(dropdownSearchTerm)) ||
        (customer.city && customer.city.toLowerCase().includes(dropdownSearchTerm.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    }
  }, [dropdownSearchTerm, customers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCustomerDropdown && !event.target.closest('.customer-dropdown-container')) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomerDropdown]);

  // Handle customer selection from dropdown
  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customerName: customer.name,
      customerId: customer.id, // Store customer ID
      contactPerson: customer.contact_person || '',
      phone: customer.phone || '',
      email: customer.email || '',
      siteName: customer.site_name || '',
      siteAddress: customer.address || ''
    }));
    setCustomerSearchTerm(customer.name);
    setShowCustomerDropdown(false);
    setDropdownSearchTerm(''); // Clear dropdown search
  };

  // Handle dropdown search input
  const handleDropdownSearch = (e) => {
    setDropdownSearchTerm(e.target.value);
  };

  // Handle customer input click to show dropdown
  const handleCustomerInputClick = () => {
    setShowCustomerDropdown(true);
    setDropdownSearchTerm(''); // Clear search when opening dropdown
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const addCubeTest = () => {
    setFormData(prev => ({
      ...prev,
      cubeTests: [...prev.cubeTests, {
        id: prev.cubeTests.length + 1,
        idMark: '',
        locationNature: '',
        grade: '',
        castingDate: '',
        testingDate: '',
        quantity: 1,
        testMethod: 'IS 516 (Part1/Sec1):2021'
      }]
    }));
  };

  const removeCubeTest = (id) => {
    if (formData.cubeTests.length > 1) {
      setFormData(prev => ({
        ...prev,
        cubeTests: prev.cubeTests.filter(test => test.id !== id)
      }));
    }
  };

  const handleCubeTestChange = (id, field, value) => {
    // Validate quantity field
    if (field === 'quantity') {
      const numValue = parseInt(value);
      if (numValue > 3) {
        alert('Number of cubes cannot exceed 3. Maximum allowed is 3.');
        return;
      }
      if (numValue < 1) {
        alert('Number of cubes must be at least 1.');
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      cubeTests: prev.cubeTests.map(test =>
        test.id === id ? { ...test, [field]: value } : test
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Step 5: Database Integration
      // Prepare data for backend according to the database schema
      const testRequestData = {
        // Customer Information
        customer_id: formData.customerId, // Send customer ID
        customer_name: formData.customerName, // Keep as fallback
        contact_person: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        site_name: formData.siteName,
        site_address: formData.siteAddress,
        
        // Test Specifications
        test_type: formData.testType,
        receipt_date: formData.receiptDate,
        ulr_number: formData.ulrNumber,
        job_number: formData.jobNumber,
        
        // Materials (empty for now)
        materials: [],
        
        // Step 4: Concrete Tests Processing
        concrete_tests: formData.cubeTests.map(test => ({
          id_mark: test.idMark,
          location_nature: test.locationNature,
          grade: test.grade,
          casting_date: test.castingDate,
          testing_date: test.testingDate,
          quantity: test.quantity,
          test_method: test.testMethod,
          sample_code_number: formData.referenceNumber  // Add reference number to each cube test
        }))
      };
      
      console.log('Submitting test request data:', testRequestData);
      
      // Submit to backend
      const response = await createTestRequest(testRequestData);
      
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Show success modal with data
      setSuccessData({
        jobNumber: formData.jobNumber,
        customerName: formData.customerName,
        testRequestId: response.id || response.test_request_id
      });
      setShowSuccessModal(true);
      
      // Navigate to view sample page after successful submission
      setTimeout(() => {
        const testReqId = response.id || response.test_request_id;
        navigate(`/view-sample/${testReqId}`, { 
          state: { 
            formData: formData,
            testRequestId: testReqId
          } 
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting test request:', error);
      
      // Use the new error handler to get user-friendly message
      const errorMessage = getErrorMessage(error);
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const fillRandomData = () => {
    setFormData({
      // Customer Information
      customerName: 'Lords Developers',
      contactPerson: 'John Smith',
      phone: '+91 9876543210',
      email: 'john@lordsdevelopers.com',
      siteName: 'Shivyogi Residency',
      siteAddress: 'Shelgi, Solapur, Maharashtra',
      
      // Test Specifications
      testType: 'CC',
      receiptDate: '2024-01-15',
      ulrNumber: 'TC-1575625000001840F',
      referenceNumber: 'REF-2024-001',
      jobNumber: 'T-2501690',
      
      // Building Materials
      materials: ['Cement', 'Sand', 'Aggregate', 'Water'],
      
      // Concrete Cube Tests
      cubeTests: [{
        id: 1,
        idMark: 'CC-001',
        locationNature: 'Column - Ground Floor',
        grade: 'M25',
        castingDate: '2024-01-10',
        testingDate: '2024-02-07',
        quantity: 3,
        testMethod: 'IS 516 (Part1/Sec1):2021'
      }],
      
      // Office Use
      reviewRemarks: 'Test approved for standard testing',
      labRepresentative: 'Dr. Rajesh Kumar',
      customerRepresentative: 'John Smith',
      qualityManager: 'Ms. Priya Sharma',
      termsAccepted: true
    });
  };

  const buildingMaterials = [
    'Cement', 'Sand', 'Aggregate', 'Water', 'Admixture', 'Fly Ash',
    'GGBS', 'Silica Fume', 'Steel Reinforcement', 'Formwork'
  ];

  const grades = ['M15', 'M20', 'M25', 'M30', 'M35', 'M40', 'M45', 'M50', 'M55', 'M60'];

  return (
    <Container className="mt-4" style={{ position: 'relative' }}>
      {/* Loading Overlay */}
      {isSubmitting && (
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
              className="spinner-border text-primary" 
              role="status" 
              style={{ width: '3rem', height: '3rem' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="mt-3">
              <h5 className="text-dark mb-2">Submitting Test Request...</h5>
              <p className="text-muted mb-0">Please wait while we process your request</p>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .form-control, .form-select {
          background-color: transparent !important;
          border: 1px solid #6c757d !important;
          color: white !important;
        }
        .form-control:focus, .form-select:focus {
          background-color: transparent !important;
          border-color: #FFA500 !important;
          color: white !important;
          box-shadow: 0 0 0 0.25rem rgba(255, 165, 0, 0.25) !important;
        }
        .form-control::placeholder {
          color: #adb5bd !important;
        }
        .form-select option {
          background-color: #343a40 !important;
          color: white !important;
        }
        .table input, .table select {
          background-color: transparent !important;
          border: 1px solid #6c757d !important;
          color: white !important;
        }
        .table input:focus, .table select:focus {
          background-color: transparent !important;
          border-color: #FFA500 !important;
          color: white !important;
          box-shadow: 0 0 0 0.25rem rgba(255, 165, 0, 0.25) !important;
        }
      `}</style>
      {showSuccess && (
        <Alert variant="success" className="mb-4">
          <i className="fas fa-check-circle me-2"></i>
          Test request submitted successfully! You can track its progress in the dashboard.
        </Alert>
      )}
      
      {submitError && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {submitError}
        </Alert>
      )}

      <h2 className="text-white mb-4">
        <i className={`fas ${editMode ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
        {editMode ? 'Edit Test Request' : 'New Test Request'}
      </h2>

      <Form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <Card className="mb-4">
          <Card.Header className="text-white" style={{backgroundColor: '#FFA500'}}>
            <h4 className="mb-0">
              <i className="fas fa-user me-2"></i>Customer Information
            </h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Customer Name</Form.Label>
                  {customersLoading ? (
                    <div className="d-flex align-items-center">
                      <Spinner animation="border" size="sm" className="me-2" />
                      <span>Loading customers...</span>
                    </div>
                  ) : customersError ? (
                    <Alert variant="warning" className="mb-0">
                      {customersError}
                    </Alert>
                  ) : (
                    <div className="customer-dropdown-container" style={{ position: 'relative' }}>
                      <Form.Control
                        type="text"
                    name="customerName"
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        onClick={handleCustomerInputClick}
                        placeholder="Select Customer"
                    required
                        autoComplete="off"
                        readOnly
                        style={{ cursor: 'pointer' }}
                      />
                      {showCustomerDropdown && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: '#343a40',
                            border: '1px solid #6c757d',
                            borderTop: 'none',
                            borderRadius: '0 0 6px 6px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            zIndex: 1000,
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {/* Search input inside dropdown */}
                          <div style={{ padding: '10px', borderBottom: '1px solid #495057' }}>
                            <Form.Control
                              type="text"
                              placeholder="Search customers..."
                              value={dropdownSearchTerm}
                              onChange={handleDropdownSearch}
                              autoComplete="off"
                              style={{
                                backgroundColor: '#495057',
                                border: '1px solid #6c757d',
                                color: 'white',
                                fontSize: '0.9em'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#FFA500'}
                              onBlur={(e) => e.target.style.borderColor = '#6c757d'}
                            />
                          </div>
                          
                          {/* Customer list */}
                          {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                              <div
                                key={customer.id}
                                onClick={() => handleCustomerSelect(customer)}
                                style={{
                                  padding: '10px 15px',
                                  cursor: 'pointer',
                                  borderBottom: '1px solid #495057',
                                  color: 'white',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = '#495057';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = 'transparent';
                                }}
                              >
                                <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                                  {customer.name}
                                </div>
                                <div style={{ fontSize: '0.85em', color: '#adb5bd' }}>
                                  {customer.contact_person && `${customer.contact_person} • `}
                                  {customer.phone && `${customer.phone} • `}
                                  {customer.city && customer.city}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div
                              style={{
                                padding: '15px',
                                color: '#adb5bd',
                                textAlign: 'center'
                              }}
                            >
                              {dropdownSearchTerm.trim() !== '' 
                                ? `No customers found matching "${dropdownSearchTerm}"`
                                : 'No customers available'
                              }
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Site Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="siteAddress"
                    value={formData.siteAddress}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Test Specifications */}
        <Card className="mb-4">
          <Card.Header className="text-white" style={{backgroundColor: '#FFA500'}}>
            <h4 className="mb-0">
              <i className="fas fa-clipboard-list me-2"></i>Test Specifications
            </h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Test Type</Form.Label>
                  <Form.Select
                    name="testType"
                    value={formData.testType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="CC">Concrete Cube (CC)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Receipt Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="receiptDate"
                    value={formData.receiptDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">ULR Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="ulrNumber"
                    value={formData.ulrNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Reference Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleInputChange}
                    placeholder="Enter reference number"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Job Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="jobNumber"
                    value={formData.jobNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>


        {/* Concrete Tests Processing */}
        <Card className="mb-4">
          <Card.Header className="text-white" style={{backgroundColor: '#FFA500'}}>
            <h4 className="mb-0">
              <i className="fas fa-cube me-2"></i>Concrete Tests Processing
            </h4>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>ID Mark</th>
                    <th>Location/Nature</th>
                    <th>Grade</th>
                    <th>Casting Date</th>
                    <th>Testing Date</th>
                    <th>Age in Days</th>
                    <th>Number of Cubes</th>
                    <th>Test Method</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.cubeTests.map((test) => (
                    <tr key={test.id}>
                      <td>
                        <Form.Control
                          type="text"
                          value={test.idMark}
                          onChange={(e) => handleCubeTestChange(test.id, 'idMark', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={test.locationNature}
                          onChange={(e) => handleCubeTestChange(test.id, 'locationNature', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <Form.Select
                          value={test.grade}
                          onChange={(e) => handleCubeTestChange(test.id, 'grade', e.target.value)}
                          required
                        >
                          <option value="">Select Grade</option>
                          {grades.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="date"
                          value={test.castingDate}
                          onChange={(e) => handleCubeTestChange(test.id, 'castingDate', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="date"
                          value={test.testingDate}
                          onChange={(e) => handleCubeTestChange(test.id, 'testingDate', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            test.castingDate && test.testingDate
                              ? Math.ceil((new Date(test.testingDate) - new Date(test.castingDate)) / (1000 * 60 * 60 * 24))
                              : ''
                          }
                          readOnly
                          disabled
                          style={{ backgroundColor: '#e9ecef', textAlign: 'center' }}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          max="3"
                          value={test.quantity}
                          onChange={(e) => handleCubeTestChange(test.id, 'quantity', parseInt(e.target.value))}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 3) {
                              alert('Number of cubes cannot exceed 3. Setting to maximum allowed value: 3.');
                              handleCubeTestChange(test.id, 'quantity', 3);
                            } else if (value < 1) {
                              alert('Number of cubes must be at least 1. Setting to minimum value: 1.');
                              handleCubeTestChange(test.id, 'quantity', 1);
                            }
                          }}
                          required
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={test.testMethod}
                          onChange={(e) => handleCubeTestChange(test.id, 'testMethod', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeCubeTest(test.id)}
                          disabled={formData.cubeTests.length === 1}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>

        {/* Office Use Section - COMMENTED OUT */}
        {/* <Card className="mb-4">
          <Card.Header className="bg-primary text-white" style={{backgroundColor: '#FFA500'}}>
            <h4 className="mb-0">
              <i className="fas fa-building me-2"></i>Office Use
            </h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Review Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="reviewRemarks"
                    value={formData.reviewRemarks}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lab Representative</Form.Label>
                  <Form.Control
                    type="text"
                    name="labRepresentative"
                    value={formData.labRepresentative}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Customer Representative</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerRepresentative"
                    value={formData.customerRepresentative}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quality Manager</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualityManager"
                    value={formData.qualityManager}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="termsAccepted"
                label="I accept the terms and conditions"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                name="termsAccepted"
                required
              />
            </Form.Group>
          </Card.Body>
        </Card> */}

        {/* Action Buttons */}
        <div className="text-center mb-4">
          <Button 
            type="button" 
            variant="warning" 
            size="lg" 
            className="me-3" 
            onClick={fillRandomData}
            disabled={isSubmitting}
          >
            <i className="fas fa-magic me-2"></i>Fill Random Data
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="me-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>Submit Test Request
              </>
            )}
          </Button>
          <Button type="button" variant="outline-secondary" size="lg">
            <i className="fas fa-times me-2"></i>Cancel
          </Button>
        </div>
      </Form>

      {/* Success Modal */}
      {showSuccessModal && (
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
              backgroundColor: '#1C2333',
              border: '2px solid #28A745',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              maxWidth: '500px',
              width: '90%'
            }}
          >
            <div style={{ fontSize: '48px', color: '#28A745', marginBottom: '20px' }}>
              ✅
            </div>
            <h3 style={{ color: '#28A745', marginBottom: '20px', fontWeight: 'bold' }}>
              Test Request Submitted Successfully!
            </h3>
            <div style={{ color: '#FFFFFF', marginBottom: '15px' }}>
              <strong>Job Number:</strong> {successData?.jobNumber}
            </div>
            <div style={{ color: '#FFFFFF', marginBottom: '20px' }}>
              <strong>Customer:</strong> {successData?.customerName}
            </div>
            <div style={{ color: '#28A745', marginBottom: '25px', fontSize: '14px' }}>
              Data has been saved to the database.
            </div>
            <Button 
              variant="success" 
              size="lg"
              onClick={() => {
                setShowSuccessModal(false);
                const testReqId = successData?.testRequestId;
                navigate(`/view-sample/${testReqId}`, { 
                  state: { 
                    formData: formData,
                    testRequestId: testReqId
                  } 
                });
              }}
              style={{
                backgroundColor: '#28A745',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 30px',
                fontWeight: 'bold'
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default TestRequestForm;