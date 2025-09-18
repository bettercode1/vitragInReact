import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TestRequestForm = () => {
  const navigate = useNavigate();
  
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMaterialChange = (material) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission delay
    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Navigate to view sample page with form data after 2 seconds
      setTimeout(() => {
        navigate('/view-sample', { 
          state: { formData: formData } 
        });
      }, 2000);
    }, 1500); // 1.5 seconds for loading simulation
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
                  <Form.Select
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Customer</option>
                    <option value="Lords Developers">Lords Developers</option>
                    <option value="ABC Construction">ABC Construction</option>
                    <option value="XYZ Builders">XYZ Builders</option>
                    <option value="PQR Infrastructure">PQR Infrastructure</option>
                    <option value="DEF Engineering">DEF Engineering</option>
                  </Form.Select>
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
                    <option value="CS">Concrete Slab (CS)</option>
                    <option value="CB">Concrete Beam (CB)</option>
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
                  <Form.Label>Reference Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleInputChange}
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

        {/* Building Materials - COMMENTED OUT */}
        {/* <Card className="mb-4">
          <Card.Header className="bg-primary text-white" style={{backgroundColor: '#FFA500'}}>
            <h4 className="mb-0">
              <i className="fas fa-hammer me-2"></i>Building Materials
            </h4>
          </Card.Header>
          <Card.Body>
            <Row>
              {buildingMaterials.map((material, index) => (
                <Col md={4} key={index}>
                  <Form.Check
                    type="checkbox"
                    id={`material-${index}`}
                    label={material}
                    checked={formData.materials.includes(material)}
                    onChange={() => handleMaterialChange(material)}
                  />
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card> */}

        {/* Concrete Cube Testing Requirements */}
        <Card className="mb-4">
          <Card.Header className="text-white d-flex justify-content-between align-items-center" style={{backgroundColor: '#FFA500'}}>
            <h4 className="mb-0">
              <i className="fas fa-cube me-2"></i>Concrete Cube Testing Requirements
            </h4>
            <Button variant="light" size="sm" onClick={addCubeTest}>
              <i className="fas fa-plus me-1"></i>Add Test
            </Button>
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
    </Container>
  );
};

export default TestRequestForm;