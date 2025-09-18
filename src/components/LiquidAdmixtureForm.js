import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTint, 
  faArrowLeft, 
  faSave, 
  faTimes, 
  faMagic,
  faInfoCircle,
  faFlask,
  faTable,
  faUserCheck,
  faComment
} from '@fortawesome/free-solid-svg-icons';

const LiquidAdmixtureForm = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    // General Information
    customer_id: '',
    url_number: '',
    job_code_number: '',
    reference_number: '',
    sample_description: '',
    date_of_receipt: '',
    sample_test_code: '',
    date_of_testing: new Date().toISOString().split('T')[0],
    environmental_conditions: 'Laboratory Conditions',
    
    // Test Results
    colour_texture_1: '', volume_ml_1: '400', temperature_c_1: '', hydrometer_reading_1: '', relative_density_1: '',
    colour_texture_2: '', volume_ml_2: '400', temperature_c_2: '', hydrometer_reading_2: '', relative_density_2: '',
    colour_texture_3: '', volume_ml_3: '400', temperature_c_3: '', hydrometer_reading_3: '', relative_density_3: '',
    average_relative_density: '',
    
    // Verification
    tested_by_name: '',
    tested_by_date: new Date().toISOString().split('T')[0],
    checked_by_name: '',
    checked_by_date: new Date().toISOString().split('T')[0],
    verified_by_name: 'Prakarsh A Sangave',
    verified_by_date: new Date().toISOString().split('T')[0],
    reviewed_by: 'Lalita S. Dussa - Quality Manager',
    authorized_by: 'Prakarsh Sangave',
    remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAverage = () => {
    let sum = 0;
    let count = 0;
    
    for (let row = 1; row <= 3; row++) {
      const relativeDensity = parseFloat(formData[`relative_density_${row}`]) || 0;
      if (relativeDensity > 0) {
        sum += relativeDensity;
        count++;
      }
    }
    
    const average = count > 0 ? sum / count : 0;
    setFormData(prev => ({
      ...prev,
      average_relative_density: average > 0 ? average.toFixed(4) : ''
    }));
  };

  const fillRandomData = () => {
    if (window.confirm('This will fill all fields with sample data. Continue?')) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const randomData = {
        url_number: 'URL-2024-001',
        job_code_number: 'JOB-2024-001',
        reference_number: 'REF-2024-001',
        sample_description: 'Liquid Admixture for concrete - Superplasticizer type, manufactured by ABC Chemicals Ltd.',
        date_of_receipt: today.toISOString().split('T')[0],
        sample_test_code: 'LA-2024-001',
        date_of_testing: today.toISOString().split('T')[0],
        environmental_conditions: 'Laboratory Conditions: 27°C ± 2°C, 65% ± 5% RH',
        tested_by_name: 'John Doe',
        checked_by_name: 'Jane Smith',
        remarks: 'Sample data filled for testing purposes. All measurements are approximate and should be replaced with actual test data.'
      };
      
      // Fill test results with random data
      for (let row = 1; row <= 3; row++) {
        randomData[`colour_texture_${row}`] = row === 1 ? 'Light Brown, Viscous' : row === 2 ? 'Dark Brown, Thick' : 'Medium Brown, Smooth';
        randomData[`temperature_c_${row}`] = (25 + Math.random() * 2).toFixed(1);
        randomData[`hydrometer_reading_${row}`] = (1.15 + Math.random() * 0.1).toFixed(4);
        randomData[`relative_density_${row}`] = (1.15 + Math.random() * 0.1).toFixed(4);
      }
      
      setFormData(prev => ({ ...prev, ...randomData }));
      
      // Trigger calculation
      setTimeout(() => {
        calculateAverage();
      }, 100);
      
      alert('Random data filled successfully! Please review and modify as needed before submitting.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleConfirmSubmit = () => {
    // Handle final form submission here
    console.log('Form submitted:', formData);
    alert('Test data saved successfully!');
    setShowPreview(false);
  };

  const handleEditForm = () => {
    setShowPreview(false);
  };

  // Preview Form Component
  const PreviewForm = () => (
    <div>
      {/* Header */}
            <div style={{ backgroundColor: '#dc3545', padding: '2rem 0', borderRadius: '15px' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faTint} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />
                <div>
                  <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}>
                    Liquid Admixture Test - Preview
                  </h1>
                  <p className="mb-0 mt-2" style={{ color: 'white' }}>
                    Review all details before final submission
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                onClick={handleEditForm}
                variant="light"
                className="btn-vitrag-primary me-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Edit Form
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* General Information Preview */}
        <Row className="mb-4">
          <Col>
            <Card className="card-vitrag shadow-sm">
              <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  General Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Customer:</strong> {formData.customer_id === '1' ? 'ABC Construction Ltd.' : formData.customer_id === '2' ? 'XYZ Builders' : formData.customer_id === '3' ? 'DEF Infrastructure' : formData.customer_id}</p>
                    <p><strong>URL Number:</strong> {formData.url_number}</p>
                    <p><strong>Job Code Number:</strong> {formData.job_code_number}</p>
                    <p><strong>Reference Number:</strong> {formData.reference_number}</p>
                    <p><strong>Sample Description:</strong> {formData.sample_description}</p>
                    <p><strong>Date of Receipt:</strong> {formData.date_of_receipt}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Sample Test Code:</strong> {formData.sample_test_code}</p>
                    <p><strong>Date of Testing:</strong> {formData.date_of_testing}</p>
                    <p><strong>Environmental Conditions:</strong> {formData.environmental_conditions}</p>
                    <p><strong>Test Method:</strong> IS 9103:1999</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Test Results Preview */}
        <Row className="mb-4">
          <Col>
            <Card className="card-vitrag shadow-sm">
              <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                  <FontAwesomeIcon icon={faTable} className="me-2" />
                  Test Results
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm" style={{ fontSize: '0.875rem' }}>
                    <thead className="table-dark">
                      <tr>
                        <th>Sr. No.</th>
                        <th>Colour & Texture of Admixture</th>
                        <th>Volume of Admixture taken (ml)</th>
                        <th>Temperature of Liquid (°C)</th>
                        <th>Reading on Hydrometer</th>
                        <th>Relative Density of Admixture</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((row) => (
                        <tr key={row}>
                          <td>{row}</td>
                          <td>{formData[`colour_texture_${row}`]}</td>
                          <td>{formData[`volume_ml_${row}`]}</td>
                          <td>{formData[`temperature_c_${row}`]}</td>
                          <td>{formData[`hydrometer_reading_${row}`]}</td>
                          <td>{formData[`relative_density_${row}`]}</td>
                        </tr>
                      ))}
                      <tr className="table-secondary">
                        <td colSpan="5" className="text-center fw-bold">Average</td>
                        <td className="text-center fw-bold">{formData.average_relative_density}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Verification Preview */}
        <Row className="mb-4">
          <Col>
            <Card className="card-vitrag shadow-sm">
              <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                  <FontAwesomeIcon icon={faUserCheck} className="me-2" />
                  Verification & Authorization
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <h6>Tested By</h6>
                    <p><strong>Name:</strong> {formData.tested_by_name}</p>
                    <p><strong>Date:</strong> {formData.tested_by_date}</p>
                  </Col>
                  <Col md={4}>
                    <h6>Checked By</h6>
                    <p><strong>Name:</strong> {formData.checked_by_name}</p>
                    <p><strong>Date:</strong> {formData.checked_by_date}</p>
                  </Col>
                  <Col md={4}>
                    <h6>Verified By</h6>
                    <p><strong>Name:</strong> {formData.verified_by_name}</p>
                    <p><strong>Date:</strong> {formData.verified_by_date}</p>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <h6>Reviewed By</h6>
                    <p><strong>Name:</strong> {formData.reviewed_by}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Authorized By</h6>
                    <p><strong>Name:</strong> {formData.authorized_by}</p>
                  </Col>
                </Row>
                {formData.remarks && (
                  <Row className="mt-3">
                    <Col>
                      <h6>Remarks</h6>
                      <p>{formData.remarks}</p>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row>
          <Col className="text-center">
            <Button 
              onClick={handleEditForm}
              variant="secondary" 
              size="lg" 
              className="me-3"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Edit Form
            </Button>
            <Button 
              onClick={handleConfirmSubmit}
              variant="success" 
              size="lg" 
              className="me-3"
            >
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Confirm & Save
            </Button>
            <Button 
              as={Link} 
              to="/other-services" 
              variant="danger" 
              size="lg"
              className="px-5"
            >
              <FontAwesomeIcon icon={faTimes} className="me-2" />
              Cancel
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );

  if (showPreview) {
    return <PreviewForm />;
  }

  return (
    <div>
      {/* Header */}
            <div style={{ backgroundColor: '#dc3545', padding: '2rem 0', borderRadius: '15px' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faTint} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />
                <div>
                  <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}>
                    Liquid Admixture - Relative Density Test
                  </h1>
                  <p className="mb-0 mt-2" style={{ color: 'white' }}>
                    Test Method: IS 9103:1999
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                as={Link} 
                to="/other-services" 
                variant="light"
                className="btn-vitrag-primary"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to Other Services
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Form onSubmit={handleSubmit}>
          {/* SECTION 1: General Information */}
          <Row className="mb-4">
            <Col>
              <Card className="card-vitrag shadow-sm">
                <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                  <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    General Information
                  </h5>
                </Card.Header>
                <Card.Body className="transparent-input-section">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Customer *</Form.Label>
                        <Form.Select 
                          name="customer_id" 
                          value={formData.customer_id}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Customer</option>
                          <option value="1">ABC Construction Ltd.</option>
                          <option value="2">XYZ Builders</option>
                          <option value="3">DEF Infrastructure</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>URL Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="url_number"
                          value={formData.url_number}
                          onChange={handleInputChange}
                          placeholder="Enter URL number for reference"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Job Code Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="job_code_number"
                          value={formData.job_code_number}
                          onChange={handleInputChange}
                          placeholder="Enter job code number for reference"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Reference Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="reference_number"
                          value={formData.reference_number}
                          onChange={handleInputChange}
                          placeholder="Enter reference number for tracking"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Sample Description *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="sample_description"
                          value={formData.sample_description}
                          onChange={handleInputChange}
                          placeholder="Describe the liquid admixture sample..."
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Receipt *</Form.Label>
                        <Form.Control
                          type="date"
                          name="date_of_receipt"
                          value={formData.date_of_receipt}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Sample Test Code Number *</Form.Label>
                        <Form.Control
                          type="text"
                          name="sample_test_code"
                          value={formData.sample_test_code}
                          onChange={handleInputChange}
                          placeholder="e.g., SCN-2024001"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Testing *</Form.Label>
                        <Form.Control
                          type="date"
                          name="date_of_testing"
                          value={formData.date_of_testing}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Environmental Conditions</Form.Label>
                        <Form.Control
                          type="text"
                          name="environmental_conditions"
                          value={formData.environmental_conditions}
                          onChange={handleInputChange}
                          placeholder="e.g., Laboratory Conditions"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* SECTION 2: Test Results */}
          <Row className="mb-4">
            <Col>
              <Card className="card-vitrag shadow-sm">
                <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                  <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                    <FontAwesomeIcon icon={faFlask} className="me-2" />
                    Test Results
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table transparent-table" style={{ fontSize: '0.9rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                      <thead className="table-dark">
                        <tr>
                          <th style={{ width: '50px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Sr. No.</th>
                          <th style={{ width: '200px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Colour & Texture of Admixture</th>
                          <th style={{ width: '150px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Volume of Admixture taken (ml)</th>
                          <th style={{ width: '150px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Temperature of Liquid (°C)</th>
                          <th style={{ width: '150px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Reading on Hydrometer</th>
                          <th style={{ width: '200px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Relative Density of Admixture</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((row) => (
                          <tr key={row}>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{row}</td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="text"
                                name={`colour_texture_${row}`}
                                value={formData[`colour_texture_${row}`]}
                                onChange={handleInputChange}
                                placeholder=""
                                style={{ fontSize: '0.8rem' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.01"
                                name={`volume_ml_${row}`}
                                value={formData[`volume_ml_${row}`]}
                                readOnly
                                style={{ fontSize: '0.8rem', textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.1"
                                name={`temperature_c_${row}`}
                                value={formData[`temperature_c_${row}`]}
                                onChange={handleInputChange}
                                placeholder=""
                                style={{ fontSize: '0.8rem', textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.0001"
                                name={`hydrometer_reading_${row}`}
                                value={formData[`hydrometer_reading_${row}`]}
                                onChange={handleInputChange}
                                placeholder=""
                                style={{ fontSize: '0.8rem', textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.0001"
                                name={`relative_density_${row}`}
                                value={formData[`relative_density_${row}`]}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  setTimeout(() => calculateAverage(), 0);
                                }}
                                placeholder=""
                                style={{ fontSize: '0.8rem', textAlign: 'center' }}
                              />
                            </td>
                          </tr>
                        ))}
                        {/* Average Row */}
                        <tr className="table-info">
                          <td colSpan="5" className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', fontSize: '1.1rem' }}>Average</td>
                          <td className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                            <Form.Control
                              size="sm"
                              type="number"
                              step="0.0001"
                              name="average_relative_density"
                              value={formData.average_relative_density}
                              readOnly
                              className="average-input-transparent"
                              style={{ 
                                fontSize: '0.8rem', 
                                textAlign: 'center',
                                backgroundColor: '#495057',
                                background: '#495057',
                                backgroundImage: 'none',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                color: '#ffffff',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                appearance: 'none',
                                boxShadow: 'none',
                                outline: 'none'
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* SECTION 3: Verification */}
          <Row className="mb-4">
            <Col>
              <Card className="card-vitrag shadow-sm">
                <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                  <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                    <FontAwesomeIcon icon={faUserCheck} className="me-2" />
                    Verification
                  </h5>
                </Card.Header>
                <Card.Body className="transparent-input-section">
                  <Row>
                    <Col md={4}>
                      <h6>Tested By</h6>
                      <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="tested_by_name"
                          value={formData.tested_by_name}
                          onChange={handleInputChange}
                          placeholder="Enter tester name"
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="tested_by_date"
                          value={formData.tested_by_date}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <h6>Checked By</h6>
                      <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="checked_by_name"
                          value={formData.checked_by_name}
                          onChange={handleInputChange}
                          placeholder="Enter checker name"
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="checked_by_date"
                          value={formData.checked_by_date}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <h6>Verified By</h6>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="verified_by_name"
                          value={formData.verified_by_name}
                          readOnly
                          style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: '#495057', opacity: 0.9 }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="verified_by_date"
                          value={formData.verified_by_date}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* SECTION 4: Remarks */}
          <Row className="mb-4">
            <Col>
              <Card className="card-vitrag shadow-sm">
                <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                  <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                    <FontAwesomeIcon icon={faComment} className="me-2" />
                    Remarks
                  </h5>
                </Card.Header>
                <Card.Body className="transparent-input-section">
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      placeholder="Enter any additional remarks or observations..."
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* SECTION 5: Review & Authorization */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="card-vitrag shadow-sm">
                <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                  <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                    <FontAwesomeIcon icon={faUserCheck} className="me-2" />
                    Reviewed By
                  </h5>
                </Card.Header>
                <Card.Body className="transparent-input-section">
                  <Form.Group className="mb-3">
                    <Form.Label>Select Reviewer:</Form.Label>
                    <Form.Select 
                      name="reviewed_by" 
                      value={formData.reviewed_by}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select a reviewer --</option>
                      <option value="Lalita S. Dussa - Quality Manager">Lalita S. Dussa - Quality Manager</option>
                      <option value="Prakarsha A. Sangave - Quality Manager">Prakarsha A. Sangave - Quality Manager</option>
                      <option value="Harsha Prakarsha Sangave - Quality Manager">Harsha Prakarsha Sangave - Quality Manager</option>
                      <option value="Amol A Adam - Quality Manager">Amol A Adam - Quality Manager</option>
                      <option value="Aaquib J. Shaikh - Quality Manager">Aaquib J. Shaikh - Quality Manager</option>
                    </Form.Select>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="card-vitrag shadow-sm">
                <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                  <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                    <FontAwesomeIcon icon={faUserCheck} className="me-2" />
                    Authorized By
                  </h5>
                </Card.Header>
                <Card.Body className="transparent-input-section">
                  <Form.Group className="mb-3">
                    <Form.Label>Authorized By:</Form.Label>
                    <Form.Control
                      type="text"
                      name="authorized_by"
                      value={formData.authorized_by}
                      readOnly
                      style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: '#495057', opacity: 0.9 }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Action Buttons */}
          <Row>
            <Col className="text-center">
              <Button 
                type="button" 
                variant="info" 
                size="lg" 
                className="me-3"
                onClick={fillRandomData}
              >
                <FontAwesomeIcon icon={faMagic} className="me-2" />
                Fill Random Data
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="me-3"
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Save Test Data
              </Button>
              <Button 
                as={Link} 
                to="/other-services" 
                variant="secondary" 
                size="lg"
                className="px-5"
              >
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default LiquidAdmixtureForm;
