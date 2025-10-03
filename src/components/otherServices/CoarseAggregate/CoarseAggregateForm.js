import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes, faArrowLeft, faSave, faCalculator, faInfoCircle, faUserCheck, faComment, faUserShield, faTable } from '@fortawesome/free-solid-svg-icons';

const CoarseAggregateForm = () => {
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
      } else if (location.state.selectedTests.includes('impactValue')) {
        setCurrentForm(4);
      } else if (location.state.selectedTests.includes('crushingValue')) {
        setCurrentForm(5);
      }
    } else {
      // Default to all tests if no selection made
      setSelectedTests(['bulkDensity', 'sieveAnalysis', 'specificGravity', 'impactValue', 'crushingValue']);
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
      
      .coarse-aggregate-header {
        background-color: #007bff !important;
        color: white !important;
        border-radius: 15px !important;
      }
      
      .coarse-aggregate-header .card-body {
        background-color: #007bff !important;
        color: white !important;
        border-radius: 15px !important;
      }
      
      .coarse-aggregate-header h1,
      .coarse-aggregate-header p {
        color: white !important;
      }
      
      .step-navigation .btn-outline-primary {
        border: 2px solid #007bff !important;
        background-color: transparent !important;
        color: #007bff !important;
      }
      
      .step-navigation .btn-outline-primary:hover {
        border: 2px solid #007bff !important;
        background-color: rgba(0, 123, 255, 0.1) !important;
        color: #007bff !important;
      }
      
      .step-navigation .btn-primary {
        background-color: #007bff !important;
        border-color: #007bff !important;
        color: white !important;
      }
      
                .step-navigation .btn-primary:hover {
                  background-color: #0056b3 !important;
                  border-color: #0056b3 !important;
                  color: white !important;
                }
                .table td.left-align-text {
                  text-align: left !important;
                }
                .table td.left-align-text strong {
                  text-align: left !important;
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
    date_of_receipt: '',
    proposed_use: '',
    test_method: '',
    sample_test_code: '',
    date_of_testing: new Date().toISOString().split('T')[0],
    source: '',
    environmental_conditions: 'Laboratory Conditions, Temperature: 27±2°C, RH: 65±5%',
    
    // Test Report Details
    customer_site_address: '',
    date_of_report: '',
    reference_number: '',
    date_of_material_receipt: '',
    type_grade_aggregate: '',
    url_number: '',
    job_code_number: '',
    period_of_testing: '',
    condition_of_sample: '',
    location_of_testing: '',
    
    // Form-1: Bulk Density
    volume_measure_cylinder_1: '', net_weight_rodded_1: '', rodded_bulk_density_1: '',
    volume_measure_cylinder_2: '', net_weight_rodded_2: '', rodded_bulk_density_2: '',
    volume_measure_cylinder_3: '', net_weight_rodded_3: '', rodded_bulk_density_3: '',
    net_weight_loose_1: '', loose_bulk_density_1: '',
    net_weight_loose_2: '', loose_bulk_density_2: '',
    net_weight_loose_3: '', loose_bulk_density_3: '',
    
    // Form-1: Sieve Analysis
    total_weight: '',
    mean_rodded_bulk_density: '', mean_loose_bulk_density: '',
    
    // Form-5: Bulk Density
    volume_01: '', volume_02: '', volume_03: '',
    rodded_weight_01: '', rodded_weight_02: '', rodded_weight_03: '',
    rodded_density_01: '', rodded_density_02: '', rodded_density_03: '',
    loose_weight_01: '', loose_weight_02: '', loose_weight_03: '',
    loose_density_01: '', loose_density_02: '', loose_density_03: '',
    mean_rodded_density: '', mean_loose_density: '',
    
    // Form-2: Sieve Analysis
    type_size_aggregate_2: '',
    total_load_10_minutes: '',
    sieve_10mm_1: '', sieve_10mm_2: '', sieve_10mm_3: '', sieve_10mm_mean: '',
    sieve_20mm_1: '', sieve_20mm_2: '', sieve_20mm_3: '', sieve_20mm_mean: '',
    sieve_40mm_1: '', sieve_40mm_2: '', sieve_40mm_3: '', sieve_40mm_mean: '',
    sieve_80mm_1: '', sieve_80mm_2: '', sieve_80mm_3: '', sieve_80mm_mean: '',
    zone_i_1: '', zone_i_2: '', zone_i_3: '', zone_i_mean: '',
    zone_ii_1: '', zone_ii_2: '', zone_ii_3: '', zone_ii_mean: '',
    zone_iii_1: '', zone_iii_2: '', zone_iii_3: '', zone_iii_mean: '',
    zone_iv_1: '', zone_iv_2: '', zone_iv_3: '', zone_iv_mean: '',
    
    // Form-3: Specific Gravity & Water Absorption
    type_of_aggregate_3: '',
    max_nominal_size_3: '',
    wt_saturated_surface_dry_1: '', wt_pycnometer_aggregate_water_1: '', wt_pycnometer_water_1: '', wt_oven_dried_1: '',
    wt_saturated_surface_dry_2: '', wt_pycnometer_aggregate_water_2: '', wt_pycnometer_water_2: '', wt_oven_dried_2: '',
    wt_saturated_surface_dry_3: '', wt_pycnometer_aggregate_water_3: '', wt_pycnometer_water_3: '', wt_oven_dried_3: '',
    specific_gravity_1: '', water_absorption_1: '',
    specific_gravity_2: '', water_absorption_2: '',
    specific_gravity_3: '', water_absorption_3: '',
    mean_specific_gravity: '', mean_water_absorption: '',
    
    // Form-4: Flakiness Index
    type_of_aggregate_4: '',
    max_nominal_size_4: '',
    flakiness_10mm_1: '', flakiness_10mm_2: '', flakiness_10mm_3: '', flakiness_10mm_mean: '',
    flakiness_20mm_1: '', flakiness_20mm_2: '', flakiness_20mm_3: '', flakiness_20mm_mean: '',
    total_flakiness_index: '',
    
    // Form-5: Elongation Index
    type_size_aggregate_5: '',
    condition_of_aggregate: '',
    elongation_10mm_1: '', elongation_10mm_2: '', elongation_10mm_3: '', elongation_10mm_mean: '',
    elongation_20mm_1: '', elongation_20mm_2: '', elongation_20mm_3: '', elongation_20mm_mean: '',
    total_elongation_index: '',
    
    // Form-6: Impact Value
    type_of_aggregate_6: '',
    max_nominal_size_6: '',
    impact_weight_1: '', impact_weight_2: '', impact_weight_3: '',
    impact_passing_1: '', impact_passing_2: '', impact_passing_3: '',
    impact_retained_1: '', impact_retained_2: '', impact_retained_3: '',
    impact_value_1: '', impact_value_2: '', impact_value_3: '',
    mean_impact_value: '',
    
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

  const allFormTitles = [
    { id: 1, title: 'Bulk Density', description: 'Determination of Bulk Density of Coarse Aggregate', testId: 'bulkDensity' },
    { id: 2, title: 'Sieve Analysis', description: 'Grading of Coarse Aggregate by Sieve Analysis', testId: 'sieveAnalysis' },
    { id: 3, title: 'Specific Gravity & Water Absorption', description: 'Determination of Specific Gravity and Water Absorption', testId: 'specificGravity' },
    { id: 4, title: 'Flakiness Index', description: 'Determination of Flakiness Index', testId: 'impactValue' },
    { id: 5, title: 'Elongation Index', description: 'Determination of Elongation Index', testId: 'crushingValue' },
    { id: 6, title: 'Impact Value', description: 'Determination of Impact Value', testId: 'impactValue' }
  ];

  // Filter form titles based on selected tests
  const formTitles = allFormTitles.filter(form => selectedTests.includes(form.testId));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-calculate bulk density for Form-5
    if (currentForm === 5) {
      calculateBulkDensity(name, value);
    }
  };

  // Auto-calculation functions for Form-5
  const calculateBulkDensity = (fieldName, value) => {
    if (fieldName.includes('volume_') || fieldName.includes('rodded_weight_') || fieldName.includes('loose_weight_')) {
      const testNumber = fieldName.split('_').pop();
      
      // Calculate rodded density
      const volume = parseFloat(formData[`volume_${testNumber}`] || 0);
      const roddedWeight = parseFloat(formData[`rodded_weight_${testNumber}`] || 0);
      if (volume > 0 && roddedWeight > 0) {
        const roddedDensity = roddedWeight / volume;
        setFormData(prev => ({
          ...prev,
          [`rodded_density_${testNumber}`]: roddedDensity.toFixed(3)
        }));
      }
      
      // Calculate loose density
      const looseWeight = parseFloat(formData[`loose_weight_${testNumber}`] || 0);
      if (volume > 0 && looseWeight > 0) {
        const looseDensity = looseWeight / volume;
        setFormData(prev => ({
          ...prev,
          [`loose_density_${testNumber}`]: looseDensity.toFixed(3)
        }));
      }
      
      // Calculate mean values
      calculateMeanValues();
    }
  };

  const calculateMeanValues = () => {
    // Calculate mean rodded density
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
    
    // Calculate mean loose density
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


  const calculateMeans = () => {
    const roddedValues = [1, 2, 3].map(i => parseFloat(formData[`rodded_bulk_density_${i}`]) || 0);
    const looseValues = [1, 2, 3].map(i => parseFloat(formData[`loose_bulk_density_${i}`]) || 0);
    
    const meanRodded = roddedValues.reduce((acc, val) => acc + val, 0) / 3;
    const meanLoose = looseValues.reduce((acc, val) => acc + val, 0) / 3;
    
    setFormData(prev => ({
      ...prev,
      mean_rodded_bulk_density: meanRodded.toFixed(3),
      mean_loose_bulk_density: meanLoose.toFixed(3)
    }));
  };

  const calculateSieveAnalysis = () => {
    const totalWeight = parseFloat(formData.total_weight) || 0;
    if (totalWeight === 0) return;
    
    const sieves = ['10mm', '20mm', '40mm', '80mm'];
    const zones = ['i', 'ii', 'iii', 'iv'];
    
    sieves.forEach(sieve => {
      const values = [1, 2, 3].map(i => parseFloat(formData[`sieve_${sieve}_${i}`]) || 0);
      const mean = values.reduce((acc, val) => acc + val, 0) / 3;
      setFormData(prev => ({
        ...prev,
        [`sieve_${sieve}_mean`]: mean.toFixed(2)
      }));
    });
    
    zones.forEach(zone => {
      const values = [1, 2, 3].map(i => parseFloat(formData[`zone_${zone}_${i}`]) || 0);
      const mean = values.reduce((acc, val) => acc + val, 0) / 3;
      setFormData(prev => ({
        ...prev,
        [`zone_${zone}_mean`]: mean.toFixed(2)
      }));
    });
  };

  const calculateSpecificGravity = (testNumber) => {
    const A = parseFloat(formData[`wt_saturated_surface_dry_${testNumber}`]) || 0;
    const B = parseFloat(formData[`wt_pycnometer_aggregate_water_${testNumber}`]) || 0;
    const C = parseFloat(formData[`wt_pycnometer_water_${testNumber}`]) || 0;
    const D = parseFloat(formData[`wt_oven_dried_${testNumber}`]) || 0;
    
    if (A > 0 && B > 0 && C > 0 && D > 0) {
      const specificGravity = D / (A - (B - C));
      const waterAbsorption = ((A - D) / D) * 100;
      
      setFormData(prev => ({
        ...prev,
        [`specific_gravity_${testNumber}`]: specificGravity.toFixed(3),
        [`water_absorption_${testNumber}`]: waterAbsorption.toFixed(2)
      }));
    }
  };

  const calculateSpecificGravityMeans = () => {
    const sgValues = [1, 2, 3].map(i => parseFloat(formData[`specific_gravity_${i}`]) || 0);
    const waValues = [1, 2, 3].map(i => parseFloat(formData[`water_absorption_${i}`]) || 0);
    
    const meanSG = sgValues.reduce((acc, val) => acc + val, 0) / 3;
    const meanWA = waValues.reduce((acc, val) => acc + val, 0) / 3;
    
    setFormData(prev => ({
      ...prev,
      mean_specific_gravity: meanSG.toFixed(3),
      mean_water_absorption: meanWA.toFixed(2)
    }));
  };

  const calculateFlakinessIndex = () => {
    const sizes = ['10mm', '20mm'];
    let totalFlakiness = 0;
    
    sizes.forEach(size => {
      const values = [1, 2, 3].map(i => parseFloat(formData[`flakiness_${size}_${i}`]) || 0);
      const mean = values.reduce((acc, val) => acc + val, 0) / 3;
      totalFlakiness += mean;
      
      setFormData(prev => ({
        ...prev,
        [`flakiness_${size}_mean`]: mean.toFixed(2)
      }));
    });
    
    setFormData(prev => ({
      ...prev,
      total_flakiness_index: totalFlakiness.toFixed(2)
    }));
  };

  const calculateElongationIndex = () => {
    const sizes = ['10mm', '20mm'];
    let totalElongation = 0;
    
    sizes.forEach(size => {
      const values = [1, 2, 3].map(i => parseFloat(formData[`elongation_${size}_${i}`]) || 0);
      const mean = values.reduce((acc, val) => acc + val, 0) / 3;
      totalElongation += mean;
      
      setFormData(prev => ({
        ...prev,
        [`elongation_${size}_mean`]: mean.toFixed(2)
      }));
    });
    
    setFormData(prev => ({
      ...prev,
      total_elongation_index: totalElongation.toFixed(2)
    }));
  };

  const calculateImpactValue = (testNumber) => {
    const weight = parseFloat(formData[`impact_weight_${testNumber}`]) || 0;
    const passing = parseFloat(formData[`impact_passing_${testNumber}`]) || 0;
    const retained = parseFloat(formData[`impact_retained_${testNumber}`]) || 0;
    
    if (weight > 0 && (passing + retained) > 0) {
      const impactValue = (passing / (passing + retained)) * 100;
      setFormData(prev => ({
        ...prev,
        [`impact_value_${testNumber}`]: impactValue.toFixed(2)
      }));
    }
  };

  const calculateImpactValueMean = () => {
    const values = [1, 2, 3].map(i => parseFloat(formData[`impact_value_${i}`]) || 0);
    const mean = values.reduce((acc, val) => acc + val, 0) / 3;
    
    setFormData(prev => ({
      ...prev,
      mean_impact_value: mean.toFixed(2)
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted successfully!');
  };

  const renderVerification = () => (
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
                  <Form.Control type="text" name="tested_by_name" value={formData.tested_by_name} onChange={handleInputChange} placeholder="" required />
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
                  <Form.Control type="text" name="checked_by_name" value={formData.checked_by_name} onChange={handleInputChange} placeholder="" required />
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
  );

  const renderRemarks = () => (
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
              <Form.Control as="textarea" rows={4} name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="" />
            </Form.Group>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderReviewedBy = () => (
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
  );

  const renderGeneralInformation = (formNumber) => {
    const getFormSpecificFields = () => {
      switch (formNumber) {
        case 1: // Bulk Density
          return {
            col1: [
              { name: 'customer_id', label: 'Customer *', type: 'select', required: true },
              { name: 'sample_description', label: 'Sample Description *', type: 'textarea', required: true },
              { name: 'date_of_receipt', label: 'Date of Receipt *', type: 'date', required: true },
              { name: 'proposed_use', label: 'Proposed Use', type: 'text', placeholder: 'e.g., Concrete, Road Construction' },
              { name: 'test_method', label: 'Test Method', type: 'text', placeholder: 'e.g., IS 2386 (Part 3)' }
            ],
            col2: [
              { name: 'sample_test_code', label: 'Sample Test Code Number *', type: 'text', required: true, placeholder: 'e.g., CA-2024001' },
              { name: 'date_of_testing', label: 'Date of Testing *', type: 'date', required: true },
              { name: 'source', label: 'Source', type: 'text', placeholder: 'e.g., Quarry Location, Supplier Name' },
              { name: 'environmental_conditions', label: 'Environmental Conditions', type: 'text', placeholder: 'e.g., Laboratory Conditions' }
            ]
          };
        case 2: // Sieve Analysis
          return {
            col1: [
              { name: 'customer_id', label: 'Customer *', type: 'select', required: true },
              { name: 'sample_description', label: 'Sample Description *', type: 'textarea', required: true },
              { name: 'date_of_receipt', label: 'Date of Receipt *', type: 'date', required: true },
              { name: 'type_size_aggregate_2', label: 'Type & Size of Aggregate', type: 'text', placeholder: 'e.g., 10/20mm Coarse Aggregate' },
              { name: 'test_method', label: 'Test Method', type: 'text', placeholder: 'e.g., IS 2386 (Part 1)' }
            ],
            col2: [
              { name: 'sample_test_code', label: 'Sample Test Code Number *', type: 'text', required: true, placeholder: 'e.g., CA-2024001' },
              { name: 'date_of_testing', label: 'Date of Testing *', type: 'date', required: true },
              { name: 'total_load_10_minutes', label: 'Total load to be applied in 10 minutes', type: 'text', placeholder: 'e.g., 40 kN' },
              { name: 'environmental_conditions', label: 'Environmental Conditions', type: 'text', placeholder: 'e.g., Laboratory Conditions' }
            ]
          };
        case 3: // Specific Gravity & Water Absorption
          return {
            col1: [
              { name: 'customer_id', label: 'Customer *', type: 'select', required: true },
              { name: 'sample_description', label: 'Sample Description *', type: 'textarea', required: true },
              { name: 'date_of_receipt', label: 'Date of Receipt *', type: 'date', required: true },
              { name: 'type_of_aggregate_3', label: 'Type of Aggregate', type: 'text', placeholder: 'e.g., Crushed Stone' },
              { name: 'test_method', label: 'Test Method', type: 'text', placeholder: 'e.g., IS 2386 (Part 3)' }
            ],
            col2: [
              { name: 'sample_test_code', label: 'Sample Test Code Number *', type: 'text', required: true, placeholder: 'e.g., CA-2024001' },
              { name: 'date_of_testing', label: 'Date of Testing *', type: 'date', required: true },
              { name: 'max_nominal_size_3', label: 'Maximum Nominal Size of Aggregate', type: 'text', placeholder: 'e.g., 20mm' },
              { name: 'environmental_conditions', label: 'Environmental Conditions', type: 'text', placeholder: 'e.g., Laboratory Conditions' }
            ]
          };
        case 4: // Flakiness Index
          return {
            col1: [
              { name: 'customer_id', label: 'Customer *', type: 'select', required: true },
              { name: 'sample_description', label: 'Sample Description *', type: 'textarea', required: true },
              { name: 'date_of_receipt', label: 'Date of Receipt *', type: 'date', required: true },
              { name: 'type_of_aggregate_4', label: 'Type of Aggregate', type: 'text', placeholder: 'e.g., Crushed Stone' },
              { name: 'test_method', label: 'Test Method', type: 'text', placeholder: 'e.g., IS 2386 (Part 1)' }
            ],
            col2: [
              { name: 'sample_test_code', label: 'Sample Test Code Number *', type: 'text', required: true, placeholder: 'e.g., CA-2024001' },
              { name: 'date_of_testing', label: 'Date of Testing *', type: 'date', required: true },
              { name: 'max_nominal_size_4', label: 'Maximum Nominal Size of Aggregate', type: 'text', placeholder: 'e.g., 20mm' },
              { name: 'environmental_conditions', label: 'Environmental Conditions', type: 'text', placeholder: 'e.g., Laboratory Conditions' }
            ]
          };
        case 5: // Elongation Index
          return {
            col1: [
              { name: 'customer_id', label: 'Customer *', type: 'select', required: true },
              { name: 'sample_description', label: 'Sample Description *', type: 'textarea', required: true },
              { name: 'date_of_receipt', label: 'Date of Receipt *', type: 'date', required: true },
              { name: 'type_size_aggregate_5', label: 'Type & Size of Aggregate', type: 'text', placeholder: 'e.g., 10/20mm Coarse Aggregate' },
              { name: 'test_method', label: 'Test Method', type: 'text', placeholder: 'e.g., IS 2386 (Part 1)' }
            ],
            col2: [
              { name: 'sample_test_code', label: 'Sample Test Code Number *', type: 'text', required: true, placeholder: 'e.g., CA-2024001' },
              { name: 'date_of_testing', label: 'Date of Testing *', type: 'date', required: true },
              { name: 'condition_of_aggregate', label: 'Condition of Aggregate', type: 'text', placeholder: 'e.g., Dry, Saturated' },
              { name: 'environmental_conditions', label: 'Environmental Conditions', type: 'text', placeholder: 'e.g., Laboratory Conditions' }
            ]
          };
        case 6: // Impact Value
          return {
            col1: [
              { name: 'customer_id', label: 'Customer *', type: 'select', required: true },
              { name: 'sample_description', label: 'Sample Description *', type: 'textarea', required: true },
              { name: 'date_of_receipt', label: 'Date of Receipt *', type: 'date', required: true },
              { name: 'type_of_aggregate_6', label: 'Type of Aggregate', type: 'text', placeholder: 'e.g., Crushed Stone' },
              { name: 'test_method', label: 'Test Method', type: 'text', placeholder: 'e.g., IS 2386 (Part 4)' }
            ],
            col2: [
              { name: 'sample_test_code', label: 'Sample Test Code Number *', type: 'text', required: true, placeholder: 'e.g., CA-2024001' },
              { name: 'date_of_testing', label: 'Date of Testing *', type: 'date', required: true },
              { name: 'max_nominal_size_6', label: 'Maximum Nominal Size of Aggregate', type: 'text', placeholder: 'e.g., 20mm' },
              { name: 'environmental_conditions', label: 'Environmental Conditions', type: 'text', placeholder: 'e.g., Laboratory Conditions' }
            ]
          };
        default:
          return { col1: [], col2: [] };
      }
    };

    const fields = getFormSpecificFields();

    return (
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
                  {fields.col1.map((field, index) => (
                    <Form.Group key={index} className="mb-3">
                      <Form.Label>{field.label}</Form.Label>
                      {field.type === 'select' ? (
                        <Form.Select 
                          name={field.name} 
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          required={field.required}
                        >
                          <option value="">Select Customer</option>
                          <option value="1">ABC Construction Ltd.</option>
                          <option value="2">XYZ Builders</option>
                          <option value="3">DEF Infrastructure</option>
                        </Form.Select>
                      ) : field.type === 'textarea' ? (
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          required={field.required}
                        />
                      ) : (
                        <Form.Control
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          required={field.required}
                        />
                      )}
                    </Form.Group>
                  ))}
                </Col>
                
                <Col md={6}>
                  {fields.col2.map((field, index) => (
                    <Form.Group key={index} className="mb-3">
                      <Form.Label>{field.label}</Form.Label>
                      <Form.Control
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        required={field.required}
                      />
                    </Form.Group>
                  ))}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };


  const renderCurrentForm = () => {
    const renderFormWithSections = (formNumber, testResultsContent) => (
      <>
        {renderGeneralInformation(formNumber)}
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
                {testResultsContent}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {renderVerification()}
        {renderRemarks()}
        {renderReviewedBy()}
      </>
    );

    switch (currentForm) {
      case 1:
        return renderFormWithSections(1, (
          <div>
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
                    <th style={{ width: '75px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>IS Sieve</th>
                    <th style={{ width: '75px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Weigh. Retained (gm)</th>
                    <th style={{ width: '75px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>% Weight Retained</th>
                    <th style={{ width: '85px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Cumulative % Weight Retained</th>
                    <th style={{ width: '55px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>% Passing</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    '40 mm',
                    '31.5 mm',
                    '25 mm',
                    '20 mm',
                    '16 mm',
                    '12.5 mm',
                    '10 mm',
                    '4.75 mm',
                    '2.36 mm',
                    '1.18 mm',
                    'Pan'
                  ].map((sieve, index) => (
                    <tr key={index}>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{sieve}</td>
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
                    </tr>
                  ))}
                  
                  {/* Calculation Rows */}
                  <tr>
                    <td colSpan="4" style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'left', verticalAlign: 'middle' }}>
                      Sum of Cumulative % Weight Retained (Excluding Pan) =
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}></td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'left', verticalAlign: 'middle' }}>
                      Fineness Modulus = (Sum of Cumulative % weight retained/100) + 3 =
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ));
      case 2:
        return renderFormWithSections(2, (
          <div className="table-responsive">
            <table className="table transparent-table" style={{ fontSize: '1.1rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '550px', padding: '6px', textAlign: 'left', verticalAlign: 'middle', fontSize: '1.3rem', border: '1px solid #dee2e6' }}>Number of Tests</th>
                  <th style={{ width: '140px', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontSize: '1.3rem', border: '1px solid #dee2e6' }}>01</th>
                  <th style={{ width: '140px', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontSize: '1.3rem', border: '1px solid #dee2e6' }}>02</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', border: '1px solid #dee2e6' }}>
                    <strong>Weight. of sample material taken (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(A)</span></strong>
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
                    <strong>Weight. of fraction of sample passing through IS Sieve 2.36mm (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(B)</span></strong>
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
                    <strong>Aggregate Crushing Value = (B/A)*100</strong>
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
                    <strong>Mean Aggregate Crushing Value</strong>
                  </td>
                  <td colSpan="2" style={{ padding: '4px', textAlign: 'center', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}>
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
        ));
      case 3:
        return renderFormWithSections(3, (
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
                    <strong>Weight. of Sample taken (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(A)</span></strong>
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
                    <strong>Wt. of Fraction passing through 2.36mm IS sieve (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(B)</span></strong>
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
                    <strong>Wt. of Fraction retained on 2.36mm IS sieve (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(C)</span></strong>
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
                    <strong>Total Wt. (B+C)</strong>
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
                    <strong>Aggregate Impact Value = (B/A)*100</strong>
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
                    <strong>Mean of Aggregate Impact Value</strong>
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
        ));
      case 4:
        return renderFormWithSections(4, (
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
                    <strong>Weight of Sample taken (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(A)</span></strong>
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
                    <strong>Weight of Flaky Material (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(B)</span></strong>
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
                    <strong>Flakiness Index of Aggregate = (B/A)</strong>
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
                    <strong>Mean Flakiness Index</strong>
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
                <tr>
                  <td className="left-align-text" style={{ fontSize: '1rem', padding: '6px', border: '1px solid #dee2e6' }}>
                    <strong>Wt. of Elongated Material (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(C)</span></strong>
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
                    <strong>Elongated Index of Aggregate = (C/A)</strong>
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
              </tbody>
            </table>
          </div>
        ));
      case 5:
        return renderFormWithSections(5, (
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
                  <td style={{ fontSize: '1rem', padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}><strong>Mean Rodded Bulk Density (kg/m³)</strong></td>
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
                  <td style={{ fontSize: '1rem', padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}><strong>Mean Loose Bulk Density (kg/m³)</strong></td>
                  <td colSpan="3" style={{ padding: '6px', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}><Form.Control type="number" step="0.001" value={formData.mean_loose_density || ''} readOnly className="average-input-transparent" style={{ height: '30px', backgroundColor: 'var(--bs-dark)', background: 'var(--bs-dark)', backgroundImage: 'none', border: '1px solid var(--bs-gray-700)', color: '#ffffff', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', boxShadow: 'none', outline: 'none' }} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        ));
      case 6:
        return renderFormWithSections(6, (
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
                    <strong>Weight of Aggregate & Vessel and water(gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(A)</span></strong>
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
                    <strong>Weight of Empty Vessel and Water(gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(B)</span></strong>
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
                    <strong>Weight of Saturated Surface Dry Aggregate in air (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(C)</span></strong>
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
                    <strong>Weight of Oven Dried Aggregate in air (gm) <span style={{ float: 'right', fontWeight: 'bold' }}>(D)</span></strong>
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
                    <strong>Specific Gravity = [D/(D-(A-B)]</strong>
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
                    <strong>Water Absorption = [(C - D)/D] * 100</strong>
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
        ));
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="coarse-aggregate-header" style={{ backgroundColor: '#007bff !important', color: 'white !important', border: 'none', borderRadius: '15px' }}>
            <Card.Body className="coarse-aggregate-header" style={{ backgroundColor: '#007bff !important', color: 'white !important' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                   <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}><FontAwesomeIcon icon={faCubes} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />10/20mm Coarse Aggregate Test - {currentForm}</h1>
                  <p className="mb-0 mt-2" style={{ color: 'white' }}>
                    {currentForm === 1 && "Sieve analysis of Coarse Aggregate"}
                    {currentForm === 2 && "Determination of Aggregate Crushing Value"}
                    {currentForm === 3 && "Determination of Aggregate Impact Value Test"}
                    {currentForm === 4 && "Determination of Flakiness & Elongation Index of Aggregate"}
                    {currentForm === 5 && "Determination of Bulk Density of Aggregate (Rodded & Loose)"}
                    {currentForm === 6 && "Determination of Specific Gravity & Water Absorption of Coarse Aggregate"}
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
                    {formTitles.map((form) => (
                      <Button
                        key={form.id}
                        variant={currentForm === form.id ? "primary" : "outline-primary"}
                        size="lg"
                        className="mx-2"
                        style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => setCurrentForm(form.id)}
                      >
                        {form.id}
                      </Button>
                    ))}
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
            renderCurrentForm()
          )}

          {/* Submit Buttons */}
          <Row>
            <Col className="text-center">
              <div className="d-grid gap-2 d-md-block">
                <Button variant="secondary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={() => navigate('/other-services')}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Cancel
                </Button>
                {currentForm < formTitles.length ? (
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

export default CoarseAggregateForm;
