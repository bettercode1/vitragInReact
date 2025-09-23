import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountain, faArrowLeft, faSave, faCalculator, faInfoCircle, faUserCheck, faComment, faUserShield, faTable } from '@fortawesome/free-solid-svg-icons';

const FineAggregateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentForm, setCurrentForm] = useState(1);
  const [selectedTests, setSelectedTests] = useState([]);

  // Handle selected tests from popup
  useEffect(() => {
    if (location.state && location.state.selectedTests) {
      setSelectedTests(location.state.selectedTests);
      // Set current form to first available test
      if (location.state.selectedTests.includes('bulkDensity')) {
        setCurrentForm(1);
      } else if (location.state.selectedTests.includes('sieveAnalysis')) {
        setCurrentForm(2);
      } else if (location.state.selectedTests.includes('specificGravity')) {
        setCurrentForm(3);
      }
    } else {
      // Default to all tests if no selection made
      setSelectedTests(['bulkDensity', 'sieveAnalysis', 'specificGravity']);
      setCurrentForm(1);
    }
  }, [location.state]);

  // Add CSS styles to match reference template
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .auto-calculated {
        background-color: #f8f9fa !important;
        color: #6c757d !important;
        cursor: not-allowed !important;
      }
      
      .auto-calculated:focus {
        box-shadow: none !important;
        border-color: #ced4da !important;
      }
      
      .loose-weight-input {
        background-color: white !important;
        color: #000 !important;
        cursor: text !important;
        pointer-events: auto !important;
      }
      
      .loose-weight-input:focus {
        background-color: white !important;
        border-color: #007bff !important;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
      }
      
      .table td,
      .table td *,
      .table input,
      .table strong,
      .table .form-control {
        text-align: center !important;
        vertical-align: middle !important;
      }
      
      .table td.left-align-text {
        text-align: left !important;
      }
      
      .table td.left-align-text strong {
        text-align: left !important;
      }
      
      .table th,
      .table th * {
        text-align: center !important;
        vertical-align: middle !important;
      }
      
      .fine-aggregate-header {
        background-color: #17a2b8 !important;
        color: white !important;
        border-radius: 15px !important;
      }
      
      .fine-aggregate-header .card-body {
        background-color: #17a2b8 !important;
        color: white !important;
        border-radius: 15px !important;
      }
      
      .fine-aggregate-header h1,
      .fine-aggregate-header p {
        color: white !important;
      }
      
      .step-navigation .btn-outline-primary {
        border: 2px solid #17a2b8 !important;
        background-color: transparent !important;
        color: #17a2b8 !important;
      }
      
      .step-navigation .btn-outline-primary:hover {
        border: 2px solid #17a2b8 !important;
        background-color: rgba(23, 162, 184, 0.1) !important;
        color: #17a2b8 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [formData, setFormData] = useState({
    // General Information
    customer_id: '',
    sample_description: '',
    date_of_receipt: new Date().toISOString().split('T')[0],
    date_of_testing: new Date().toISOString().split('T')[0],
    sample_test_code: '',
    url_number: '',
    job_code_number: '',
    reference_number: '',
    type_size_aggregate: '',
    test_method: '',
    condition_of_aggregate: '',
    environmental_conditions: '',
    proposed_use: '',
    source: '',
    type_of_aggregate: '',
    max_nominal_size: '',
    
    // Form 1 - Bulk Density
    volume_01: '',
    volume_02: '',
    volume_03: '',
    rodded_weight_01: '',
    rodded_weight_02: '',
    rodded_weight_03: '',
    loose_weight_01: '',
    loose_weight_02: '',
    loose_weight_03: '',
    
    // Form 2 - Sieve Analysis
    total_weight: '',
    sieve_data: {},
    
    // Form 3 - Specific Gravity
    specific_gravity_data: {},
    
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
    
    // Auto-calculate bulk density if it's form 1
    if (currentForm === 1) {
      calculateBulkDensity(name, value);
    }
  };

  // Auto-calculation functions matching reference template

  const calculateMeanValues = () => {
    // Calculate mean rodded bulk density
    const roddedValues = [
      parseFloat(formData.rodded_density_01) || 0,
      parseFloat(formData.rodded_density_02) || 0,
      parseFloat(formData.rodded_density_03) || 0
    ].filter(val => val > 0);
    
    if (roddedValues.length > 0) {
      const meanRodded = roddedValues.reduce((sum, val) => sum + val, 0) / roddedValues.length;
      setFormData(prev => ({
        ...prev,
        mean_rodded_density: meanRodded.toFixed(3)
      }));
    }
    
    // Calculate mean loose bulk density
    const looseValues = [
      parseFloat(formData.loose_density_01) || 0,
      parseFloat(formData.loose_density_02) || 0,
      parseFloat(formData.loose_density_03) || 0
    ].filter(val => val > 0);
    
    if (looseValues.length > 0) {
      const meanLoose = looseValues.reduce((sum, val) => sum + val, 0) / looseValues.length;
      setFormData(prev => ({
        ...prev,
        mean_loose_density: meanLoose.toFixed(3)
      }));
    }
  };

  const calculateBulkDensity = (fieldName, value) => {
    if (fieldName.includes('volume_') || fieldName.includes('rodded_weight_') || fieldName.includes('loose_weight_')) {
      const testNum = fieldName.split('_')[1];
      const volume = parseFloat(formData[`volume_${testNum}`] || 0);
      const roddedWeight = parseFloat(formData[`rodded_weight_${testNum}`] || 0);
      const looseWeight = parseFloat(formData[`loose_weight_${testNum}`] || 0);
      
      if (volume > 0) {
        if (roddedWeight > 0) {
          const roddedDensity = roddedWeight / volume;
          setFormData(prev => ({
            ...prev,
            [`rodded_density_${testNum}`]: roddedDensity.toFixed(3)
          }));
        }
        
        if (looseWeight > 0) {
          const looseDensity = looseWeight / volume;
          setFormData(prev => ({
            ...prev,
            [`loose_density_${testNum}`]: looseDensity.toFixed(3)
          }));
        }
      }
    }
  };

  const renderForm1 = () => (
    <div>
      {/* General Information */}
      <Row className="mb-4">
        <Col>
          <Card className="card-vitrag">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faInfoCircle} className="me-2" />General Information</h4>
            </Card.Header>
            <Card.Body className="transparent-input-section">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Customer Name *</Form.Label>
                    <Form.Select name="customer_id" value={formData.customer_id} onChange={handleInputChange} className="form-control-vitrag" required>
                      <option value="">-- Select Customer --</option>
                      <option value="1">Sample Customer 1</option>
                      <option value="2">Sample Customer 2</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Description *</Form.Label>
                    <Form.Control as="textarea" rows={3} name="sample_description" value={formData.sample_description} onChange={handleInputChange} className="form-control-vitrag" placeholder="" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Receipt *</Form.Label>
                    <Form.Control type="date" name="date_of_receipt" value={formData.date_of_receipt} onChange={handleInputChange} className="form-control-vitrag" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Type & Size of Aggregate *</Form.Label>
                    <Form.Control type="text" name="type_size_aggregate" value={formData.type_size_aggregate} onChange={handleInputChange} className="form-control-vitrag" placeholder="" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Test Method *</Form.Label>
                    <Form.Select name="test_method" value={formData.test_method} onChange={handleInputChange} className="form-control-vitrag" required>
                      <option value="">-- Select Test Method --</option>
                      <option value="IS 2386 (Part III) - 1963">IS 2386 (Part III) - 1963</option>
                      <option value="ASTM C29/C29M">ASTM C29/C29M</option>
                      <option value="BS 812-2:1995">BS 812-2:1995</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Test Code Number *</Form.Label>
                    <Form.Control type="text" name="sample_test_code" value={formData.sample_test_code} onChange={handleInputChange} className="form-control-vitrag" placeholder="" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Testing *</Form.Label>
                    <Form.Control type="date" name="date_of_testing" value={formData.date_of_testing} onChange={handleInputChange} className="form-control-vitrag" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Condition of Aggregate *</Form.Label>
                    <Form.Select name="condition_of_aggregate" value={formData.condition_of_aggregate} onChange={handleInputChange} className="form-control-vitrag" required>
                      <option value="">-- Select Condition --</option>
                      <option value="Dry">Dry</option>
                      <option value="Saturated Surface Dry (SSD)">Saturated Surface Dry (SSD)</option>
                      <option value="Wet">Wet</option>
                      <option value="Air Dried">Air Dried</option>
                      <option value="Oven Dried">Oven Dried</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Environmental Conditions</Form.Label>
                    <Form.Control type="text" name="environmental_conditions" value={formData.environmental_conditions} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Test Report Details */}
      <Row className="mb-4">
        <Col>
          <Card className="card-vitrag">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faTable} className="me-2" />Test Report Details</h4>
            </Card.Header>
            <Card.Body className="transparent-input-section">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Report</Form.Label>
                    <Form.Control type="date" name="date_of_report" value={formData.date_of_report} onChange={handleInputChange} className="form-control-vitrag" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Reference Number</Form.Label>
                    <Form.Control type="text" name="reference_number" value={formData.reference_number} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Material Receipt</Form.Label>
                    <Form.Control type="date" name="date_of_material_receipt" value={formData.date_of_material_receipt} onChange={handleInputChange} className="form-control-vitrag" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Material Description</Form.Label>
                    <Form.Control as="textarea" rows={2} name="material_description" value={formData.material_description} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Location of Testing</Form.Label>
                    <Form.Control type="text" name="location_of_testing" value={formData.location_of_testing} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ULR Number *</Form.Label>
                    <Form.Control type="text" name="url_number" value={formData.url_number} onChange={handleInputChange} className="form-control-vitrag" placeholder="" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Job Code Number *</Form.Label>
                    <Form.Control type="text" name="job_code_number" value={formData.job_code_number} onChange={handleInputChange} className="form-control-vitrag" placeholder="" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Period of Testing</Form.Label>
                    <Form.Control type="text" name="period_of_testing" value={formData.period_of_testing} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Condition of Sample</Form.Label>
                    <Form.Select name="condition_of_sample" value={formData.condition_of_sample} onChange={handleInputChange} className="form-control-vitrag">
                      <option value="">-- Select Condition --</option>
                      <option value="As Received">As Received</option>
                      <option value="Processed">Processed</option>
                      <option value="Prepared">Prepared</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Test Result */}
      <Row className="mb-4" style={{ border: 'none !important', outline: 'none !important' }}>
        <Col style={{ border: 'none !important', outline: 'none !important' }}>
          <div style={{ border: 'none !important', boxShadow: 'none !important', background: 'transparent !important', outline: 'none !important', margin: '0 !important', padding: '0 !important' }}>
            <div style={{ border: 'none !important', background: 'transparent !important', padding: '10px 0', outline: 'none !important' }}>
              <h5 className="mb-0"><FontAwesomeIcon icon={faTable} className="me-2" />Test Result</h5>
            </div>
            <div style={{ border: 'none !important', padding: '8px', background: 'transparent !important', outline: 'none !important' }}>
              <div className="table-responsive">
                <table className="table transparent-table" style={{ fontSize: '1.1rem', marginBottom: 0, tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '550px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1.3rem' }}>Number of Tests</th>
                      <th style={{ width: '140px', padding: '4px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid #dee2e6', fontSize: '1.3rem' }}>01</th>
                      <th style={{ width: '140px', padding: '4px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid #dee2e6', fontSize: '1.3rem' }}>02</th>
                      <th style={{ width: '140px', padding: '4px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid #dee2e6', fontSize: '1.3rem' }}>03</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', paddingLeft: '12px', border: '1px solid #dee2e6' }}><strong>Volume of measure cylinder used for determination of bulk density (lit.)</strong></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }}><Form.Control type="number" step="0.01" name="volume_01" value={formData.volume_01} onChange={handleInputChange} className="form-control-vitrag" style={{ height: '30px' }} /></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }}><Form.Control type="number" step="0.01" name="volume_02" value={formData.volume_02} onChange={handleInputChange} className="form-control-vitrag" style={{ height: '30px' }} /></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }} className="text-center"><Form.Control type="number" step="0.01" name="volume_03" value={formData.volume_03} onChange={handleInputChange} className="form-control-vitrag" style={{ height: '30px' }} /></td>
                    </tr>
                    <tr>
                      <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', paddingLeft: '12px', border: '1px solid #dee2e6' }}><strong>Net weight of Rodded Sample in the measure cylinder (kg)</strong></td>
                      <td style={{ width: '60px', padding: '4px', border: '1px solid #dee2e6' }}><Form.Control type="number" step="0.001" name="rodded_weight_01" value={formData.rodded_weight_01} onChange={handleInputChange} className="form-control-vitrag" style={{ height: '30px' }} /></td>
                      <td style={{ width: '60px', padding: '4px', border: '1px solid #dee2e6' }}><Form.Control type="number" step="0.001" name="rodded_weight_02" value={formData.rodded_weight_02} onChange={handleInputChange} className="form-control-vitrag" style={{ height: '30px' }} /></td>
                      <td style={{ width: '60px', padding: '4px', border: '1px solid #dee2e6' }} className="text-center"><Form.Control type="number" step="0.001" name="rodded_weight_03" value={formData.rodded_weight_03} onChange={handleInputChange} className="form-control-vitrag" style={{ height: '30px' }} /></td>
                    </tr>
                    <tr>
                      <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', paddingLeft: '12px', border: '1px solid #dee2e6' }}><strong>Rodded Bulk Density (kg/lit.)</strong></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }}><Form.Control type="number" step="0.001" value={formData.rodded_density_01 || ''} readOnly style={{ height: '30px', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }}><Form.Control type="number" step="0.001" value={formData.rodded_density_02 || ''} readOnly style={{ height: '30px', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }} className="text-center"><Form.Control type="number" step="0.001" value={formData.rodded_density_03 || ''} readOnly style={{ height: '30px', backgroundColor: '#f8f9fa' }} /></td>
                    </tr>
                    <tr className="table-info">
                      <td style={{ fontSize: '1rem', padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}><strong>Mean Rodded Bulk Density (kg/lit.)</strong></td>
                      <td colSpan="3" style={{ padding: '6px', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}><Form.Control type="number" step="0.001" value={formData.mean_rodded_density || ''} readOnly className="average-input-transparent" style={{ height: '30px', backgroundColor: 'var(--bs-dark)', background: 'var(--bs-dark)', backgroundImage: 'none', border: '1px solid var(--bs-gray-700)', color: '#ffffff', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', boxShadow: 'none', outline: 'none' }} /></td>
                    </tr>
                    <tr>
                      <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', paddingLeft: '12px', border: '1px solid #dee2e6' }}><strong>Net weight of Loose Sample in the measure cylinder (kg)</strong></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }}><Form.Control type="number" step="0.001" name="loose_weight_01" value={formData.loose_weight_01} onChange={handleInputChange} className="form-control-vitrag" style={{ height: '30px' }} /></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }}><Form.Control type="number" step="0.001" name="loose_weight_02" value={formData.loose_weight_02} onChange={handleInputChange} className="form-control-vitrag" style={{ height: '30px' }} /></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }} className="text-center"><Form.Control type="number" step="0.001" name="loose_weight_03" value={formData.loose_weight_03} onChange={handleInputChange} className="form-control-vitrag" style={{ height: '30px' }} /></td>
                    </tr>
                    <tr>
                      <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', paddingLeft: '12px', border: '1px solid #dee2e6' }}><strong>Loose Bulk Density (kg/lit.)</strong></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }}><Form.Control type="number" step="0.001" value={formData.loose_density_01 || ''} readOnly style={{ height: '30px', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }}><Form.Control type="number" step="0.001" value={formData.loose_density_02 || ''} readOnly style={{ height: '30px', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ width: '140px', padding: '4px', border: '1px solid #dee2e6' }} className="text-center"><Form.Control type="number" step="0.001" value={formData.loose_density_03 || ''} readOnly style={{ height: '30px', backgroundColor: '#f8f9fa' }} /></td>
                    </tr>
                    <tr className="table-info">
                      <td style={{ fontSize: '1rem', padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}><strong>Mean Loose Bulk Density (kg/lit.)</strong></td>
                      <td colSpan="3" style={{ padding: '6px', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}><Form.Control type="number" step="0.001" value={formData.mean_loose_density || ''} readOnly className="average-input-transparent" style={{ height: '30px', backgroundColor: 'var(--bs-dark)', background: 'var(--bs-dark)', backgroundImage: 'none', border: '1px solid var(--bs-gray-700)', color: '#ffffff', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', boxShadow: 'none', outline: 'none' }} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );

  const renderForm2 = () => (
    <div>
      {/* General Information Section */}
      <Row className="mb-4">
        <Col>
          <Card className="card-vitrag">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faInfoCircle} className="me-2" />General Information</h4>
            </Card.Header>
            <Card.Body className="transparent-input-section">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Description <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      name="sample_description" 
                      value={formData.sample_description} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      placeholder="" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Receipt <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="date" 
                      name="date_of_receipt" 
                      value={formData.date_of_receipt} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Proposed Use <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      name="proposed_use" 
                      value={formData.proposed_use} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      required
                    >
                      <option value="">-- Select Proposed Use --</option>
                      <option value="Concrete">Concrete</option>
                      <option value="Mortar">Mortar</option>
                      <option value="Plaster">Plaster</option>
                      <option value="Road Construction">Road Construction</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Test Method <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      name="test_method" 
                      value={formData.test_method} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      required
                    >
                      <option value="">-- Select Test Method --</option>
                      <option value="IS 2386 (Part I) - 1963">IS 2386 (Part I) - 1963</option>
                      <option value="ASTM C136/C136M">ASTM C136/C136M</option>
                      <option value="BS 812-103.1:1985">BS 812-103.1:1985</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Test Code Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      name="sample_test_code" 
                      value={formData.sample_test_code} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      placeholder="" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Testing <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="date" 
                      name="date_of_testing" 
                      value={formData.date_of_testing} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Source <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      name="source" 
                      value={formData.source} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      placeholder="" 
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
                      className="form-control-vitrag" 
                      placeholder="" 
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Test Result Section */}
      <Row className="mb-4">
        <Col>
          <div style={{ padding: '10px 0' }}>
            <h5 className="mb-0"><FontAwesomeIcon icon={faTable} className="me-2" />Test Result</h5>
          </div>
          
          {/* Total Weight Input */}
              <Row className="justify-content-center mb-4">
                <Col md={8}>
                  <div className="input-group justify-content-center" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <span className="input-group-text" style={{ fontWeight: 'bold', backgroundColor: '#495057', color: 'white' }}>
                      Total Weight of Sample taken =
                    </span>
                <Form.Control 
                  type="number" 
                  step="0.01" 
                  placeholder="" 
                  name="total_weight" 
                  value={formData.total_weight} 
                  onChange={handleInputChange} 
                  className="form-control-vitrag"
                />
                    <span className="input-group-text" style={{ backgroundColor: '#495057', color: 'white' }}>gm</span>
                  </div>
                </Col>
              </Row>
              
          {/* Main Data Table */}
              <div className="table-responsive">
            <table className="table transparent-table" style={{ fontSize: '0.9rem', tableLayout: 'auto', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                  <thead className="table-dark">
                    <tr>
                  <th rowSpan="2" style={{ width: '75px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>IS Sieve</th>
                  <th rowSpan="2" style={{ width: '75px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Weigh. Retained (gm)</th>
                  <th rowSpan="2" style={{ width: '75px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>% Weight Retained</th>
                  <th rowSpan="2" style={{ width: '85px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Cumulative % Weight Retained</th>
                  <th rowSpan="2" style={{ width: '55px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>% Passing</th>
                  <th colSpan="4" style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '1rem' }}>Zoning as per Table 9 of IS 383</th>
                    </tr>
                    <tr>
                  <th style={{ width: '65px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '0.9rem' }}>Zone I</th>
                  <th style={{ width: '65px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '0.9rem' }}>Zone II</th>
                  <th style={{ width: '65px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '0.9rem' }}>Zone III</th>
                  <th style={{ width: '65px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '0.9rem' }}>Zone IV</th>
                    </tr>
                  </thead>
                  <tbody>
                {[
                  { sieve: '10 mm', zones: ['100', '100', '100', '100'] },
                  { sieve: '4.75 mm', zones: ['90-100', '90-100', '90-100', '95-100'] },
                  { sieve: '2.36 mm', zones: ['60-95', '75-100', '85-100', '95-100'] },
                  { sieve: '1.18 mm', zones: ['30-70', '55-90', '75-100', '90-100'] },
                  { sieve: '600 mic.', zones: ['15-34', '35-59', '60-79', '80-100'] },
                  { sieve: '300 mic.', zones: ['5-20', '8-30', '12-40', '15-50'] },
                  { sieve: '75 mic.', zones: ['---', '---', '---', '---'] },
                  { sieve: 'Pan', zones: ['---', '---', '---', '---'] }
                ].map((row, index) => (
                      <tr key={index}>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{row.sieve}</td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control 
                        type="number" 
                        step="0.01" 
                        className="form-control form-control-sm" 
                        style={{ height: '25px', border: 'none', textAlign: 'center' }}
                      />
                        </td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control 
                        type="number" 
                        step="0.01" 
                        className="form-control form-control-sm" 
                        style={{ height: '25px', border: 'none', textAlign: 'center' }}
                      />
                        </td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control 
                        type="number" 
                        step="0.01" 
                        className="form-control form-control-sm" 
                        style={{ height: '25px', border: 'none', textAlign: 'center' }}
                      />
                        </td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control 
                        type="number" 
                        step="0.01" 
                        className="form-control form-control-sm" 
                        style={{ height: '25px', border: 'none', textAlign: 'center' }}
                      />
                        </td>
                    {row.zones.map((zone, zoneIndex) => (
                      <td key={zoneIndex} style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                        {zone}
                      </td>
                    ))}
                      </tr>
                    ))}
                
                {/* Calculation Rows */}
                <tr>
                  <td colSpan="5" style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'left', verticalAlign: 'middle' }}>
                    Sum of Cumulative % Weight Retained (Excluding Pan) =
                  </td>
                  <td colSpan="4" style={{ padding: '8px', border: '1px solid #dee2e6' }}></td>
                </tr>
                <tr>
                  <td colSpan="5" style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'left', verticalAlign: 'middle' }}>
                    Fineness Modulus = (Sum of Cumulative % weight retained/100) =
                  </td>
                  <td colSpan="4" style={{ padding: '8px', border: '1px solid #dee2e6' }}></td>
                </tr>
                <tr>
                  <td colSpan="5" style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'left', verticalAlign: 'middle' }}>
                    Zone to which Fine Aggregate belongs as per IS 383 =
                  </td>
                  <td colSpan="4" style={{ padding: '8px', border: '1px solid #dee2e6' }}></td>
                </tr>
                  </tbody>
                </table>
              </div>
        </Col>
      </Row>
    </div>
  );

  const renderForm3 = () => (
    <div>
      {/* General Information Section */}
      <Row className="mb-4">
        <Col>
          <Card className="card-vitrag">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faInfoCircle} className="me-2" />General Information</h4>
            </Card.Header>
            <Card.Body className="transparent-input-section">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Description <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      name="sample_description" 
                      value={formData.sample_description} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      placeholder="" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Receipt <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="date" 
                      name="date_of_receipt" 
                      value={formData.date_of_receipt} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Type of Aggregate <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      name="type_of_aggregate" 
                      value={formData.type_of_aggregate} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      required
                    >
                      <option value="">-- Select Type of Aggregate --</option>
                      <option value="Fine Aggregate">Fine Aggregate</option>
                      <option value="Coarse Aggregate">Coarse Aggregate</option>
                      <option value="All-in Aggregate">All-in Aggregate</option>
                      <option value="Natural Sand">Natural Sand</option>
                      <option value="Crushed Sand">Crushed Sand</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Test Method <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      name="test_method" 
                      value={formData.test_method} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      required
                    >
                      <option value="">-- Select Test Method --</option>
                      <option value="IS 2386 (Part III) - 1963">IS 2386 (Part III) - 1963</option>
                      <option value="ASTM C29/C29M">ASTM C29/C29M</option>
                      <option value="BS 812-2:1995">BS 812-2:1995</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Test Code Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      name="sample_test_code" 
                      value={formData.sample_test_code} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      placeholder="" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Testing <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="date" 
                      name="date_of_testing" 
                      value={formData.date_of_testing} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Maximum Nominal Size of Aggregate <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      name="max_nominal_size" 
                      value={formData.max_nominal_size} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      required
                    >
                      <option value="">-- Select Maximum Size --</option>
                      <option value="4.75mm">4.75mm</option>
                      <option value="10mm">10mm</option>
                      <option value="12.5mm">12.5mm</option>
                      <option value="16mm">16mm</option>
                      <option value="20mm">20mm</option>
                      <option value="25mm">25mm</option>
                      <option value="31.5mm">31.5mm</option>
                      <option value="40mm">40mm</option>
                      <option value="50mm">50mm</option>
                      <option value="63mm">63mm</option>
                      <option value="80mm">80mm</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Environmental Conditions</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="environmental_conditions" 
                      value={formData.environmental_conditions} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      placeholder="" 
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Test Result Section */}
      <Row className="mb-4">
        <Col>
          <div style={{ padding: '10px 0' }}>
            <h5 className="mb-0"><FontAwesomeIcon icon={faTable} className="me-2" />Test Result</h5>
          </div>
          
          {/* Main Data Table */}
              <div className="table-responsive">
            <table className="table transparent-table" style={{ fontSize: '1.1rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                  <thead className="table-dark">
                    <tr>
                  <th style={{ width: '550px', padding: '6px', textAlign: 'left', verticalAlign: 'middle', fontSize: '1.3rem', border: '1px solid #dee2e6' }}>Number of Tests</th>
                  <th style={{ width: '140px', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontSize: '1.3rem', border: '1px solid #dee2e6' }}>01</th>
                  <th style={{ width: '140px', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontSize: '1.3rem', border: '1px solid #dee2e6' }}>02</th>
                  <th style={{ width: '140px', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontSize: '1.3rem', border: '1px solid #dee2e6' }}>03</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                  <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', border: '1px solid #dee2e6' }}>
                    <strong>Wt. of Saturated Surface Dry Aggregate (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(A)</span></strong>
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                    </tr>
                    <tr>
                  <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', border: '1px solid #dee2e6' }}>
                    <strong>Wt. of Pycnometer + Aggregate + Water (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(B)</span></strong>
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                    </tr>
                    <tr>
                  <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', border: '1px solid #dee2e6' }}>
                    <strong>Wt. of Pycnometer + Water (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(C)</span></strong>
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                    </tr>
                    <tr>
                  <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', border: '1px solid #dee2e6' }}>
                    <strong>Wt. of Oven Dried Aggregate (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(D)</span></strong>
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                    </tr>
                    <tr>
                  <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', border: '1px solid #dee2e6' }}>
                    <strong>Specific Gravity = [D/A-(B-C)]</strong>
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.001" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.001" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.001" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                    </tr>
                    <tr className="table-info">
                  <td style={{ fontSize: '1rem', padding: '6px', border: '1px solid #dee2e6' }}>
                    <strong>Mean of Specific Gravity</strong>
                  </td>
                  <td colSpan="3" style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}>
                    <Form.Control 
                      type="number" 
                      step="0.001" 
                      className="form-control form-control-sm average-input-transparent" 
                      style={{ height: '30px', backgroundColor: 'var(--bs-dark)', background: 'var(--bs-dark)', backgroundImage: 'none', border: '1px solid var(--bs-gray-700)', color: '#ffffff', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', boxShadow: 'none', outline: 'none' }}
                    />
                  </td>
                    </tr>
                    <tr>
                  <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', border: '1px solid #dee2e6' }}>
                    <strong>Water Absorption (%)= [(A-D)/D]*100</strong>
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                  <td style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm" 
                      style={{ height: '30px' }}
                    />
                  </td>
                    </tr>
                    <tr className="table-info">
                  <td style={{ fontSize: '1rem', padding: '6px', border: '1px solid #dee2e6' }}>
                    <strong>Mean of Water Absorption</strong>
                  </td>
                  <td colSpan="3" style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      className="form-control form-control-sm average-input-transparent" 
                      style={{ height: '30px', backgroundColor: 'var(--bs-dark)', background: 'var(--bs-dark)', backgroundImage: 'none', border: '1px solid var(--bs-gray-700)', color: '#ffffff', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', boxShadow: 'none', outline: 'none' }}
                    />
                  </td>
                    </tr>
                  </tbody>
                </table>
              </div>
        </Col>
      </Row>
    </div>
  );

  const renderVerification = () => (
    <Row className="mb-4">
      <Col>
        <Card className="card-vitrag">
          <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
            <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faUserCheck} className="me-2" />Verification</h4>
          </Card.Header>
          <Card.Body className="transparent-input-section">
              <Row>
              <Col md={4}>
                <h6>Tested By</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control type="text" name="tested_by_name" value={formData.tested_by_name} onChange={handleInputChange} className="form-control-vitrag" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control type="date" name="tested_by_date" value={formData.tested_by_date} onChange={handleInputChange} className="form-control-vitrag" required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <h6>Checked By</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control type="text" name="checked_by_name" value={formData.checked_by_name} onChange={handleInputChange} className="form-control-vitrag" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control type="date" name="checked_by_date" value={formData.checked_by_date} onChange={handleInputChange} className="form-control-vitrag" required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <h6>Verified By</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="verified_by_name" value={formData.verified_by_name} readOnly className="form-control-vitrag" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: '#495057', opacity: 0.9 }} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control type="date" name="verified_by_date" value={formData.verified_by_date} onChange={handleInputChange} className="form-control-vitrag" required />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderRemarks = () => (
    <Row className="mb-4">
      <Col>
        <Card className="card-vitrag">
          <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
            <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faComment} className="me-2" />Remarks</h4>
          </Card.Header>
          <Card.Body className="transparent-input-section">
            <Form.Control as="textarea" rows={4} name="remarks" value={formData.remarks} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderReviewedBy = () => (
    <Row className="mb-4">
      <Col md={6}>
        <Card className="card-vitrag">
          <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
            <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faUserCheck} className="me-2" />Reviewed By</h4>
          </Card.Header>
          <Card.Body className="transparent-input-section">
            <Form.Group className="mb-3">
              <Form.Label>Select Reviewer:</Form.Label>
              <Form.Select name="reviewed_by" value={formData.reviewed_by} onChange={handleInputChange} className="form-control-vitrag" required>
                <option value="">-- Select a reviewer --</option>
                <option value="Lalita S. Dussa - Quality Manager" selected>Lalita S. Dussa - Quality Manager</option>
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
        <Card className="card-vitrag">
          <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
            <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faUserShield} className="me-2" />Authorized By</h4>
          </Card.Header>
          <Card.Body className="transparent-input-section">
            <Form.Group className="mb-3">
              <Form.Label>Authorized By:</Form.Label>
              <Form.Control type="text" name="authorized_by" value={formData.authorized_by} readOnly className="form-control-vitrag" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: '#495057', opacity: 0.9 }} />
            </Form.Group>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="fine-aggregate-header" style={{ backgroundColor: '#17a2b8 !important', color: 'white !important', border: 'none', borderRadius: '15px' }}>
            <Card.Body className="fine-aggregate-header" style={{ backgroundColor: '#17a2b8 !important', color: 'white !important' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}><FontAwesomeIcon icon={faMountain} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />Fine Aggregate Testing - {currentForm}</h1>
                  <p className="mb-0 mt-2" style={{ color: 'white' }}>
                    {currentForm === 1 && "Determination of Bulk Density of Aggregate (Rodded & Loose)"}
                    {currentForm === 2 && "Sieve Analysis of Fine Aggregate"}
                    {currentForm === 3 && "Determination of Specific Gravity & Water Absorption of Fine Aggregate"}
                  </p>
                </div>
                <div>
                <Button variant="warning" className="me-2 btn-vitrag-primary" onClick={() => navigate('/other-services')}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Back to Other Services
                </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
        <Form onSubmit={handleSubmit}>
          {/* Form Navigation */}
          <Row className="mb-2">
            <Col>
              <Card className="step-navigation" style={{ border: 'none' }}>
                <Card.Body className="py-2">
                  <div className="d-flex justify-content-center">
                    {selectedTests.includes('bulkDensity') && (
                      <Button
                        variant={currentForm === 1 ? "primary" : "outline-primary"}
                        className="btn-lg me-5"
                        style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '80px', height: '80px', borderRadius: '50%', marginRight: '5rem !important', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setCurrentForm(1)}
                      >
                        1
                      </Button>
                    )}
                    {selectedTests.includes('sieveAnalysis') && (
                      <Button
                        variant={currentForm === 2 ? "primary" : "outline-primary"}
                        className="btn-lg mx-5"
                        style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '80px', height: '80px', borderRadius: '50%', marginLeft: '5rem !important', marginRight: '5rem !important', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setCurrentForm(2)}
                      >
                        2
                      </Button>
                    )}
                    {selectedTests.includes('specificGravity') && (
                      <Button
                        variant={currentForm === 3 ? "primary" : "outline-primary"}
                        className="btn-lg ms-5"
                        style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '80px', height: '80px', borderRadius: '50%', marginLeft: '5rem !important', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setCurrentForm(3)}
                      >
                        3
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Render current form */}
          {selectedTests.length === 0 ? (
            <Row className="mb-4">
              <Col>
                <Alert variant="warning" className="text-center">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  No tests selected. Please go back and select at least one test to perform.
                </Alert>
              </Col>
            </Row>
          ) : (
            <>
              {currentForm === 1 && selectedTests.includes('bulkDensity') && renderForm1()}
              {currentForm === 2 && selectedTests.includes('sieveAnalysis') && renderForm2()}
              {currentForm === 3 && selectedTests.includes('specificGravity') && renderForm3()}
            </>
          )}

          {/* Verification, Remarks, and Reviewed By */}
          {renderVerification()}
          {renderReviewedBy()}
          {renderRemarks()}

          {/* Submit Buttons */}
          <Row>
            <Col className="text-center">
              <div className="d-grid gap-2 d-md-block">
                <Button variant="secondary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={() => navigate('/other-services')}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Cancel
                </Button>
                {currentForm < 3 ? (
                  <Button variant="primary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={() => setCurrentForm(currentForm + 1)}>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save and Next
                  </Button>
                ) : (
                  <Button variant="success" type="submit" className="btn-lg btn-vitrag-primary">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save Test Data
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
    </div>
  );
};

export default FineAggregateForm;
