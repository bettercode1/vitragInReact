import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCube, 
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

const AACBlocksForm = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    // General Information
    customer_id: '',
    sample_description: '',
    date_of_receipt: '',
    customer_site_name_address: '',
    reference_number: '',
    date_of_manufacturer: '',
    type_of_specimen: '',
    machine_used_for_testing: '',
    location_of_test: '',
    capacity_range: '',
    test_method: '',
    
    // Sample Details
    sample_test_code: '',
    date_of_testing: new Date().toISOString().split('T')[0],
    date_of_report: '',
    ulr_number: '',
    job_code_number: '',
    manufacturer: '',
    condition_of_specimen: '',
    calibration_due_date: '',
    environmental_condition: '',
    
    // AAC Block Specific Details
    quantity_of_blocks: '',
    date_of_casting: '',
    grade_of_blocks: '',
    manufacture_of_blocks: '',
    blocks_condition: '',
    curing_condition: '',
    
    // Test Results
    block_id_1: '', length_1: '', breadth_1: '', height_1: '', area_1: '', weight_1: '', density_1: '', load_max_1: '', compressive_strength_1: '',
    block_id_2: '', length_2: '', breadth_2: '', height_2: '', area_2: '', weight_2: '', density_2: '', load_max_2: '', compressive_strength_2: '',
    block_id_3: '', length_3: '', breadth_3: '', height_3: '', area_3: '', weight_3: '', density_3: '', load_max_3: '', compressive_strength_3: '',
    avg_load_max: '',
    avg_compressive_strength: '',
    
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

  const calculateArea = (rowNumber) => {
    const length = parseFloat(formData[`length_${rowNumber}`]) || 0;
    const breadth = parseFloat(formData[`breadth_${rowNumber}`]) || 0;
    const area = length * breadth;
    
    setFormData(prev => ({
      ...prev,
      [`area_${rowNumber}`]: area.toFixed(2)
    }));
  };

  const calculateDensity = (rowNumber) => {
    const length = parseFloat(formData[`length_${rowNumber}`]) || 0;
    const breadth = parseFloat(formData[`breadth_${rowNumber}`]) || 0;
    const height = parseFloat(formData[`height_${rowNumber}`]) || 0;
    const weight = parseFloat(formData[`weight_${rowNumber}`]) || 0;
    
    if (length > 0 && breadth > 0 && height > 0 && weight > 0) {
      const volume = (length * breadth * height) / 1000000000; // Convert mm³ to m³
      const density = weight / volume;
      
      setFormData(prev => ({
        ...prev,
        [`density_${rowNumber}`]: density.toFixed(1)
      }));
    }
  };

  const calculateAverages = () => {
    let loadMaxSum = 0;
    let compressiveStrengthSum = 0;
    let validLoadMaxCount = 0;
    let validCompressiveStrengthCount = 0;
    
    for (let row = 1; row <= 3; row++) {
      const loadMax = parseFloat(formData[`load_max_${row}`]) || 0;
      const compressiveStrength = parseFloat(formData[`compressive_strength_${row}`]) || 0;
      
      if (loadMax > 0) {
        loadMaxSum += loadMax;
        validLoadMaxCount++;
      }
      
      if (compressiveStrength > 0) {
        compressiveStrengthSum += compressiveStrength;
        validCompressiveStrengthCount++;
      }
    }
    
    const avgLoadMax = validLoadMaxCount > 0 ? loadMaxSum / validLoadMaxCount : 0;
    const avgCompressiveStrength = validCompressiveStrengthCount > 0 ? compressiveStrengthSum / validCompressiveStrengthCount : 0;
    
    setFormData(prev => ({
      ...prev,
      avg_load_max: avgLoadMax > 0 ? avgLoadMax.toFixed(1) : '',
      avg_compressive_strength: avgCompressiveStrength > 0 ? avgCompressiveStrength.toFixed(2) : ''
    }));
  };

  const fillRandomData = () => {
    if (window.confirm('This will fill all fields with sample data. Continue?')) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const randomData = {
        sample_description: 'AAC Blocks for compressive strength testing - Grade 3.5, manufactured by ABC Construction Ltd.',
        date_of_receipt: today.toISOString().split('T')[0],
        customer_site_name_address: 'ABC Construction Site, Plot No. 123, Industrial Area, Mumbai - 400001',
        reference_number: 'REF-2024-001',
        date_of_manufacturer: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type_of_specimen: 'AAC Block 600x200x200mm',
        machine_used_for_testing: 'Compression Testing Machine - 2000 kN',
        location_of_test: 'Laboratory',
        capacity_range: '0-2000 kN',
        test_method: 'IS 2185 (Part 1): 2005',
        sample_test_code: 'AAC-2024-001',
        date_of_report: tomorrow.toISOString().split('T')[0],
        ulr_number: 'ULR-2024-001',
        job_code_number: 'JOB-2024-001',
        manufacturer: 'ABC Construction Ltd.',
        condition_of_specimen: 'Dry',
        calibration_due_date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        environmental_condition: 'Laboratory Conditions: 27°C ± 2°C, 65% ± 5% RH',
        quantity_of_blocks: '10',
        date_of_casting: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        grade_of_blocks: 'Grade 3.5',
        manufacture_of_blocks: 'ABC Construction Ltd.',
        blocks_condition: 'Dry',
        curing_condition: 'Air cured for 14 days',
        tested_by_name: 'John Doe',
        checked_by_name: 'Jane Smith',
        remarks: 'Sample data filled for testing purposes. All measurements are approximate and should be replaced with actual test data.'
      };
      
      // Fill test results with random data
      for (let row = 1; row <= 3; row++) {
        randomData[`block_id_${row}`] = `BLK-${row.toString().padStart(3, '0')}`;
        randomData[`length_${row}`] = (600 + Math.random() * 2).toFixed(1);
        randomData[`breadth_${row}`] = (200 + Math.random() * 2).toFixed(1);
        randomData[`height_${row}`] = (200 + Math.random() * 2).toFixed(1);
        randomData[`weight_${row}`] = (8.5 + Math.random() * 1).toFixed(3);
        randomData[`load_max_${row}`] = (35000 + Math.random() * 5000).toFixed(1);
        randomData[`compressive_strength_${row}`] = (3.5 + Math.random() * 0.5).toFixed(2);
      }
      
      setFormData(prev => ({ ...prev, ...randomData }));
      
      // Trigger calculations
      setTimeout(() => {
        for (let row = 1; row <= 3; row++) {
          calculateArea(row);
          calculateDensity(row);
        }
        calculateAverages();
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
            <div style={{ backgroundColor: '#ffc107', padding: '2rem 0', borderRadius: '15px' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faCube} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />
                <div>
                  <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}>
                    AAC Block Test - Preview
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
                    <p><strong>Sample Description:</strong> {formData.sample_description}</p>
                    <p><strong>Date of Receipt:</strong> {formData.date_of_receipt}</p>
                    <p><strong>Customer/Site Address:</strong> {formData.customer_site_name_address}</p>
                    <p><strong>Reference Number:</strong> {formData.reference_number}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Date of Manufacturer:</strong> {formData.date_of_manufacturer}</p>
                    <p><strong>Type of Specimen:</strong> {formData.type_of_specimen}</p>
                    <p><strong>Machine Used:</strong> {formData.machine_used_for_testing}</p>
                    <p><strong>Location of Test:</strong> {formData.location_of_test}</p>
                    <p><strong>Capacity Range:</strong> {formData.capacity_range}</p>
                    <p><strong>Test Method:</strong> {formData.test_method}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sample Details Preview */}
        <Row className="mb-4">
          <Col>
            <Card className="card-vitrag shadow-sm">
              <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                  <FontAwesomeIcon icon={faFlask} className="me-2" />
                  Sample Details
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Sample Test Code:</strong> {formData.sample_test_code}</p>
                    <p><strong>Date of Testing:</strong> {formData.date_of_testing}</p>
                    <p><strong>Date of Report:</strong> {formData.date_of_report}</p>
                    <p><strong>ULR Number:</strong> {formData.ulr_number}</p>
                    <p><strong>Job Code Number:</strong> {formData.job_code_number}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Manufacturer:</strong> {formData.manufacturer}</p>
                    <p><strong>Condition of Specimen:</strong> {formData.condition_of_specimen}</p>
                    <p><strong>Calibration Due Date:</strong> {formData.calibration_due_date}</p>
                    <p><strong>Environmental Condition:</strong> {formData.environmental_condition}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* AAC Block Specific Details Preview */}
        <Row className="mb-4">
          <Col>
            <Card className="card-vitrag shadow-sm">
              <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                  <FontAwesomeIcon icon={faCube} className="me-2" />
                  AAC Block Specific Details
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Quantity of Blocks:</strong> {formData.quantity_of_blocks}</p>
                    <p><strong>Date of Casting:</strong> {formData.date_of_casting}</p>
                    <p><strong>Grade of Blocks:</strong> {formData.grade_of_blocks}</p>
                    <p><strong>Manufacture of Blocks:</strong> {formData.manufacture_of_blocks}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Blocks Condition:</strong> {formData.blocks_condition}</p>
                    <p><strong>Curing Condition:</strong> {formData.curing_condition}</p>
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
                        <th>Sr. No</th>
                        <th>Block ID</th>
                        <th>Length (mm)</th>
                        <th>Breadth (mm)</th>
                        <th>Height (mm)</th>
                        <th>Area (mm²)</th>
                        <th>Weight (Kg)</th>
                        <th>Density (Kg/m³)</th>
                        <th>Load Max (N)</th>
                        <th>Compressive Strength (MPa)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((row) => (
                        <tr key={row}>
                          <td>{row}</td>
                          <td>{formData[`block_id_${row}`]}</td>
                          <td>{formData[`length_${row}`]}</td>
                          <td>{formData[`breadth_${row}`]}</td>
                          <td>{formData[`height_${row}`]}</td>
                          <td>{formData[`area_${row}`]}</td>
                          <td>{formData[`weight_${row}`]}</td>
                          <td>{formData[`density_${row}`]}</td>
                          <td>{formData[`load_max_${row}`]}</td>
                          <td>{formData[`compressive_strength_${row}`]}</td>
                        </tr>
                      ))}
                      <tr className="table-secondary">
                        <td colSpan="8" className="text-end fw-bold">Average</td>
                        <td className="text-center fw-bold">{formData.avg_load_max}</td>
                        <td className="text-center fw-bold">{formData.avg_compressive_strength}</td>
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
            <div style={{ backgroundColor: '#ffc107', padding: '2rem 0', borderRadius: '15px' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faCube} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />
                <div>
                  <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}>
                    Determination of Compressive Strength of AAC Block
                  </h1>
                  <p className="mb-0 mt-2" style={{ color: 'white' }}>
                    This test is conducted to determine the compressive strength of AAC Blocks
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
                        <Form.Label>Sample Description *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="sample_description"
                          value={formData.sample_description}
                          onChange={handleInputChange}
                          placeholder="Describe the sample..."
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
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Customer/Site Name & Address *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="customer_site_name_address"
                          value={formData.customer_site_name_address}
                          onChange={handleInputChange}
                          placeholder="Enter customer/site name and address"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Reference Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="reference_number"
                          value={formData.reference_number}
                          onChange={handleInputChange}
                          placeholder="Enter reference number"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Manufacturer</Form.Label>
                        <Form.Control
                          type="date"
                          name="date_of_manufacturer"
                          value={formData.date_of_manufacturer}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Type of Specimen *</Form.Label>
                        <Form.Control
                          type="text"
                          name="type_of_specimen"
                          value={formData.type_of_specimen}
                          onChange={handleInputChange}
                          placeholder="e.g., AAC Block"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Machine Used for Testing *</Form.Label>
                        <Form.Control
                          type="text"
                          name="machine_used_for_testing"
                          value={formData.machine_used_for_testing}
                          onChange={handleInputChange}
                          placeholder="e.g., Compression Testing Machine"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Location of Test *</Form.Label>
                        <Form.Control
                          type="text"
                          name="location_of_test"
                          value={formData.location_of_test}
                          onChange={handleInputChange}
                          placeholder="e.g., Laboratory, Site, etc."
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Capacity Range *</Form.Label>
                        <Form.Control
                          type="text"
                          name="capacity_range"
                          value={formData.capacity_range}
                          onChange={handleInputChange}
                          placeholder="e.g., 2000 kN, 0-100%"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Test Method *</Form.Label>
                        <Form.Control
                          type="text"
                          name="test_method"
                          value={formData.test_method}
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

          {/* SECTION 2: Sample Details */}
          <Row className="mb-4">
            <Col>
              <Card className="card-vitrag shadow-sm">
                <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                  <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                    <FontAwesomeIcon icon={faFlask} className="me-2" />
                    Sample Details
                  </h5>
                </Card.Header>
                <Card.Body className="transparent-input-section">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Sample Test Code *</Form.Label>
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
                        <Form.Label>Date of Report *</Form.Label>
                        <Form.Control
                          type="date"
                          name="date_of_report"
                          value={formData.date_of_report}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>ULR Number *</Form.Label>
                        <Form.Control
                          type="text"
                          name="ulr_number"
                          value={formData.ulr_number}
                          onChange={handleInputChange}
                          placeholder="Enter ULR number"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Job Code Number *</Form.Label>
                        <Form.Control
                          type="text"
                          name="job_code_number"
                          value={formData.job_code_number}
                          onChange={handleInputChange}
                          placeholder="Enter job code number"
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Manufacturer</Form.Label>
                        <Form.Control
                          type="text"
                          name="manufacturer"
                          value={formData.manufacturer}
                          onChange={handleInputChange}
                          placeholder="Enter manufacturer name"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Condition of Specimen</Form.Label>
                        <Form.Control
                          type="text"
                          name="condition_of_specimen"
                          value={formData.condition_of_specimen}
                          onChange={handleInputChange}
                          placeholder="e.g., Dry, Wet, Saturated"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Calibration Due Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="calibration_due_date"
                          value={formData.calibration_due_date}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Environmental Condition</Form.Label>
                        <Form.Control
                          type="text"
                          name="environmental_condition"
                          value={formData.environmental_condition}
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

          {/* SECTION 3: AAC Block Specific Details */}
          <Row className="mb-4">
            <Col>
              <Card className="card-vitrag shadow-sm">
                <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                  <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                    <FontAwesomeIcon icon={faCube} className="me-2" />
                    AAC Block Specific Details
                  </h5>
                </Card.Header>
                <Card.Body className="transparent-input-section">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Quantity of Blocks *</Form.Label>
                        <Form.Control
                          type="text"
                          name="quantity_of_blocks"
                          value={formData.quantity_of_blocks}
                          onChange={handleInputChange}
                          placeholder="e.g., 10"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Casting *</Form.Label>
                        <Form.Control
                          type="date"
                          name="date_of_casting"
                          value={formData.date_of_casting}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Grade of Blocks *</Form.Label>
                        <Form.Control
                          type="text"
                          name="grade_of_blocks"
                          value={formData.grade_of_blocks}
                          onChange={handleInputChange}
                          placeholder="e.g., Grade 3.5"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Manufacture of Blocks *</Form.Label>
                        <Form.Control
                          type="text"
                          name="manufacture_of_blocks"
                          value={formData.manufacture_of_blocks}
                          onChange={handleInputChange}
                          placeholder="e.g., ABC Manufacturing"
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Blocks Condition *</Form.Label>
                        <Form.Control
                          type="text"
                          name="blocks_condition"
                          value={formData.blocks_condition}
                          onChange={handleInputChange}
                          placeholder="e.g., Dry, Wet, Saturated"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Curing Condition *</Form.Label>
                        <Form.Control
                          type="text"
                          name="curing_condition"
                          value={formData.curing_condition}
                          onChange={handleInputChange}
                          placeholder="e.g., Air cured, Water cured"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* SECTION 4: Test Results Table */}
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
                    <table className="table transparent-table" style={{ fontSize: '0.9rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                      <thead className="table-dark">
                        <tr>
                          <th rowSpan="2" style={{ width: '50px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Sr. No</th>
                          <th rowSpan="2" style={{ width: '90px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Blocks ID</th>
                          <th colSpan="3" style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '1rem' }}>Size</th>
                          <th rowSpan="2" style={{ width: '90px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Area (mm²)</th>
                          <th rowSpan="2" style={{ width: '120px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Block Weight (Kg)</th>
                          <th rowSpan="2" style={{ width: '120px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Density (Kg/m³)</th>
                          <th rowSpan="2" style={{ width: '120px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Load Maximum (N)</th>
                          <th rowSpan="2" style={{ width: '150px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Compressive Strength (Mpa)</th>
                        </tr>
                        <tr>
                          <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '0.9rem' }}>L (mm)</th>
                          <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '0.9rem' }}>B (mm)</th>
                          <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '0.9rem' }}>H (mm)</th>
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
                                name={`block_id_${row}`}
                                value={formData[`block_id_${row}`]}
                                onChange={handleInputChange}
                                placeholder=""
                                style={{ fontSize: '0.8rem' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.1"
                                name={`length_${row}`}
                                value={formData[`length_${row}`]}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  setTimeout(() => calculateArea(row), 0);
                                }}
                                style={{ fontSize: '0.8rem', textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.1"
                                name={`breadth_${row}`}
                                value={formData[`breadth_${row}`]}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  setTimeout(() => calculateArea(row), 0);
                                }}
                                style={{ fontSize: '0.8rem', textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.1"
                                name={`height_${row}`}
                                value={formData[`height_${row}`]}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  setTimeout(() => calculateDensity(row), 0);
                                }}
                                style={{ fontSize: '0.8rem', textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.01"
                                name={`area_${row}`}
                                value={formData[`area_${row}`]}
                                readOnly
                                style={{ fontSize: '0.8rem', textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.001"
                                name={`weight_${row}`}
                                value={formData[`weight_${row}`]}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  setTimeout(() => calculateDensity(row), 0);
                                }}
                                style={{ fontSize: '0.8rem' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.1"
                                name={`density_${row}`}
                                value={formData[`density_${row}`]}
                                readOnly
                                style={{ fontSize: '0.8rem' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.1"
                                name={`load_max_${row}`}
                                value={formData[`load_max_${row}`]}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  setTimeout(() => calculateAverages(), 0);
                                }}
                                style={{ fontSize: '0.8rem' }}
                              />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.01"
                                name={`compressive_strength_${row}`}
                                value={formData[`compressive_strength_${row}`]}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  setTimeout(() => calculateAverages(), 0);
                                }}
                                style={{ fontSize: '0.8rem' }}
                              />
                            </td>
                          </tr>
                        ))}
                        {/* Average Row */}
                        <tr className="table-info">
                          <td colSpan="8" className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', fontSize: '1.1rem' }}>Average</td>
                          <td className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                            <Form.Control
                              size="sm"
                              type="number"
                              step="0.1"
                              name="avg_load_max"
                              value={formData.avg_load_max}
                              readOnly
                              className="average-input-transparent"
                              style={{ 
                                fontSize: '0.8rem',
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
                          <td className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                            <Form.Control
                              size="sm"
                              type="number"
                              step="0.01"
                              name="avg_compressive_strength"
                              value={formData.avg_compressive_strength}
                              readOnly
                              className="average-input-transparent"
                              style={{ 
                                fontSize: '0.8rem',
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

          {/* SECTION 5: Verification */}
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

          {/* SECTION 6: Remarks */}
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
                      rows={3}
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

          {/* SECTION 7: Review & Authorization */}
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

export default AACBlocksForm;
