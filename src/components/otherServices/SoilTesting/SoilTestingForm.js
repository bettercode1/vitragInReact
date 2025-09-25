import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSeedling, 
  faArrowLeft, 
  faSave, 
  faTimes, 
  faMagic,
  faInfoCircle,
  faTable,
  faUserCheck,
  faComment,
  faEye
} from '@fortawesome/free-solid-svg-icons';

// Import individual form components
import Form1CompactionTest from './forms/Form1CompactionTest';
import Form2FreeSwellIndex from './forms/Form2FreeSwellIndex';
import Form3GrainSizeAnalysis from './forms/Form3GrainSizeAnalysis';
import Form4LiquidLimit from './forms/Form4LiquidLimit';
import Form5PlasticLimit from './forms/Form5PlasticLimit';
import Form6WaterContent from './forms/Form6WaterContent';

const SoilTestingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPreview, setShowPreview] = useState(false);
  const [currentTest, setCurrentTest] = useState(1);
  const [selectedTests, setSelectedTests] = useState([]);

  // Handle selected tests from popup
  useEffect(() => {
    if (location.state && location.state.selectedTests) {
      setSelectedTests(location.state.selectedTests);
      // Set current test to first available test
      if (location.state.selectedTests.includes('compactionTest')) {
        setCurrentTest(1);
      } else if (location.state.selectedTests.includes('freeSwellIndex')) {
        setCurrentTest(2);
      } else if (location.state.selectedTests.includes('grainSizeAnalysis')) {
        setCurrentTest(3);
      } else if (location.state.selectedTests.includes('liquidLimit')) {
        setCurrentTest(4);
      } else if (location.state.selectedTests.includes('plasticLimit')) {
        setCurrentTest(5);
      } else if (location.state.selectedTests.includes('waterContent')) {
        setCurrentTest(6);
      }
    } else {
      // Default to all tests if no selection made
      setSelectedTests(['compactionTest', 'freeSwellIndex', 'grainSizeAnalysis', 'liquidLimit', 'plasticLimit', 'waterContent']);
      setCurrentTest(1);
    }
  }, [location.state]);

  // Handle test method changes when switching between forms
  useEffect(() => {
    if (currentTest === 1 && selectedTests.includes('compactionTest')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS 2720 (PART 7-1980)\nIS 2720 (PART 8-1983)'
      }));
    } else if (currentTest === 2 && selectedTests.includes('freeSwellIndex')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS2720 (PART-40)-1977'
      }));
    } else if (currentTest === 3 && selectedTests.includes('grainSizeAnalysis')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS 2720 (PART 4)-1985'
      }));
    } else if (currentTest === 4 && selectedTests.includes('liquidLimit')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS 2720 (PART 5)-1985'
      }));
    } else if (currentTest === 5 && selectedTests.includes('plasticLimit')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS 2720 (PART-5)-1985'
      }));
    } else if (currentTest === 6 && selectedTests.includes('waterContent')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS 2720 (PART 2)-1973'
      }));
    }
  }, [currentTest, selectedTests]);

  const [formData, setFormData] = useState({
    // General Information
    customer_id: '',
    sample_test_code: '',
    date_of_receipt: '',
    quantity: '',
    sample_condition: '',
    sample_description: '',
    date_of_testing: new Date().toISOString().split('T')[0],
    test_method: 'IS 2720 (PART-5)-1985',
    soil_type: '',
    soil_classification: '',
    environmental_conditions: 'Laboratory Conditions, Temperature: 27±2°C, RH: 65±5%',
    
    // Test Report Details
    customer_site_address: '',
    date_of_report: '',
    reference_number: '',
    date_of_material_receipt: '',
    type_grade_soil: '',
    url_number: '',
    job_code_number: '',
    period_of_testing: '',
    condition_of_sample: '',
    location_of_testing: '',
    
    // Form 1 - Compaction Test Data
    weight_mould_1: '', weight_mould_2: '', weight_mould_3: '', weight_mould_4: '', weight_mould_5: '',
    weight_mould_soil_1: '', weight_mould_soil_2: '', weight_mould_soil_3: '', weight_mould_soil_4: '', weight_mould_soil_5: '',
    container_no_1: '', container_no_2: '', container_no_3: '', container_no_4: '', container_no_5: '',
    weight_container_1: '', weight_container_2: '', weight_container_3: '', weight_container_4: '', weight_container_5: '',
    weight_wet_soil_1: '', weight_wet_soil_2: '', weight_wet_soil_3: '', weight_wet_soil_4: '', weight_wet_soil_5: '',
    weight_dry_soil_1: '', weight_dry_soil_2: '', weight_dry_soil_3: '', weight_dry_soil_4: '', weight_dry_soil_5: '',
    wet_density_1: '', wet_density_2: '', wet_density_3: '', wet_density_4: '', wet_density_5: '',
    moisture_content_1: '', moisture_content_2: '', moisture_content_3: '', moisture_content_4: '', moisture_content_5: '',
    dry_density_1: '', dry_density_2: '', dry_density_3: '', dry_density_4: '', dry_density_5: '',
    volume_mould: '', weight_rammer: '', sieve_size_passing: '', percentage_passing: '', sieve_size_retained: '', percentage_retained: '',
    max_dry_density: '', optimum_moisture: '', compaction_type: '',
    
    // Form 2 - Free Swell Index Data
    volume_water_1: '', volume_water_2: '', volume_water_3: '',
    volume_kerosene_1: '', volume_kerosene_2: '', volume_kerosene_3: '',
    free_swell_index_1: '', free_swell_index_2: '', free_swell_index_3: '',
    final_free_swell_index: '',
    
    // Form 3 - Grain Size Analysis Data
    total_oven_dried_weight: '', quantity_retained_80mm: '', quantity_passing_80mm: '', particle_shape: '', quantity_taken_for_test: '',
    weight_80: '', weight_20: '', weight_475: '', weight_2000: '', weight_0600: '', weight_0425: '', weight_0075: '',
    percent_retained_80: '', percent_retained_20: '', percent_retained_475: '', percent_retained_2000: '', percent_retained_0600: '', percent_retained_0425: '', percent_retained_0075: '',
    percent_passing_80: '', percent_passing_20: '', percent_passing_475: '', percent_passing_2000: '', percent_passing_0600: '', percent_passing_0425: '', percent_passing_0075: '',
    remarks_80: '', remarks_20: '', remarks_475: '', remarks_2000: '', remarks_0600: '', remarks_0425: '', remarks_0075: '',
    coarse_gravel_percent: '', fine_gravel_percent: '', coarse_sand_percent: '', medium_sand_percent: '', fine_sand_percent: '', silt_clay_percent: '',
    coarse_gravel_percent_2: '', fine_gravel_percent_2: '', coarse_sand_percent_2: '', medium_sand_percent_2: '', fine_sand_percent_2: '', silt_clay_percent_2: '',
    
    // Form 4 - Liquid Limit Data
    no_of_blows_1: '', no_of_blows_2: '', no_of_blows_3: '', no_of_blows_4: '', no_of_blows_5: '',
    container_no_1: '', container_no_2: '', container_no_3: '', container_no_4: '', container_no_5: '',
    wt_container_1: '', wt_container_2: '', wt_container_3: '', wt_container_4: '', wt_container_5: '',
    wt_container_wet_soil_1: '', wt_container_wet_soil_2: '', wt_container_wet_soil_3: '', wt_container_wet_soil_4: '', wt_container_wet_soil_5: '',
    wt_container_dry_soil_1: '', wt_container_dry_soil_2: '', wt_container_dry_soil_3: '', wt_container_dry_soil_4: '', wt_container_dry_soil_5: '',
    wt_water_1: '', wt_water_2: '', wt_water_3: '', wt_water_4: '', wt_water_5: '',
    wt_dry_soil_1: '', wt_dry_soil_2: '', wt_dry_soil_3: '', wt_dry_soil_4: '', wt_dry_soil_5: '',
    moisture_content_1: '', moisture_content_2: '', moisture_content_3: '', moisture_content_4: '', moisture_content_5: '',
    liquid_limit: '',
    
    // Form 5 - Plastic Limit Data
    plastic_container_no_1: '', plastic_container_no_2: '', plastic_container_no_3: '', plastic_container_no_4: '', plastic_container_no_5: '',
    plastic_wt_container_1: '', plastic_wt_container_2: '', plastic_wt_container_3: '', plastic_wt_container_4: '', plastic_wt_container_5: '',
    plastic_wt_container_wet_soil_1: '', plastic_wt_container_wet_soil_2: '', plastic_wt_container_wet_soil_3: '', plastic_wt_container_wet_soil_4: '', plastic_wt_container_wet_soil_5: '',
    plastic_wt_container_dry_soil_1: '', plastic_wt_container_dry_soil_2: '', plastic_wt_container_dry_soil_3: '', plastic_wt_container_dry_soil_4: '', plastic_wt_container_dry_soil_5: '',
    plastic_wt_water_1: '', plastic_wt_water_2: '', plastic_wt_water_3: '', plastic_wt_water_4: '', plastic_wt_water_5: '',
    plastic_wt_dry_soil_1: '', plastic_wt_dry_soil_2: '', plastic_wt_dry_soil_3: '', plastic_wt_dry_soil_4: '', plastic_wt_dry_soil_5: '',
    plastic_moisture_content_1: '', plastic_moisture_content_2: '', plastic_moisture_content_3: '', plastic_moisture_content_4: '', plastic_moisture_content_5: '',
    plastic_limit: '', plastic_index: '',
    
    // Form 6 - Water Content Data
    water_container_no: '',
    water_mass_container: '',
    water_mass_container_wet_soil: '',
    water_mass_container_dry_soil: '',
    water_mass_moisture: '',
    water_mass_dry_soil: '',
    water_content_percentage: '',
    
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

  const testTitles = {
    1: 'Determination of Compaction Test (Light/Heavy)',
    2: 'Determination of Free Swell Index',
    3: 'Determination of Grain Size Analysis',
    4: 'Determination of Liquid Limit',
    5: 'Determination of Plastic Limit',
    6: 'Determination of Water Content (Oven-Drying Method)'
  };


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
            <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faUserCheck} className="me-2" />Authorized By</h4>
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

  const fillRandomData = () => {
    if (window.confirm('This will fill all fields with sample data. Continue?')) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const randomData = {
        // General Information
        customer_id: '1',
        sample_test_code: 'ST-2024-001',
        date_of_receipt: today.toISOString().split('T')[0],
        quantity: '5 kg',
        sample_condition: 'Good',
        sample_description: 'Soil sample for compaction test - Clayey soil with moderate plasticity',
        date_of_testing: today.toISOString().split('T')[0],
        test_method: currentTest === 2 ? 'IS2720 (PART-40)-1977' : currentTest === 3 ? 'IS 2720 (PART 4)-1985' : currentTest === 4 ? 'IS 2720 (PART 5)-1985' : currentTest === 5 ? 'IS 2720 (PART-5)-1985' : currentTest === 6 ? 'IS 2720 (PART 2)-1973' : 'IS 2720 (PART 7-1980)\nIS 2720 (PART 8-1983)',
        soil_type: 'Clayey Soil',
        soil_classification: 'CH (Clay of High plasticity)',
        
        // Test Report Details
        customer_site_address: 'Sample Construction Site, Mumbai',
        date_of_report: today.toISOString().split('T')[0],
        reference_number: 'REF-2024-001',
        date_of_material_receipt: today.toISOString().split('T')[0],
        type_grade_soil: 'Clayey Soil',
        url_number: 'URL-2024-001',
        job_code_number: 'JOB-2024-001',
        period_of_testing: '1 day',
        condition_of_sample: 'Acceptable',
        location_of_testing: 'Laboratory',
        
        // Form 1 - Compaction Test Data
        weight_mould_1: '4500.00', weight_mould_2: '4500.00', weight_mould_3: '4500.00', weight_mould_4: '4500.00', weight_mould_5: '4500.00',
        weight_mould_soil_1: '6200.00', weight_mould_soil_2: '6350.00', weight_mould_soil_3: '6480.00', weight_mould_soil_4: '6520.00', weight_mould_soil_5: '6400.00',
        container_no_1: 'C-001', container_no_2: 'C-002', container_no_3: 'C-003', container_no_4: 'C-004', container_no_5: 'C-005',
        weight_container_1: '25.50', weight_container_2: '26.20', weight_container_3: '24.80', weight_container_4: '25.90', weight_container_5: '26.10',
        weight_wet_soil_1: '180.50', weight_wet_soil_2: '175.20', weight_wet_soil_3: '182.80', weight_wet_soil_4: '178.90', weight_wet_soil_5: '179.10',
        weight_dry_soil_1: '165.20', weight_dry_soil_2: '158.40', weight_dry_soil_3: '162.60', weight_dry_soil_4: '159.80', weight_dry_soil_5: '160.20',
        wet_density_1: '1.700', wet_density_2: '1.850', wet_density_3: '1.980', wet_density_4: '2.020', wet_density_5: '1.900',
        moisture_content_1: '9.27', moisture_content_2: '10.61', moisture_content_3: '12.41', moisture_content_4: '11.95', moisture_content_5: '11.79',
        dry_density_1: '1.556', dry_density_2: '1.673', dry_density_3: '1.762', dry_density_4: '1.805', dry_density_5: '1.700',
        volume_mould: '1000.00',
        weight_rammer: '2.60',
        sieve_size_passing: '4.75',
        percentage_passing: '95.5',
        sieve_size_retained: '4.75',
        percentage_retained: '4.5',
        max_dry_density: '1.805',
        optimum_moisture: '11.95',
        compaction_type: 'Standard Proctor',
        
        // Verification
        tested_by_name: 'John Doe',
        tested_by_date: today.toISOString().split('T')[0],
        checked_by_name: 'Jane Smith',
        checked_by_date: today.toISOString().split('T')[0],
        remarks: 'Sample data filled for testing purposes. All measurements are approximate and should be replaced with actual test data.'
      };
      
      setFormData(prev => ({ ...prev, ...randomData }));
      
      alert('Random data filled successfully! Please review and modify as needed before submitting.');
    }
  };

  const handleSaveTestData = () => {
    // Create URL parameters from form data
    const params = new URLSearchParams();
    
    // General Information (for Observation Report)
    params.append('sample_description', formData.sample_description || '');
    params.append('date_of_receipt', formData.date_of_receipt || '');
    params.append('sample_test_code', formData.sample_test_code || '');
    params.append('date_of_testing', formData.date_of_testing || '');
    params.append('environmental_conditions', formData.environmental_conditions || '');
    params.append('test_method', formData.test_method || '');
    params.append('soil_type', formData.soil_type || '');
    
    // Test Results (for Observation Report) - Form 1 Compaction Test
    for (let i = 1; i <= 5; i++) {
      params.append(`weight_mould_${i}`, formData[`weight_mould_${i}`] || '');
      params.append(`weight_mould_soil_${i}`, formData[`weight_mould_soil_${i}`] || '');
      params.append(`container_no_${i}`, formData[`container_no_${i}`] || '');
      params.append(`weight_container_${i}`, formData[`weight_container_${i}`] || '');
      params.append(`weight_wet_soil_${i}`, formData[`weight_wet_soil_${i}`] || '');
      params.append(`weight_dry_soil_${i}`, formData[`weight_dry_soil_${i}`] || '');
      params.append(`wet_density_${i}`, formData[`wet_density_${i}`] || '');
      params.append(`moisture_content_${i}`, formData[`moisture_content_${i}`] || '');
      params.append(`dry_density_${i}`, formData[`dry_density_${i}`] || '');
    }
    
    // Observation data
    params.append('volume_mould', formData.volume_mould || '');
    params.append('weight_rammer', formData.weight_rammer || '');
    params.append('sieve_size_passing', formData.sieve_size_passing || '');
    params.append('percentage_passing', formData.percentage_passing || '');
    params.append('sieve_size_retained', formData.sieve_size_retained || '');
    params.append('percentage_retained', formData.percentage_retained || '');
    params.append('max_dry_density', formData.max_dry_density || '');
    params.append('optimum_moisture', formData.optimum_moisture || '');
    params.append('compaction_type', formData.compaction_type || '');
    
    // Verification (for Observation Report)
    params.append('tested_by_name', formData.tested_by_name || '');
    params.append('tested_by_date', formData.tested_by_date || '');
    params.append('checked_by_name', formData.checked_by_name || '');
    params.append('checked_by_date', formData.checked_by_date || '');
    params.append('verified_by_name', formData.verified_by_name || '');
    params.append('verified_by_date', formData.verified_by_date || '');
    
    // Remarks (for Observation Report)
    params.append('remarks', formData.remarks || '');
    
    // Customer Information (for Test Report)
    const customerNames = {
      '1': 'Sample Customer 1',
      '2': 'Sample Customer 2'
    };
    params.append('customer_name', customerNames[formData.customer_id] || formData.customer_id || '');
    params.append('site_address', formData.customer_site_address || '');
    params.append('ulr_number', formData.url_number || '');
    params.append('job_code_number', formData.job_code_number || '');
    params.append('reference_number', formData.reference_number || '');
    params.append('date_of_report', new Date().toISOString().split('T')[0]);
    params.append('date_of_material_receipt', formData.date_of_receipt || '');
    params.append('material_description', formData.sample_description || '');
    params.append('condition_of_sample', formData.condition_of_sample || 'Acceptable');
    params.append('location_of_testing', formData.location_of_testing || 'Laboratory');
    
    // Test Results Summary (for Test Report)
    params.append('max_dry_density_result', formData.max_dry_density || '0.000');
    params.append('optimum_moisture_result', formData.optimum_moisture || '0.00');
    
    // Authorization (for Test Report)
    params.append('reviewed_by', formData.reviewed_by || 'Lalita S. Dussa - Quality Manager');
    params.append('authorized_by', formData.authorized_by || 'Prakarsh Sangave');
    
    // Redirect to HTML report page
    const reportUrl = `/SoilTestingReport.html?${params.toString()}`;
    window.open(reportUrl, '_blank');
  };

  const handleSaveTestDataForm2 = () => {
    // Create URL parameters from form data for Free Swell Index Test
    const params = new URLSearchParams();
    
    // General Information
    params.append('sample_description', formData.sample_description || '');
    params.append('date_of_receipt', formData.date_of_receipt || '');
    params.append('sample_test_code', formData.sample_test_code || '');
    params.append('date_of_testing', formData.date_of_testing || '');
    params.append('quantity', formData.quantity || '');
    params.append('sample_condition', formData.sample_condition || '');
    params.append('test_method', formData.test_method || 'IS 2720 (PART-40)-1977');
    
    // Free Swell Index Test Results
    params.append('volume_water_1', formData.volume_water_1 || '');
    params.append('volume_water_2', formData.volume_water_2 || '');
    params.append('volume_water_3', formData.volume_water_3 || '');
    params.append('volume_kerosene_1', formData.volume_kerosene_1 || '');
    params.append('volume_kerosene_2', formData.volume_kerosene_2 || '');
    params.append('volume_kerosene_3', formData.volume_kerosene_3 || '');
    params.append('free_swell_index_1', formData.free_swell_index_1 || '');
    params.append('free_swell_index_2', formData.free_swell_index_2 || '');
    params.append('free_swell_index_3', formData.free_swell_index_3 || '');
    params.append('final_free_swell_index', formData.final_free_swell_index || '');
    
    // Verification
    params.append('tested_by_name', formData.tested_by_name || '');
    params.append('tested_by_date', formData.tested_by_date || '');
    params.append('checked_by_name', formData.checked_by_name || '');
    params.append('checked_by_date', formData.checked_by_date || '');
    params.append('verified_by_name', formData.verified_by_name || '');
    params.append('verified_by_date', formData.verified_by_date || '');
    params.append('authorized_by', formData.authorized_by || 'Prakarsh Sangave');
    params.append('date_of_report', new Date().toISOString().split('T')[0]);
    
    // Redirect to Free Swell Index report page
    const reportUrl = `/FreeSwellIndexReport.html?${params.toString()}`;
    window.open(reportUrl, '_blank');
  };

  const handleSaveTestDataForm3 = () => {
    // Create URL parameters from form data for Grain Size Analysis Test
    const params = new URLSearchParams();
    
    // General Information
    params.append('sample_description', formData.sample_description || '');
    params.append('date_of_receipt', formData.date_of_receipt || '');
    params.append('sample_test_code', formData.sample_test_code || '');
    params.append('date_of_testing', formData.date_of_testing || '');
    params.append('quantity', formData.quantity || '');
    params.append('sample_condition', formData.sample_condition || '');
    params.append('test_method', formData.test_method || 'IS 2720 (PART 4)-1985');
    
    // Observation data
    params.append('total_oven_dried_weight', formData.total_oven_dried_weight || '');
    params.append('quantity_retained_80mm', formData.quantity_retained_80mm || '');
    params.append('quantity_passing_80mm', formData.quantity_passing_80mm || '');
    params.append('particle_shape', formData.particle_shape || '');
    params.append('quantity_taken_for_test', formData.quantity_taken_for_test || '');
    
    // Sieve Analysis Data
    params.append('weight_80', formData.weight_80 || '');
    params.append('percent_retained_80', formData.percent_retained_80 || '');
    params.append('percent_passing_80', formData.percent_passing_80 || '');
    params.append('remarks_80', formData.remarks_80 || '');
    
    params.append('weight_20', formData.weight_20 || '');
    params.append('percent_retained_20', formData.percent_retained_20 || '');
    params.append('percent_passing_20', formData.percent_passing_20 || '');
    params.append('remarks_20', formData.remarks_20 || '');
    
    params.append('weight_475', formData.weight_475 || '');
    params.append('percent_retained_475', formData.percent_retained_475 || '');
    params.append('percent_passing_475', formData.percent_passing_475 || '');
    params.append('remarks_475', formData.remarks_475 || '');
    
    params.append('weight_2000', formData.weight_2000 || '');
    params.append('percent_retained_2000', formData.percent_retained_2000 || '');
    params.append('percent_passing_2000', formData.percent_passing_2000 || '');
    params.append('remarks_2000', formData.remarks_2000 || '');
    
    params.append('weight_0600', formData.weight_0600 || '');
    params.append('percent_retained_0600', formData.percent_retained_0600 || '');
    params.append('percent_passing_0600', formData.percent_passing_0600 || '');
    params.append('remarks_0600', formData.remarks_0600 || '');
    
    params.append('weight_0425', formData.weight_0425 || '');
    params.append('percent_retained_0425', formData.percent_retained_0425 || '');
    params.append('percent_passing_0425', formData.percent_passing_0425 || '');
    params.append('remarks_0425', formData.remarks_0425 || '');
    
    params.append('weight_0075', formData.weight_0075 || '');
    params.append('percent_retained_0075', formData.percent_retained_0075 || '');
    params.append('percent_passing_0075', formData.percent_passing_0075 || '');
    params.append('remarks_0075', formData.remarks_0075 || '');
    
    // Percentage Summary Data
    params.append('coarse_gravel_percent', formData.coarse_gravel_percent || '');
    params.append('fine_gravel_percent', formData.fine_gravel_percent || '');
    params.append('coarse_sand_percent', formData.coarse_sand_percent || '');
    params.append('medium_sand_percent', formData.medium_sand_percent || '');
    params.append('fine_sand_percent', formData.fine_sand_percent || '');
    params.append('silt_clay_percent', formData.silt_clay_percent || '');
    
    params.append('coarse_gravel_percent_2', formData.coarse_gravel_percent_2 || '');
    params.append('fine_gravel_percent_2', formData.fine_gravel_percent_2 || '');
    params.append('coarse_sand_percent_2', formData.coarse_sand_percent_2 || '');
    params.append('medium_sand_percent_2', formData.medium_sand_percent_2 || '');
    params.append('fine_sand_percent_2', formData.fine_sand_percent_2 || '');
    params.append('silt_clay_percent_2', formData.silt_clay_percent_2 || '');
    
    // Verification
    params.append('tested_by_name', formData.tested_by_name || '');
    params.append('tested_by_date', formData.tested_by_date || '');
    params.append('checked_by_name', formData.checked_by_name || '');
    params.append('checked_by_date', formData.checked_by_date || '');
    params.append('verified_by_name', formData.verified_by_name || '');
    params.append('verified_by_date', formData.verified_by_date || '');
    params.append('authorized_by', formData.authorized_by || 'Prakarsh Sangave');
    params.append('date_of_report', new Date().toISOString().split('T')[0]);
    
    // Redirect to Grain Size Analysis report page
    const reportUrl = `/GrainSizeAnalysisReport.html?${params.toString()}`;
    window.open(reportUrl, '_blank');
  };

  const handleSaveTestDataForm4 = () => {
    // Create URL parameters from form data for Liquid Limit Test
    const params = new URLSearchParams();
    
    // General Information
    params.append('sample_description', formData.sample_description || '');
    params.append('date_of_receipt', formData.date_of_receipt || '');
    params.append('sample_test_code', formData.sample_test_code || '');
    params.append('date_of_testing', formData.date_of_testing || '');
    params.append('quantity', formData.quantity || '');
    params.append('sample_condition', formData.sample_condition || '');
    params.append('test_method', formData.test_method || 'IS 2720 (PART 5)-1985');
    
    // Liquid Limit Determination Data
    params.append('no_of_blows_1', formData.no_of_blows_1 || '');
    params.append('no_of_blows_2', formData.no_of_blows_2 || '');
    params.append('no_of_blows_3', formData.no_of_blows_3 || '');
    params.append('no_of_blows_4', formData.no_of_blows_4 || '');
    params.append('no_of_blows_5', formData.no_of_blows_5 || '');
    
    params.append('container_no_1', formData.container_no_1 || '');
    params.append('container_no_2', formData.container_no_2 || '');
    params.append('container_no_3', formData.container_no_3 || '');
    params.append('container_no_4', formData.container_no_4 || '');
    params.append('container_no_5', formData.container_no_5 || '');
    
    params.append('wt_container_1', formData.wt_container_1 || '');
    params.append('wt_container_2', formData.wt_container_2 || '');
    params.append('wt_container_3', formData.wt_container_3 || '');
    params.append('wt_container_4', formData.wt_container_4 || '');
    params.append('wt_container_5', formData.wt_container_5 || '');
    
    params.append('wt_container_wet_soil_1', formData.wt_container_wet_soil_1 || '');
    params.append('wt_container_wet_soil_2', formData.wt_container_wet_soil_2 || '');
    params.append('wt_container_wet_soil_3', formData.wt_container_wet_soil_3 || '');
    params.append('wt_container_wet_soil_4', formData.wt_container_wet_soil_4 || '');
    params.append('wt_container_wet_soil_5', formData.wt_container_wet_soil_5 || '');
    
    params.append('wt_container_dry_soil_1', formData.wt_container_dry_soil_1 || '');
    params.append('wt_container_dry_soil_2', formData.wt_container_dry_soil_2 || '');
    params.append('wt_container_dry_soil_3', formData.wt_container_dry_soil_3 || '');
    params.append('wt_container_dry_soil_4', formData.wt_container_dry_soil_4 || '');
    params.append('wt_container_dry_soil_5', formData.wt_container_dry_soil_5 || '');
    
    params.append('wt_water_1', formData.wt_water_1 || '');
    params.append('wt_water_2', formData.wt_water_2 || '');
    params.append('wt_water_3', formData.wt_water_3 || '');
    params.append('wt_water_4', formData.wt_water_4 || '');
    params.append('wt_water_5', formData.wt_water_5 || '');
    
    params.append('wt_dry_soil_1', formData.wt_dry_soil_1 || '');
    params.append('wt_dry_soil_2', formData.wt_dry_soil_2 || '');
    params.append('wt_dry_soil_3', formData.wt_dry_soil_3 || '');
    params.append('wt_dry_soil_4', formData.wt_dry_soil_4 || '');
    params.append('wt_dry_soil_5', formData.wt_dry_soil_5 || '');
    
    params.append('moisture_content_1', formData.moisture_content_1 || '');
    params.append('moisture_content_2', formData.moisture_content_2 || '');
    params.append('moisture_content_3', formData.moisture_content_3 || '');
    params.append('moisture_content_4', formData.moisture_content_4 || '');
    params.append('moisture_content_5', formData.moisture_content_5 || '');
    
    // Final Result
    params.append('liquid_limit', formData.liquid_limit || '');
    
    // Verification
    params.append('tested_by_name', formData.tested_by_name || '');
    params.append('tested_by_date', formData.tested_by_date || '');
    params.append('checked_by_name', formData.checked_by_name || '');
    params.append('checked_by_date', formData.checked_by_date || '');
    params.append('verified_by_name', formData.verified_by_name || '');
    params.append('verified_by_date', formData.verified_by_date || '');
    params.append('authorized_by', formData.authorized_by || 'Prakarsh Sangave');
    params.append('date_of_report', new Date().toISOString().split('T')[0]);
    
    // Redirect to Liquid Limit report page
    const reportUrl = `/LiquidLimitReport.html?${params.toString()}`;
    window.open(reportUrl, '_blank');
  };

  const handleSaveTestDataForm5 = () => {
    // Create URL parameters from form data for Plastic Limit Test
    const params = new URLSearchParams();
    
    // General Information
    params.append('sample_description', formData.sample_description || '');
    params.append('date_of_receipt', formData.date_of_receipt || '');
    params.append('sample_test_code', formData.sample_test_code || '');
    params.append('date_of_testing', formData.date_of_testing || '');
    params.append('quantity', formData.quantity || '');
    params.append('sample_condition', formData.sample_condition || '');
    params.append('test_method', formData.test_method || 'IS 2720 (PART-5)-1985');
    
    // Plastic Limit Test Data
    params.append('plastic_container_no_1', formData.plastic_container_no_1 || '');
    params.append('plastic_container_no_2', formData.plastic_container_no_2 || '');
    params.append('plastic_container_no_3', formData.plastic_container_no_3 || '');
    params.append('plastic_container_no_4', formData.plastic_container_no_4 || '');
    params.append('plastic_container_no_5', formData.plastic_container_no_5 || '');
    
    params.append('plastic_wt_container_1', formData.plastic_wt_container_1 || '');
    params.append('plastic_wt_container_2', formData.plastic_wt_container_2 || '');
    params.append('plastic_wt_container_3', formData.plastic_wt_container_3 || '');
    params.append('plastic_wt_container_4', formData.plastic_wt_container_4 || '');
    params.append('plastic_wt_container_5', formData.plastic_wt_container_5 || '');
    
    params.append('plastic_wt_container_wet_soil_1', formData.plastic_wt_container_wet_soil_1 || '');
    params.append('plastic_wt_container_wet_soil_2', formData.plastic_wt_container_wet_soil_2 || '');
    params.append('plastic_wt_container_wet_soil_3', formData.plastic_wt_container_wet_soil_3 || '');
    params.append('plastic_wt_container_wet_soil_4', formData.plastic_wt_container_wet_soil_4 || '');
    params.append('plastic_wt_container_wet_soil_5', formData.plastic_wt_container_wet_soil_5 || '');
    
    params.append('plastic_wt_container_dry_soil_1', formData.plastic_wt_container_dry_soil_1 || '');
    params.append('plastic_wt_container_dry_soil_2', formData.plastic_wt_container_dry_soil_2 || '');
    params.append('plastic_wt_container_dry_soil_3', formData.plastic_wt_container_dry_soil_3 || '');
    params.append('plastic_wt_container_dry_soil_4', formData.plastic_wt_container_dry_soil_4 || '');
    params.append('plastic_wt_container_dry_soil_5', formData.plastic_wt_container_dry_soil_5 || '');
    
    params.append('plastic_wt_water_1', formData.plastic_wt_water_1 || '');
    params.append('plastic_wt_water_2', formData.plastic_wt_water_2 || '');
    params.append('plastic_wt_water_3', formData.plastic_wt_water_3 || '');
    params.append('plastic_wt_water_4', formData.plastic_wt_water_4 || '');
    params.append('plastic_wt_water_5', formData.plastic_wt_water_5 || '');
    
    params.append('plastic_wt_dry_soil_1', formData.plastic_wt_dry_soil_1 || '');
    params.append('plastic_wt_dry_soil_2', formData.plastic_wt_dry_soil_2 || '');
    params.append('plastic_wt_dry_soil_3', formData.plastic_wt_dry_soil_3 || '');
    params.append('plastic_wt_dry_soil_4', formData.plastic_wt_dry_soil_4 || '');
    params.append('plastic_wt_dry_soil_5', formData.plastic_wt_dry_soil_5 || '');
    
    params.append('plastic_moisture_content_1', formData.plastic_moisture_content_1 || '');
    params.append('plastic_moisture_content_2', formData.plastic_moisture_content_2 || '');
    params.append('plastic_moisture_content_3', formData.plastic_moisture_content_3 || '');
    params.append('plastic_moisture_content_4', formData.plastic_moisture_content_4 || '');
    params.append('plastic_moisture_content_5', formData.plastic_moisture_content_5 || '');
    
    // Final Results
    params.append('plastic_limit', formData.plastic_limit || '');
    params.append('plastic_index', formData.plastic_index || '');
    
    // Verification
    params.append('tested_by_name', formData.tested_by_name || '');
    params.append('tested_by_date', formData.tested_by_date || '');
    params.append('checked_by_name', formData.checked_by_name || '');
    params.append('checked_by_date', formData.checked_by_date || '');
    params.append('verified_by_name', formData.verified_by_name || '');
    params.append('verified_by_date', formData.verified_by_date || '');
    params.append('authorized_by', formData.authorized_by || 'Prakarsh Sangave');
    params.append('date_of_report', new Date().toISOString().split('T')[0]);
    
    // Redirect to Plastic Limit report page
    const reportUrl = `/PlasticLimitReport.html?${params.toString()}`;
    window.open(reportUrl, '_blank');
  };

  const handleSaveTestDataForm6 = () => {
    // Create URL parameters from form data for Water Content Test
    const params = new URLSearchParams();
    
    // General Information
    params.append('sample_description', formData.sample_description || '');
    params.append('date_of_receipt', formData.date_of_receipt || '');
    params.append('sample_test_code', formData.sample_test_code || '');
    params.append('date_of_testing', formData.date_of_testing || '');
    params.append('quantity', formData.quantity || '');
    params.append('sample_condition', formData.sample_condition || '');
    params.append('test_method', formData.test_method || 'IS 2720 (PART 2)-1973');
    
    // Water Content Test Data
    params.append('water_container_no', formData.water_container_no || '');
    params.append('water_mass_container', formData.water_mass_container || '');
    params.append('water_mass_container_wet_soil', formData.water_mass_container_wet_soil || '');
    params.append('water_mass_container_dry_soil', formData.water_mass_container_dry_soil || '');
    params.append('water_mass_moisture', formData.water_mass_moisture || '');
    params.append('water_mass_dry_soil', formData.water_mass_dry_soil || '');
    params.append('water_content_percentage', formData.water_content_percentage || '');
    
    // Verification
    params.append('tested_by_name', formData.tested_by_name || '');
    params.append('tested_by_date', formData.tested_by_date || '');
    params.append('checked_by_name', formData.checked_by_name || '');
    params.append('checked_by_date', formData.checked_by_date || '');
    params.append('verified_by_name', formData.verified_by_name || '');
    params.append('verified_by_date', formData.verified_by_date || '');
    params.append('authorized_by', formData.authorized_by || 'Prakarsh Sangave');
    params.append('date_of_report', new Date().toISOString().split('T')[0]);
    
    // Redirect to Water Content report page
    const reportUrl = `/WaterContentReport.html?${params.toString()}`;
    window.open(reportUrl, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div>
      {/* Header Container Box */}
      <div style={{ backgroundColor: 'var(--vitrag-brown)', padding: '2rem 0', borderRadius: '15px' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faSeedling} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />
                <div>
                  <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}>
                    Soil Testing - {currentTest}
                  </h1>
                  <p className="mb-0 mt-2" style={{ color: 'white' }}>
                    {testTitles[currentTest]}
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="light" className="btn-vitrag-primary" onClick={() => navigate('/other-services')}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to Other Services
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Form onSubmit={handleSubmit}>
          {/* Form Navigation */}
          <Row className="mb-2">
            <Col>
              <Card style={{ border: 'none' }}>
                <Card.Body className="py-2">
                  <div className="d-flex justify-content-center">
                    {selectedTests.includes('compactionTest') && (
                      <Button
                        variant={currentTest === 1 ? "primary" : "outline-primary"}
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
                        onClick={() => setCurrentTest(1)}
                      >
                        1
                      </Button>
                    )}
                    {selectedTests.includes('freeSwellIndex') && (
                      <Button
                        variant={currentTest === 2 ? "primary" : "outline-primary"}
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
                        onClick={() => setCurrentTest(2)}
                      >
                        2
                      </Button>
                    )}
                    {selectedTests.includes('grainSizeAnalysis') && (
                      <Button
                        variant={currentTest === 3 ? "primary" : "outline-primary"}
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
                        onClick={() => setCurrentTest(3)}
                      >
                        3
                      </Button>
                    )}
                    {selectedTests.includes('liquidLimit') && (
                      <Button
                        variant={currentTest === 4 ? "primary" : "outline-primary"}
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
                        onClick={() => setCurrentTest(4)}
                      >
                        4
                      </Button>
                    )}
                    {selectedTests.includes('plasticLimit') && (
                      <Button
                        variant={currentTest === 5 ? "primary" : "outline-primary"}
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
                        onClick={() => setCurrentTest(5)}
                      >
                        5
                      </Button>
                    )}
                    {selectedTests.includes('waterContent') && (
                      <Button
                        variant={currentTest === 6 ? "primary" : "outline-primary"}
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
                        onClick={() => setCurrentTest(6)}
                      >
                        6
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
              {currentTest === 1 && selectedTests.includes('compactionTest') && <Form1CompactionTest formData={formData} handleInputChange={handleInputChange} />}
              {currentTest === 2 && selectedTests.includes('freeSwellIndex') && <Form2FreeSwellIndex formData={formData} handleInputChange={handleInputChange} />}
              {currentTest === 3 && selectedTests.includes('grainSizeAnalysis') && <Form3GrainSizeAnalysis formData={formData} handleInputChange={handleInputChange} />}
              {currentTest === 4 && selectedTests.includes('liquidLimit') && <Form4LiquidLimit formData={formData} handleInputChange={handleInputChange} />}
              {currentTest === 5 && selectedTests.includes('plasticLimit') && <Form5PlasticLimit formData={formData} handleInputChange={handleInputChange} />}
              {currentTest === 6 && selectedTests.includes('waterContent') && <Form6WaterContent formData={formData} handleInputChange={handleInputChange} />}
            </>
          )}

          {/* Verification, Remarks, and Reviewed By */}
          {renderVerification()}
          {renderRemarks()}
          {renderReviewedBy()}

          {/* Submit Buttons */}
          <Row>
            <Col className="text-center">
              <div className="d-grid gap-2 d-md-block">
                <Button variant="secondary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={() => navigate('/other-services')}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Cancel
                </Button>
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
                {currentTest === 1 && selectedTests.includes('compactionTest') ? (
                  <Button variant="primary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={handleSaveTestData}>
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Save and Next
                  </Button>
                ) : currentTest === 2 && selectedTests.includes('freeSwellIndex') ? (
                  <Button variant="primary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={handleSaveTestDataForm2}>
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Save and Next
                  </Button>
                ) : currentTest === 3 && selectedTests.includes('grainSizeAnalysis') ? (
                  <Button variant="primary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={handleSaveTestDataForm3}>
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Save and Next
                  </Button>
                ) : currentTest === 4 && selectedTests.includes('liquidLimit') ? (
                  <Button variant="primary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={handleSaveTestDataForm4}>
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Save and Next
                  </Button>
                ) : currentTest === 5 && selectedTests.includes('plasticLimit') ? (
                  <Button variant="primary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={handleSaveTestDataForm5}>
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Save and Next
                  </Button>
                ) : currentTest === 6 && selectedTests.includes('waterContent') ? (
                  <Button variant="primary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={handleSaveTestDataForm6}>
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Save and Next
                  </Button>
                ) : currentTest < 6 ? (
                  <Button variant="primary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={() => setCurrentTest(currentTest + 1)}>
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
      </Container>
    </div>
  );
};

export default SoilTestingForm;
