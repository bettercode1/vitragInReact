import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const TestRequestForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    contactPerson: '',
    phone: '',
    email: '',
    siteName: '',
    testType: '',
    receiptDate: '',
    ulrNumber: '',
    sampleCodeNumber: '',
    jobNumber: '',
    laboratoryRepresentative: '',
    customerRepresentative: '',
    customerDiscussion: '',
    probableCompletionDate: '',
    assignedTo: '',
    reviewedBy: '',
    qualityManager: ''
  });

  const [testingRequirements, setTestingRequirements] = useState([
    {
      id: 1,
      idMark: '',
      location: '',
      grade: '',
      castingDate: '',
      testingDate: '',
      ageInDays: '',
      noOfCubes: '',
      testMethod: ''
    }
  ]);

  const [otherMaterials, setOtherMaterials] = useState([]);
  const [errors, setErrors] = useState({});
  const [agreementChecked, setAgreementChecked] = useState(false);

  const grades = [
    'M-10', 'M-15', 'M-20', 'M-25', 'M-30', 'M-35', 'M-40', 
    'M-45', 'M-50', 'M-55', 'M-60', 'M-65', 'M-70', 'M-75', 'M-80'
  ];

  const buildingMaterials = [
    'River Sand', 'Crushed Sand', 'M-Sand', 'P-Sand', '10mm', 
    '20mm', 'Fly Ash', 'GGBS', 'Cement', 'Admixture', 'Curing'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTestingRequirementChange = (index, field, value) => {
    const updated = [...testingRequirements];
    updated[index][field] = value;
    setTestingRequirements(updated);
  };

  const addTestingRequirement = () => {
    setTestingRequirements([...testingRequirements, {
      id: testingRequirements.length + 1,
      idMark: '',
      location: '',
      grade: '',
      castingDate: '',
      testingDate: '',
      ageInDays: '',
      noOfCubes: '',
      testMethod: ''
    }]);
  };

  const removeTestingRequirement = (index) => {
    if (testingRequirements.length > 1) {
      setTestingRequirements(testingRequirements.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.siteName.trim()) newErrors.siteName = 'Site name is required';
    if (!formData.ulrNumber.trim()) newErrors.ulrNumber = 'ULR number is required';
    if (!formData.sampleCodeNumber.trim()) newErrors.sampleCodeNumber = 'Sample code number is required';
    if (!formData.jobNumber.trim()) newErrors.jobNumber = 'Job number is required';
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!agreementChecked) {
      newErrors.agreement = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log('Form submitted:', { formData, testingRequirements });
      alert('Test request submitted successfully!');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="header-vitrag">
        <Container>
          <Row className="text-center">
            <Col>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="fas fa-flask me-3" style={{ fontSize: '2rem' }}></i>
                <h1 style={{ color: 'var(--vitrag-gold)', fontWeight: '700' }}>
                  New Test Request Form
                </h1>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Form onSubmit={handleSubmit}>
          {/* Customer Details */}
          <Card className="card-vitrag mb-4">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}>Customer Details</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Customer Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className={`form-control-vitrag ${errors.customerName ? 'is-invalid' : ''}`}
                      placeholder="Enter customer name"
                    />
                    {errors.customerName && <div className="invalid-feedback">{errors.customerName}</div>}
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Contact Person <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className={`form-control-vitrag ${errors.contactPerson ? 'is-invalid' : ''}`}
                      placeholder="Enter contact person name"
                    />
                    {errors.contactPerson && <div className="invalid-feedback">{errors.contactPerson}</div>}
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Phone/Mobile <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-control-vitrag ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Enter 10-digit phone number"
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-control-vitrag ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter email address"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group>
                    <Form.Label>Site Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleInputChange}
                      className={`form-control-vitrag ${errors.siteName ? 'is-invalid' : ''}`}
                      placeholder="Enter site name and address"
                    />
                    {errors.siteName && <div className="invalid-feedback">{errors.siteName}</div>}
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Test Information */}
          <Card className="card-vitrag mb-4">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}>Test Information</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Test Type</Form.Label>
                    <Form.Select
                      name="testType"
                      value={formData.testType}
                      onChange={handleInputChange}
                      className="form-control-vitrag"
                    >
                      <option value="">Select test type</option>
                      <option value="concrete-cube">Concrete Cube Test</option>
                      <option value="aggregate">Aggregate Test</option>
                      <option value="cement">Cement Test</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Receipt Date (DD-MM-YYYY)</Form.Label>
                    <Form.Control
                      type="date"
                      name="receiptDate"
                      value={formData.receiptDate}
                      onChange={handleInputChange}
                      className="form-control-vitrag"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>ULR Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="ulrNumber"
                      value={formData.ulrNumber}
                      onChange={handleInputChange}
                      className={`form-control-vitrag ${errors.ulrNumber ? 'is-invalid' : ''}`}
                      placeholder="Enter ULR number"
                    />
                    {errors.ulrNumber && <div className="invalid-feedback">{errors.ulrNumber}</div>}
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Sample Code Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="sampleCodeNumber"
                      value={formData.sampleCodeNumber}
                      onChange={handleInputChange}
                      className={`form-control-vitrag ${errors.sampleCodeNumber ? 'is-invalid' : ''}`}
                      placeholder="Enter sample code number"
                    />
                    {errors.sampleCodeNumber && <div className="invalid-feedback">{errors.sampleCodeNumber}</div>}
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Job Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="jobNumber"
                      value={formData.jobNumber}
                      onChange={handleInputChange}
                      className={`form-control-vitrag ${errors.jobNumber ? 'is-invalid' : ''}`}
                      placeholder="Enter job number"
                    />
                    {errors.jobNumber && <div className="invalid-feedback">{errors.jobNumber}</div>}
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Building Material List */}
          <Card className="card-vitrag mb-4">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}>Building Material List</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                {buildingMaterials.map((material, index) => (
                  <Col md={4} sm={6} key={index} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`material-${index}`}
                      label={material}
                      disabled
                      className="text-muted"
                    />
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Testing Requirements */}
          <Card className="card-vitrag mb-4">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}>Testing Requirements</h4>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table className="table-vitrag">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>ID Mark</th>
                      <th>Location/Nature/Work</th>
                      <th>Grade</th>
                      <th>Casting Date</th>
                      <th>Testing Date</th>
                      <th>Age in days</th>
                      <th>No of cubes/Cores</th>
                      <th>Test Method/Specification</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testingRequirements.map((req, index) => (
                      <tr key={req.id}>
                        <td>{index + 1}</td>
                        <td>
                          <Form.Control
                            type="text"
                            value={req.idMark}
                            onChange={(e) => handleTestingRequirementChange(index, 'idMark', e.target.value)}
                            className="form-control-vitrag"
                            size="sm"
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={req.location}
                            onChange={(e) => handleTestingRequirementChange(index, 'location', e.target.value)}
                            className="form-control-vitrag"
                            size="sm"
                          />
                        </td>
                        <td>
                          <Form.Select
                            value={req.grade}
                            onChange={(e) => handleTestingRequirementChange(index, 'grade', e.target.value)}
                            className="form-control-vitrag"
                            size="sm"
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
                            value={req.castingDate}
                            onChange={(e) => handleTestingRequirementChange(index, 'castingDate', e.target.value)}
                            className="form-control-vitrag"
                            size="sm"
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="date"
                            value={req.testingDate}
                            onChange={(e) => handleTestingRequirementChange(index, 'testingDate', e.target.value)}
                            className="form-control-vitrag"
                            size="sm"
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={req.ageInDays}
                            onChange={(e) => handleTestingRequirementChange(index, 'ageInDays', e.target.value)}
                            className="form-control-vitrag"
                            size="sm"
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={req.noOfCubes}
                            onChange={(e) => handleTestingRequirementChange(index, 'noOfCubes', e.target.value)}
                            className="form-control-vitrag"
                            size="sm"
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={req.testMethod}
                            onChange={(e) => handleTestingRequirementChange(index, 'testMethod', e.target.value)}
                            className="form-control-vitrag"
                            size="sm"
                          />
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeTestingRequirement(index)}
                            disabled={testingRequirements.length === 1}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Button
                variant="outline-primary"
                onClick={addTestingRequirement}
                className="mt-3"
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Concrete Test
              </Button>
            </Card.Body>
          </Card>

          {/* Agreement */}
          <Card className="card-vitrag mb-4">
            <Card.Body>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  id="agreement"
                  label="I agree with all testing terms and conditions"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className={errors.agreement ? 'is-invalid' : ''}
                />
                {errors.agreement && <div className="invalid-feedback">{errors.agreement}</div>}
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Representatives */}
          <Card className="card-vitrag mb-4">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}>Representatives</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Laboratory Representative</Form.Label>
                    <Form.Control
                      type="text"
                      name="laboratoryRepresentative"
                      value={formData.laboratoryRepresentative}
                      onChange={handleInputChange}
                      className="form-control-vitrag"
                      placeholder="Enter laboratory representative name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Customer's Representative</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerRepresentative"
                      value={formData.customerRepresentative}
                      onChange={handleInputChange}
                      className="form-control-vitrag"
                      placeholder="Enter customer representative name"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Office Use */}
          <Card className="card-vitrag mb-4">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}>Office Use</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Review Remarks</Form.Label>
                    <div>
                      <Form.Check
                        type="checkbox"
                        id="requirements-defined"
                        label="Requirements defined"
                        className="mb-2"
                      />
                      <Form.Check
                        type="checkbox"
                        id="capability-available"
                        label="Capability available"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Customer Discussion</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="customerDiscussion"
                      value={formData.customerDiscussion}
                      onChange={handleInputChange}
                      className="form-control-vitrag"
                      placeholder="Enter customer discussion notes"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Probable Completion Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="probableCompletionDate"
                      value={formData.probableCompletionDate}
                      onChange={handleInputChange}
                      className="form-control-vitrag"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Assigned To</Form.Label>
                    <Form.Control
                      type="text"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleInputChange}
                      className="form-control-vitrag"
                      placeholder="Enter assigned person"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Reviewed By</Form.Label>
                    <Form.Control
                      type="text"
                      name="reviewedBy"
                      value={formData.reviewedBy}
                      onChange={handleInputChange}
                      className="form-control-vitrag"
                      placeholder="Enter reviewer name"
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group>
                    <Form.Label>Quality Manager</Form.Label>
                    <Form.Control
                      type="text"
                      name="qualityManager"
                      value={formData.qualityManager}
                      onChange={handleInputChange}
                      className="form-control-vitrag"
                      placeholder="Enter quality manager name"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Submit Button */}
          <div className="text-center mb-5">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="btn-vitrag-primary px-5"
            >
              Submit Test Request
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default TestRequestForm;
