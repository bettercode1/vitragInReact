import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWeightHanging, 
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

const BulkDensityMoistureForm = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    // General Information
    customer_id: '',
    sample_description: '',
    date_of_receipt: '',
    customer_site_name: '',
    reference_number: '',
    date_of_manufacturer: '',
    type_of_specimen: '',
    machine_used: '',
    location_of_test: '',
    capacity_range: '',
    test_method: '',
    
    // Test Details
    sample_test_code: '',
    date_of_testing: new Date().toISOString().split('T')[0],
    date_of_report: '',
    url_number: '',
    job_code_number: '',
    manufacturer: '',
    condition_of_specimen: '',
    calibration_due_date: '',
    environmental_conditions: 'Laboratory Conditions',
    
    // Test Results
    weight_before_1: '', weight_after_1: '', length_1: '', breadth_1: '', depth_1: '', volume_1: '', bulk_density_1: '', moisture_content_1: '',
    weight_before_2: '', weight_after_2: '', length_2: '', breadth_2: '', depth_2: '', volume_2: '', bulk_density_2: '', moisture_content_2: '',
    weight_before_3: '', weight_after_3: '', length_3: '', breadth_3: '', depth_3: '', volume_3: '', bulk_density_3: '', moisture_content_3: '',
    avg_bulk_density: '',
    avg_moisture_content: '',
    
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

  const calculateVolume = (rowNumber) => {
    const length = parseFloat(formData[`length_${rowNumber}`]) || 0;
    const breadth = parseFloat(formData[`breadth_${rowNumber}`]) || 0;
    const depth = parseFloat(formData[`depth_${rowNumber}`]) || 0;
    
    const volume = (length * breadth * depth) / 1000000000; // Convert mm³ to m³
    
    setFormData(prev => ({
      ...prev,
      [`volume_${rowNumber}`]: volume.toFixed(6)
    }));
    
    calculateBulkDensity(rowNumber);
  };

  const calculateBulkDensity = (rowNumber) => {
    const weightAfter = parseFloat(formData[`weight_after_${rowNumber}`]) || 0;
    const volume = parseFloat(formData[`volume_${rowNumber}`]) || 0;
    
    let bulkDensity = 0;
    if (volume > 0) {
      bulkDensity = weightAfter / volume;
    }
    
    setFormData(prev => ({
      ...prev,
      [`bulk_density_${rowNumber}`]: bulkDensity.toFixed(1)
    }));
    
    calculateAverages();
    calculateMoistureContent(rowNumber);
  };

  const calculateMoistureContent = (rowNumber) => {
    const weightBefore = parseFloat(formData[`weight_before_${rowNumber}`]) || 0;
    const weightAfter = parseFloat(formData[`weight_after_${rowNumber}`]) || 0;
    
    let moistureContent = 0;
    if (weightAfter > 0) {
      const difference = weightBefore - weightAfter;
      const ratio = difference / weightAfter;
      moistureContent = ratio * 100;
    }
    
    setFormData(prev => ({
      ...prev,
      [`moisture_content_${rowNumber}`]: moistureContent.toFixed(2)
    }));
    
    calculateAverages();
  };

  const calculateAverages = () => {
    let bulkDensitySum = 0;
    let moistureContentSum = 0;
    let validBulkDensityCount = 0;
    let validMoistureContentCount = 0;
    
    for (let row = 1; row <= 3; row++) {
      const bulkDensity = parseFloat(formData[`bulk_density_${row}`]) || 0;
      const moistureContent = parseFloat(formData[`moisture_content_${row}`]) || 0;
      
      if (bulkDensity > 0) {
        bulkDensitySum += bulkDensity;
        validBulkDensityCount++;
      }
      
      if (moistureContent > 0) {
        moistureContentSum += moistureContent;
        validMoistureContentCount++;
      }
    }
    
    const avgBulkDensity = validBulkDensityCount > 0 ? bulkDensitySum / validBulkDensityCount : 0;
    const avgMoistureContent = validMoistureContentCount > 0 ? moistureContentSum / validMoistureContentCount : 0;
    
    setFormData(prev => ({
      ...prev,
      avg_bulk_density: avgBulkDensity > 0 ? avgBulkDensity.toFixed(1) : '',
      avg_moisture_content: avgMoistureContent > 0 ? avgMoistureContent.toFixed(2) : ''
    }));
  };

  const fillRandomData = () => {
    if (window.confirm('This will fill all fields with sample data. Continue?')) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const randomData = {
        sample_description: 'Concrete aggregate sample for bulk density and moisture content testing - 20mm nominal size',
        date_of_receipt: today.toISOString().split('T')[0],
        customer_site_name: 'ABC Construction Site, Plot No. 123, Industrial Area, Mumbai - 400001',
        reference_number: 'REF-2024-001',
        date_of_manufacturer: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type_of_specimen: 'Coarse Aggregate 20mm',
        machine_used: 'Digital Balance - 10kg capacity',
        location_of_test: 'Laboratory',
        capacity_range: '0-10kg',
        test_method: 'IS 2386 (Part 3): 1963',
        sample_test_code: 'BD-2024-001',
        date_of_report: tomorrow.toISOString().split('T')[0],
        url_number: 'URL-2024-001',
        job_code_number: 'JOB-2024-001',
        manufacturer: 'ABC Quarry Ltd.',
        condition_of_specimen: 'Air dried',
        calibration_due_date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        environmental_conditions: 'Laboratory Conditions: 27°C ± 2°C, 65% ± 5% RH',
        tested_by_name: 'John Doe',
        checked_by_name: 'Jane Smith',
        remarks: 'Sample data filled for testing purposes. All measurements are approximate and should be replaced with actual test data.'
      };
      
      // Fill test results with random data
      for (let row = 1; row <= 3; row++) {
        randomData[`weight_before_${row}`] = (2.5 + Math.random() * 0.5).toFixed(3);
        randomData[`weight_after_${row}`] = (2.3 + Math.random() * 0.4).toFixed(3);
        randomData[`length_${row}`] = (200 + Math.random() * 5).toFixed(1);
        randomData[`breadth_${row}`] = (200 + Math.random() * 5).toFixed(1);
        randomData[`depth_${row}`] = (200 + Math.random() * 5).toFixed(1);
      }
      
      setFormData(prev => ({ ...prev, ...randomData }));
      
      // Trigger calculations
      setTimeout(() => {
        for (let row = 1; row <= 3; row++) {
          calculateVolume(row);
          calculateBulkDensity(row);
          calculateMoistureContent(row);
        }
      }, 100);
      
      alert('Random data filled successfully! Please review and modify as needed before submitting.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleConfirmSubmit = () => {
    console.log('Form submitted:', formData);
    
    // Create URL parameters from form data
    const params = new URLSearchParams();
    
    // General Information
    params.append('customer_name', formData.customer_name || '');
    params.append('site_name', formData.site_name || '');
    params.append('site_address', formData.site_address || '');
    params.append('reference_number', formData.reference_number || '');
    params.append('capacity_range', formData.capacity_range || '');
    params.append('test_method', formData.test_method || '');
    
    // Test Results
    for (let i = 1; i <= 3; i++) {
      params.append(`weight_before_${i}`, formData[`weight_before_${i}`] || '0.000');
      params.append(`weight_after_${i}`, formData[`weight_after_${i}`] || '0.000');
      params.append(`length_${i}`, formData[`length_${i}`] || '0.0');
      params.append(`breadth_${i}`, formData[`breadth_${i}`] || '0.0');
      params.append(`depth_${i}`, formData[`depth_${i}`] || '0.0');
      params.append(`volume_${i}`, formData[`volume_${i}`] || '0.000000');
      params.append(`bulk_density_${i}`, formData[`bulk_density_${i}`] || '0.0');
      params.append(`moisture_content_${i}`, formData[`moisture_content_${i}`] || '0.00');
    }
    
    // Customer Information
    params.append('customer_name', formData.customer_name || '');
    params.append('site_address', formData.site_address || '');
    params.append('ulr_number', formData.ulr_number || '');
    params.append('job_code_number', formData.job_code_number || '');
    params.append('reference_number', formData.reference_number || '');
    params.append('date_of_report', new Date().toISOString().split('T')[0]);
    params.append('date_of_material_receipt', formData.date_of_material_receipt || '');
    params.append('material_description', formData.material_description || '');
    params.append('condition_of_sample', formData.condition_of_sample || 'Acceptable');
    params.append('location_of_testing', formData.location_of_testing || 'Laboratory');
    
    // Authorization
    params.append('reviewed_by', formData.reviewed_by || 'Lalita S. Dussa - Quality Manager');
    params.append('authorized_by', formData.authorized_by || 'Prakarsh Sangave');
    
    // Build the report URL
    const reportUrl = `/BulkDensity/BulkDensityReport.html?${params.toString()}`;
    
    // Open the report in a new tab
    window.open(reportUrl, '_blank');
    
    setShowPreview(false);
  };

  const handleEditForm = () => {
    setShowPreview(false);
  };

  // Preview Form Component
  const PreviewForm = () => (
    <div>
            <div style={{ backgroundColor: '#28a745', padding: '2rem 0', borderRadius: '15px' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faWeightHanging} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />
                <div>
                  <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}>
                    Bulk Density & Moisture Content - Preview
                  </h1>
                  <p className="mb-0 mt-2" style={{ color: 'white' }}>
                    Review all details before final submission
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button onClick={handleEditForm} variant="light" className="btn-vitrag-primary me-2">
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
                    <p><strong>Customer/Site Address:</strong> {formData.customer_site_name}</p>
                    <p><strong>Reference Number:</strong> {formData.reference_number}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Date of Manufacturer:</strong> {formData.date_of_manufacturer}</p>
                    <p><strong>Type of Specimen:</strong> {formData.type_of_specimen}</p>
                    <p><strong>Machine Used:</strong> {formData.machine_used}</p>
                    <p><strong>Location of Test:</strong> {formData.location_of_test}</p>
                    <p><strong>Capacity Range:</strong> {formData.capacity_range}</p>
                    <p><strong>Test Method:</strong> {formData.test_method}</p>
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
                        <th>Weight Before (kg)</th>
                        <th>Weight After (kg)</th>
                        <th>Length (mm)</th>
                        <th>Breadth (mm)</th>
                        <th>Depth (mm)</th>
                        <th>Volume (m³)</th>
                        <th>Bulk Density (kg/m³)</th>
                        <th>Moisture Content (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((row) => (
                        <tr key={row}>
                          <td>{row}</td>
                          <td>{formData[`weight_before_${row}`]}</td>
                          <td>{formData[`weight_after_${row}`]}</td>
                          <td>{formData[`length_${row}`]}</td>
                          <td>{formData[`breadth_${row}`]}</td>
                          <td>{formData[`depth_${row}`]}</td>
                          <td>{formData[`volume_${row}`]}</td>
                          <td>{formData[`bulk_density_${row}`]}</td>
                          <td>{formData[`moisture_content_${row}`]}</td>
                        </tr>
                      ))}
                      <tr className="table-secondary">
                        <td colSpan="7" className="text-end fw-bold">Average</td>
                        <td className="text-center fw-bold">{formData.avg_bulk_density}</td>
                        <td className="text-center fw-bold">{formData.avg_moisture_content}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row>
          <Col className="text-center">
            <Button onClick={handleEditForm} variant="secondary" size="lg" className="me-3">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Edit Form
            </Button>
            <Button onClick={handleConfirmSubmit} variant="success" size="lg" className="me-3">
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Confirm & Save
            </Button>
            <Button as={Link} to="/other-services" variant="danger" size="lg" className="px-5">
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
            <div style={{ backgroundColor: '#28a745', padding: '2rem 0', borderRadius: '15px' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faWeightHanging} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />
                <div>
                  <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}>
                    Bulk Density and Moisture Content Testing
                  </h1>
                  <p className="mb-0 mt-2" style={{ color: 'white' }}>
                    Material density analysis and moisture content testing
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button as={Link} to="/other-services" variant="light" className="btn-vitrag-primary">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to Other Services
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Form onSubmit={handleSubmit}>
          {/* General Information */}
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
                        <Form.Select name="customer_id" value={formData.customer_id} onChange={handleInputChange} required>
                          <option value="">Select Customer</option>
                          <option value="1">ABC Construction Ltd.</option>
                          <option value="2">XYZ Builders</option>
                          <option value="3">DEF Infrastructure</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Sample Description *</Form.Label>
                        <Form.Control as="textarea" rows={3} name="sample_description" value={formData.sample_description} onChange={handleInputChange} placeholder="Describe the sample..." required />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Receipt *</Form.Label>
                        <Form.Control type="date" name="date_of_receipt" value={formData.date_of_receipt} onChange={handleInputChange} required />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Customer/Site Name & Address</Form.Label>
                        <Form.Control as="textarea" rows={3} name="customer_site_name" value={formData.customer_site_name} onChange={handleInputChange} placeholder="Enter customer/site name and address" />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Reference Number</Form.Label>
                        <Form.Control type="text" name="reference_number" value={formData.reference_number} onChange={handleInputChange} placeholder="Enter reference number" />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Manufacturer</Form.Label>
                        <Form.Control type="date" name="date_of_manufacturer" value={formData.date_of_manufacturer} onChange={handleInputChange} />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Type of Specimen</Form.Label>
                        <Form.Control type="text" name="type_of_specimen" value={formData.type_of_specimen} onChange={handleInputChange} placeholder="e.g., Concrete, Aggregate, etc." />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Machine used for Testing</Form.Label>
                        <Form.Control type="text" name="machine_used" value={formData.machine_used} onChange={handleInputChange} placeholder="e.g., Compression Testing Machine" />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Location of Test</Form.Label>
                        <Form.Control type="text" name="location_of_test" value={formData.location_of_test} onChange={handleInputChange} placeholder="e.g., Laboratory, Site, etc." />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Capacity/Range</Form.Label>
                        <Form.Control type="text" name="capacity_range" value={formData.capacity_range} onChange={handleInputChange} placeholder="e.g., 2000 kN, 0-100%" />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Test Method *</Form.Label>
                        <Form.Control type="text" name="test_method" value={formData.test_method} onChange={handleInputChange} required />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Test Details */}
          <Row className="mb-4">
            <Col>
              <Card className="card-vitrag shadow-sm">
                <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                  <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                    <FontAwesomeIcon icon={faFlask} className="me-2" />
                    Test Details
                  </h5>
                </Card.Header>
                <Card.Body className="transparent-input-section">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Sample Test Code Number *</Form.Label>
                        <Form.Control type="text" name="sample_test_code" value={formData.sample_test_code} onChange={handleInputChange} placeholder="e.g., SCN-2024001" required />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Testing *</Form.Label>
                        <Form.Control type="date" name="date_of_testing" value={formData.date_of_testing} onChange={handleInputChange} required />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Report</Form.Label>
                        <Form.Control type="date" name="date_of_report" value={formData.date_of_report} onChange={handleInputChange} />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>URL Number *</Form.Label>
                        <Form.Control type="text" name="url_number" value={formData.url_number} onChange={handleInputChange} placeholder="Enter URL number" required />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Job Code Number *</Form.Label>
                        <Form.Control type="text" name="job_code_number" value={formData.job_code_number} onChange={handleInputChange} placeholder="Enter job code number" required />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Manufacturer</Form.Label>
                        <Form.Control type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} placeholder="Enter manufacturer name" />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Condition of Specimen</Form.Label>
                        <Form.Control type="text" name="condition_of_specimen" value={formData.condition_of_specimen} onChange={handleInputChange} placeholder="e.g., Dry, Wet, Saturated" />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Calibration Due Date</Form.Label>
                        <Form.Control type="date" name="calibration_due_date" value={formData.calibration_due_date} onChange={handleInputChange} />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Environmental Conditions</Form.Label>
                        <Form.Control type="text" name="environmental_conditions" value={formData.environmental_conditions} onChange={handleInputChange} placeholder="e.g., Laboratory Conditions" />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Test Results Table */}
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
                          <th rowSpan="2" style={{ width: '50px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Sr. No.</th>
                          <th rowSpan="2" style={{ width: '140px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Weight of Sample before oven drying (kg)</th>
                          <th rowSpan="2" style={{ width: '140px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Weight of Sample after oven drying (kg)</th>
                          <th colSpan="3" style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '1rem' }}>Size of Sample</th>
                          <th rowSpan="2" style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Volume of Sample (m³)</th>
                          <th rowSpan="2" style={{ width: '120px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Bulk Density (kg/m³)</th>
                          <th rowSpan="2" style={{ width: '120px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Moisture Content (%)</th>
                        </tr>
                        <tr>
                          <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '0.9rem' }}>L (mm)</th>
                          <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '0.9rem' }}>B (mm)</th>
                          <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '0.9rem' }}>D (mm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((row) => (
                          <tr key={row}>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{row}</td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control size="sm" type="number" step="0.001" name={`weight_before_${row}`} value={formData[`weight_before_${row}`]} onChange={(e) => { handleInputChange(e); setTimeout(() => calculateMoistureContent(row), 0); }} style={{ fontSize: '0.8rem' }} />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control size="sm" type="number" step="0.001" name={`weight_after_${row}`} value={formData[`weight_after_${row}`]} onChange={(e) => { handleInputChange(e); setTimeout(() => { calculateBulkDensity(row); calculateMoistureContent(row); }, 0); }} style={{ fontSize: '0.8rem' }} />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control size="sm" type="number" step="0.1" name={`length_${row}`} value={formData[`length_${row}`]} onChange={(e) => { handleInputChange(e); setTimeout(() => calculateVolume(row), 0); }} style={{ fontSize: '0.8rem', textAlign: 'center' }} />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control size="sm" type="number" step="0.1" name={`breadth_${row}`} value={formData[`breadth_${row}`]} onChange={(e) => { handleInputChange(e); setTimeout(() => calculateVolume(row), 0); }} style={{ fontSize: '0.8rem', textAlign: 'center' }} />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control size="sm" type="number" step="0.1" name={`depth_${row}`} value={formData[`depth_${row}`]} onChange={(e) => { handleInputChange(e); setTimeout(() => calculateVolume(row), 0); }} style={{ fontSize: '0.8rem', textAlign: 'center' }} />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control size="sm" type="number" step="0.000001" name={`volume_${row}`} value={formData[`volume_${row}`]} readOnly style={{ fontSize: '0.8rem', textAlign: 'center' }} />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control size="sm" type="number" step="0.1" name={`bulk_density_${row}`} value={formData[`bulk_density_${row}`]} readOnly style={{ fontSize: '0.8rem', textAlign: 'center' }} />
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                              <Form.Control size="sm" type="number" step="0.01" name={`moisture_content_${row}`} value={formData[`moisture_content_${row}`]} readOnly style={{ fontSize: '0.8rem', textAlign: 'center' }} />
                            </td>
                          </tr>
                        ))}
                        <tr className="table-info">
                          <td colSpan="7" className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', fontSize: '1.1rem' }}>Average</td>
                          <td className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}>
                            <Form.Control 
                              size="sm" 
                              type="number" 
                              step="0.1" 
                              name="avg_bulk_density" 
                              value={formData.avg_bulk_density} 
                              readOnly 
                              className="average-input-transparent"
                              style={{ 
                                fontSize: '0.8rem', 
                                textAlign: 'center',
                                backgroundColor: 'var(--bs-dark)',
                                background: 'var(--bs-dark)',
                                backgroundImage: 'none',
                                border: '1px solid var(--bs-gray-700)',
                                color: '#ffffff',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                appearance: 'none',
                                boxShadow: 'none',
                                outline: 'none'
                              }} 
                            />
                          </td>
                          <td className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}>
                            <Form.Control 
                              size="sm" 
                              type="number" 
                              step="0.01" 
                              name="avg_moisture_content" 
                              value={formData.avg_moisture_content} 
                              readOnly 
                              className="average-input-transparent"
                              style={{ 
                                fontSize: '0.8rem', 
                                textAlign: 'center',
                                backgroundColor: 'var(--bs-dark)',
                                background: 'var(--bs-dark)',
                                backgroundImage: 'none',
                                border: '1px solid var(--bs-gray-700)',
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

          {/* Verification */}
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
                        <Form.Control type="text" name="tested_by_name" value={formData.tested_by_name} onChange={handleInputChange} placeholder="Enter tester name" required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date *</Form.Label>
                        <Form.Control type="date" name="tested_by_date" value={formData.tested_by_date} onChange={handleInputChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <h6>Checked By</h6>
                      <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control type="text" name="checked_by_name" value={formData.checked_by_name} onChange={handleInputChange} placeholder="Enter checker name" required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date *</Form.Label>
                        <Form.Control type="date" name="checked_by_date" value={formData.checked_by_date} onChange={handleInputChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <h6>Verified By</h6>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="verified_by_name" value={formData.verified_by_name} readOnly style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: '#495057', opacity: 0.9 }} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date *</Form.Label>
                        <Form.Control type="date" name="verified_by_date" value={formData.verified_by_date} onChange={handleInputChange} required />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Remarks */}
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
                    <Form.Control as="textarea" rows={4} name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="Enter any additional remarks or observations..." />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Review & Authorization */}
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
                    <Form.Select name="reviewed_by" value={formData.reviewed_by} onChange={handleInputChange} required>
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
                    <Form.Control type="text" name="authorized_by" value={formData.authorized_by} readOnly style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: '#495057', opacity: 0.9 }} />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Action Buttons */}
          <Row>
            <Col className="text-center">
              <Button type="button" variant="info" size="lg" className="me-3" onClick={fillRandomData}>
                <FontAwesomeIcon icon={faMagic} className="me-2" />
                Fill Random Data
              </Button>
              <Button type="submit" variant="primary" size="lg" className="me-3">
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Save Test Data
              </Button>
              <Button as={Link} to="/other-services" variant="secondary" size="lg" className="px-5">
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

export default BulkDensityMoistureForm;
