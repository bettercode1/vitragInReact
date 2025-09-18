import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faIndustry, 
  faArrowLeft, 
  faSave, 
  faTimes, 
  faMagic,
  faInfoCircle,
  faTable,
  faUserCheck,
  faComment
} from '@fortawesome/free-solid-svg-icons';

const CementTestingForm = () => {
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
      if (location.state.selectedTests.includes('fineness')) {
        setCurrentTest(1);
      } else if (location.state.selectedTests.includes('consistency')) {
        setCurrentTest(2);
      } else if (location.state.selectedTests.includes('settingTime')) {
        setCurrentTest(3);
      } else if (location.state.selectedTests.includes('soundness')) {
        setCurrentTest(4);
      } else if (location.state.selectedTests.includes('compressiveStrength')) {
        setCurrentTest(5);
      }
    } else {
      // Default to all tests if no selection made
      setSelectedTests(['fineness', 'consistency', 'settingTime', 'soundness', 'compressiveStrength']);
      setCurrentTest(1);
    }
  }, [location.state]);

  const [formData, setFormData] = useState({
    // General Information
    customer_id: '',
    sample_description: '',
    date_of_receipt: '',
    cement_type: '',
    test_method: '',
    sample_test_code: '',
    date_of_testing: new Date().toISOString().split('T')[0],
    cement_grade: '',
    environmental_conditions: 'Laboratory Conditions, Temperature: 27±2°C, RH: 65±5%',
    
    // Test Report Details
    customer_site_address: '',
    date_of_report: '',
    reference_number: '',
    date_of_material_receipt: '',
    type_grade_cement: '',
    url_number: '',
    job_code_number: '',
    period_of_testing: '',
    condition_of_sample: '',
    location_of_testing: '',
    
    // Test 1: Specific Gravity
    liquid_taken_01: '', specific_gravity_liquid_01: '', weight_cement_01: '', initial_reading_01: '', final_reading_01: '',
    liquid_taken_02: '', specific_gravity_liquid_02: '', weight_cement_02: '', initial_reading_02: '', final_reading_02: '',
    avg_combined: '',
    
    // Test 2: Soundness
    distance_27c_01: '', distance_boiler_01: '', expansion_01: '',
    distance_27c_02: '', distance_boiler_02: '', expansion_02: '',
    distance_27c_03: '', distance_boiler_03: '', expansion_03: '',
    distance_27c_04: '', distance_boiler_04: '', expansion_04: '',
    distance_27c_05: '', distance_boiler_05: '', expansion_05: '',
    avg_soundness: '',
    
    // Test 3: Fineness
    cement_weight_01: '', residue_weight_01: '', mass_percentage_01: '',
    cement_weight_02: '', residue_weight_02: '', mass_percentage_02: '',
    cement_weight_03: '', residue_weight_03: '', mass_percentage_03: '',
    avg_residue: '',
    
    // Form-5 fields (copied from AACBlocksForm)
    block_id_1: '', length_1: '', breadth_1: '', height_1: '', area_1: '', weight_1: '', density_1: '', load_max_1: '', compressive_strength_1: '',
    block_id_2: '', length_2: '', breadth_2: '', height_2: '', area_2: '', weight_2: '', density_2: '', load_max_2: '', compressive_strength_2: '',
    block_id_3: '', length_3: '', breadth_3: '', height_3: '', area_3: '', weight_3: '', density_3: '', load_max_3: '', compressive_strength_3: '',
    avg_load_max: '', avg_compressive_strength: '',
    
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

  const allTestTypes = [
    { id: 1, title: 'Fineness', description: 'Determination of Fineness of Cement by Dry Sieving', testId: 'fineness' },
    { id: 2, title: 'Consistency', description: 'Determination of Consistency of Standard Cement Paste also Initial and Final Setting Time', testId: 'consistency' },
    { id: 3, title: 'Setting Time', description: 'Determination of Initial and Final Setting Time of Cement', testId: 'settingTime' },
    { id: 4, title: 'Soundness', description: 'Determination of Soundness of Cement by Le-Chatelier Method', testId: 'soundness' },
    { id: 5, title: 'Compressive Strength', description: 'Determination of Compressive Strength of Cement', testId: 'compressiveStrength' }
  ];

  // Filter test types based on selected tests
  const testTypes = allTestTypes.filter(test => selectedTests.includes(test.testId));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateSpecificGravityAverages = () => {
    const values = [
      formData.liquid_taken_01, formData.specific_gravity_liquid_01, formData.weight_cement_01, formData.initial_reading_01, formData.final_reading_01,
      formData.liquid_taken_02, formData.specific_gravity_liquid_02, formData.weight_cement_02, formData.initial_reading_02, formData.final_reading_02
    ];
    
    const sum = values.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    const average = sum / 10;
    
    setFormData(prev => ({
      ...prev,
      avg_combined: average.toFixed(3)
    }));
  };

  const calculateSoundnessAverages = () => {
    let totalExpansion = 0;
    let validTests = 0;
    
    for (let i = 1; i <= 5; i++) {
      const distance27c = parseFloat(formData[`distance_27c_0${i}`]) || 0;
      const distanceBoiler = parseFloat(formData[`distance_boiler_0${i}`]) || 0;
      const expansion = distanceBoiler - distance27c;
      
      if (expansion !== 0) {
        totalExpansion += expansion;
        validTests++;
      }
    }
    
    const avgSoundness = validTests > 0 ? totalExpansion / validTests : 0;
    
    setFormData(prev => ({
      ...prev,
      avg_soundness: avgSoundness.toFixed(2)
    }));
  };

  const calculateFinenessAverages = () => {
    let totalPercentage = 0;
    let validTests = 0;
    
    for (let i = 1; i <= 3; i++) {
      const cementWeight = parseFloat(formData[`cement_weight_0${i}`]) || 0;
      const residueWeight = parseFloat(formData[`residue_weight_0${i}`]) || 0;
      
      if (cementWeight > 0) {
        const massPercentage = (residueWeight / cementWeight) * 100;
        totalPercentage += massPercentage;
        validTests++;
      }
    }
    
    const avgResidue = validTests > 0 ? totalPercentage / validTests : 0;
    
    setFormData(prev => ({
      ...prev,
      avg_residue: avgResidue.toFixed(2)
    }));
  };

  // Functions for Form-5 (copied from AACBlocksForm)
  const calculateArea = (row) => {
    const length = parseFloat(formData[`length_${row}`]) || 0;
    const breadth = parseFloat(formData[`breadth_${row}`]) || 0;
    const area = length * breadth;
    
    setFormData(prev => ({
      ...prev,
      [`area_${row}`]: area.toFixed(2)
    }));
  };

  const calculateDensity = (row) => {
    const length = parseFloat(formData[`length_${row}`]) || 0;
    const breadth = parseFloat(formData[`breadth_${row}`]) || 0;
    const height = parseFloat(formData[`height_${row}`]) || 0;
    const weight = parseFloat(formData[`weight_${row}`]) || 0;
    
    if (length > 0 && breadth > 0 && height > 0 && weight > 0) {
      const volume = (length * breadth * height) / 1000000; // Convert mm³ to m³
      const density = weight / volume;
      
      setFormData(prev => ({
        ...prev,
        [`density_${row}`]: density.toFixed(1)
      }));
    }
  };

  const calculateAverages = () => {
    const loadMaxValues = [1, 2, 3].map(row => parseFloat(formData[`load_max_${row}`]) || 0);
    const compressiveStrengthValues = [1, 2, 3].map(row => parseFloat(formData[`compressive_strength_${row}`]) || 0);
    
    const avgLoadMax = loadMaxValues.reduce((acc, val) => acc + val, 0) / 3;
    const avgCompressiveStrength = compressiveStrengthValues.reduce((acc, val) => acc + val, 0) / 3;
    
    setFormData(prev => ({
      ...prev,
      avg_load_max: avgLoadMax.toFixed(1),
      avg_compressive_strength: avgCompressiveStrength.toFixed(2)
    }));
  };

  const fillRandomData = () => {
    if (window.confirm('This will fill all fields with sample data. Continue?')) {
      const today = new Date();
      const randomData = {
        sample_description: 'Portland Cement sample for comprehensive testing - OPC 43 Grade',
        date_of_receipt: today.toISOString().split('T')[0],
        cement_type: 'Ordinary Portland Cement (OPC)',
        test_method: 'IS 4031 (Part 1) - 1996',
        sample_test_code: 'CT-2024-001',
        cement_grade: '43 Grade',
        customer_site_address: 'ABC Construction Site, Plot No. 123, Industrial Area, Mumbai - 400001',
        url_number: 'URL-2024-001',
        job_code_number: 'JOB-2024-001',
        period_of_testing: '28 days',
        condition_of_sample: 'As Received',
        location_of_testing: 'Laboratory',
        tested_by_name: 'John Doe',
        checked_by_name: 'Jane Smith',
        remarks: 'Sample data filled for testing purposes. All measurements are approximate and should be replaced with actual test data.'
      };
      
      // Fill test 1 data
      randomData.liquid_taken_01 = (0.5 + Math.random() * 0.1).toFixed(3);
      randomData.specific_gravity_liquid_01 = (1.0 + Math.random() * 0.1).toFixed(3);
      randomData.weight_cement_01 = (50 + Math.random() * 10).toFixed(3);
      randomData.initial_reading_01 = (20 + Math.random() * 5).toFixed(1);
      randomData.final_reading_01 = (25 + Math.random() * 5).toFixed(1);
      
      randomData.liquid_taken_02 = (0.5 + Math.random() * 0.1).toFixed(3);
      randomData.specific_gravity_liquid_02 = (1.0 + Math.random() * 0.1).toFixed(3);
      randomData.weight_cement_02 = (50 + Math.random() * 10).toFixed(3);
      randomData.initial_reading_02 = (20 + Math.random() * 5).toFixed(1);
      randomData.final_reading_02 = (25 + Math.random() * 5).toFixed(1);
      
      // Fill test 2 data
      for (let i = 1; i <= 5; i++) {
        randomData[`distance_27c_0${i}`] = (10 + Math.random() * 2).toFixed(2);
        randomData[`distance_boiler_0${i}`] = (12 + Math.random() * 2).toFixed(2);
      }
      
      // Fill test 3 data
      for (let i = 1; i <= 3; i++) {
        randomData[`cement_weight_0${i}`] = (100 + Math.random() * 10).toFixed(3);
        randomData[`residue_weight_0${i}`] = (5 + Math.random() * 2).toFixed(3);
      }
      
      setFormData(prev => ({ ...prev, ...randomData }));
      
      setTimeout(() => {
        calculateSpecificGravityAverages();
        calculateSoundnessAverages();
        calculateFinenessAverages();
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
    alert('Test data saved successfully!');
    setShowPreview(false);
  };

  const handleEditForm = () => {
    setShowPreview(false);
  };

  const renderTestNavigation = () => (
    <Row className="mb-2">
      <Col>
        <Card style={{ border: 'none' }}>
          <Card.Body className="py-2">
            <div className="d-flex justify-content-center">
              {testTypes.map((test) => (
                <Button
                  key={test.id}
                  variant={currentTest === test.id ? "primary" : "outline-primary"}
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
                  onClick={() => setCurrentTest(test.id)}
                >
                  {test.id}
                </Button>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderTest1SpecificGravity = () => (
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
                    <th style={{ width: '350px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Number of Tests</th>
                    <th style={{ width: '120px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>01</th>
                    <th style={{ width: '120px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>02</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Liquid taken for determination of specific gravity</td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control size="sm" type="number" step="0.001" name="liquid_taken_01" value={formData.liquid_taken_01} onChange={(e) => { handleInputChange(e); setTimeout(calculateSpecificGravityAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                    </td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control size="sm" type="number" step="0.001" name="liquid_taken_02" value={formData.liquid_taken_02} onChange={(e) => { handleInputChange(e); setTimeout(calculateSpecificGravityAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Specific Gravity of the liquid</td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control size="sm" type="number" step="0.001" name="specific_gravity_liquid_01" value={formData.specific_gravity_liquid_01} onChange={(e) => { handleInputChange(e); setTimeout(calculateSpecificGravityAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                    </td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control size="sm" type="number" step="0.001" name="specific_gravity_liquid_02" value={formData.specific_gravity_liquid_02} onChange={(e) => { handleInputChange(e); setTimeout(calculateSpecificGravityAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Weight of cement taken for determination of specific gravity</td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control size="sm" type="number" step="0.001" name="weight_cement_01" value={formData.weight_cement_01} onChange={(e) => { handleInputChange(e); setTimeout(calculateSpecificGravityAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                    </td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control size="sm" type="number" step="0.001" name="weight_cement_02" value={formData.weight_cement_02} onChange={(e) => { handleInputChange(e); setTimeout(calculateSpecificGravityAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Initial Reading on the flask</td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control size="sm" type="number" step="0.1" name="initial_reading_01" value={formData.initial_reading_01} onChange={(e) => { handleInputChange(e); setTimeout(calculateSpecificGravityAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                    </td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control size="sm" type="number" step="0.1" name="initial_reading_02" value={formData.initial_reading_02} onChange={(e) => { handleInputChange(e); setTimeout(calculateSpecificGravityAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Final Reading on the flask after cement is added</td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control size="sm" type="number" step="0.1" name="final_reading_01" value={formData.final_reading_01} onChange={(e) => { handleInputChange(e); setTimeout(calculateSpecificGravityAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                    </td>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                      <Form.Control size="sm" type="number" step="0.1" name="final_reading_02" value={formData.final_reading_02} onChange={(e) => { handleInputChange(e); setTimeout(calculateSpecificGravityAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                    </td>
                  </tr>
                  <tr className="table-info">
                    <td className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', fontSize: '1.1rem' }}>Average</td>
                    <td colSpan="2" className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}>
                      <Form.Control size="sm" type="number" step="0.001" name="avg_combined" value={formData.avg_combined} readOnly className="average-input-transparent" style={{ fontSize: '0.8rem', backgroundColor: 'var(--bs-dark)', background: 'var(--bs-dark)', backgroundImage: 'none', border: '1px solid var(--bs-gray-700)', color: '#ffffff', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', boxShadow: 'none', outline: 'none' }} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderTest2Soundness = () => (
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
                    <th style={{ width: '50%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Number of Tests</th>
                    <th style={{ width: '10%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>01</th>
                    <th style={{ width: '10%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>02</th>
                    <th style={{ width: '10%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>03</th>
                    <th style={{ width: '10%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>04</th>
                    <th style={{ width: '10%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>05</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>(A) Distance between the indicator points keeping @ 27 ± 2°C for 24 hours (mm)</td>
                    {[1,2,3,4,5].map(i => (
                      <td key={i} style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                        <Form.Control size="sm" type="number" step="0.01" name={`distance_27c_0${i}`} value={formData[`distance_27c_0${i}`]} onChange={(e) => { handleInputChange(e); setTimeout(calculateSoundnessAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>(B) Distance between the indicator points after boiler for 3 hours (mm)</td>
                    {[1,2,3,4,5].map(i => (
                      <td key={i} style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                        <Form.Control size="sm" type="number" step="0.01" name={`distance_boiler_0${i}`} value={formData[`distance_boiler_0${i}`]} onChange={(e) => { handleInputChange(e); setTimeout(calculateSoundnessAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Expansion of Cement (B - A) (mm)</td>
                    {[1,2,3,4,5].map(i => (
                      <td key={i} style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                        <Form.Control size="sm" type="number" step="0.01" name={`expansion_0${i}`} value={formData[`expansion_0${i}`]} readOnly style={{ fontSize: '0.8rem' }} />
                      </td>
                    ))}
                  </tr>
                  <tr className="table-info">
                    <td className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', fontSize: '1.1rem' }}>Average Soundness of Cement</td>
                    <td colSpan="5" className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}>
                      <Form.Control size="sm" type="number" step="0.01" name="avg_soundness" value={formData.avg_soundness} readOnly className="average-input-transparent" style={{ fontSize: '0.8rem', backgroundColor: 'var(--bs-dark)', background: 'var(--bs-dark)', backgroundImage: 'none', border: '1px solid var(--bs-gray-700)', color: '#ffffff', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', boxShadow: 'none', outline: 'none' }} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderTest3Fineness = () => (
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
                    <th style={{ width: '60%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Number of Tests</th>
                    <th style={{ width: '13.33%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>01</th>
                    <th style={{ width: '13.33%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>02</th>
                    <th style={{ width: '13.33%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>03</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Weight of Cement sample taken</td>
                    {[1,2,3].map(i => (
                      <td key={i} style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                        <Form.Control size="sm" type="number" step="0.001" name={`cement_weight_0${i}`} value={formData[`cement_weight_0${i}`]} onChange={(e) => { handleInputChange(e); setTimeout(calculateFinenessAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Weight of Residue on 90 micron sieve</td>
                    {[1,2,3].map(i => (
                      <td key={i} style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                        <Form.Control size="sm" type="number" step="0.001" name={`residue_weight_0${i}`} value={formData[`residue_weight_0${i}`]} onChange={(e) => { handleInputChange(e); setTimeout(calculateFinenessAverages, 0); }} style={{ fontSize: '0.8rem' }} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Percentage of Mass Retained on 90 micron sieve</td>
                    {[1,2,3].map(i => (
                      <td key={i} style={{ padding: '6px', border: '1px solid #dee2e6' }}>
                        <Form.Control size="sm" type="number" step="0.01" name={`mass_percentage_0${i}`} value={formData[`mass_percentage_0${i}`]} readOnly style={{ fontSize: '0.8rem' }} />
                      </td>
                    ))}
                  </tr>
                  <tr className="table-info">
                    <td className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', fontSize: '1.1rem' }}>Average of Residue</td>
                    <td colSpan="3" className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}>
                      <Form.Control size="sm" type="number" step="0.01" name="avg_residue" value={formData.avg_residue} readOnly className="average-input-transparent" style={{ fontSize: '0.8rem', backgroundColor: 'var(--bs-dark)', background: 'var(--bs-dark)', backgroundImage: 'none', border: '1px solid var(--bs-gray-700)', color: '#ffffff', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', boxShadow: 'none', outline: 'none' }} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderCurrentTest = () => {
    switch (currentTest) {
      case 1:
        return renderTest1SpecificGravity();
      case 2:
        return renderTest2Soundness();
      case 3:
        return renderTest3Fineness();
      case 4:
        return (
          <Row className="mb-4">
            <Col>
              <Card className="card-vitrag shadow-sm">
                <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                  <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                    <FontAwesomeIcon icon={faTable} className="me-2" />
                    Test Results - Consistency
                  </h5>
                </Card.Header>
                <Card.Body>
                  {/* Section 1: Standard Consistency Test */}
                  <div className="mb-4">
                    <h6 className="fw-bold text-primary mb-3">1. Standard Consistency Test - (IS 4031 (Part 4))</h6>
                    <div className="table-responsive">
                      <table className="table transparent-table" style={{ fontSize: '0.9rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                        <thead className="table-dark">
                          <tr>
                            <th style={{ width: '15%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Sr. No</th>
                            <th style={{ width: '25%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Weight of Cement (gm)</th>
                            <th style={{ width: '20%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>% of Water</th>
                            <th style={{ width: '25%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Height of Penetrated (mm)</th>
                            <th style={{ width: '15%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Standard Consistency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[1, 2, 3].map((row) => (
                            <tr key={row}>
                              <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{row}</td>
                              <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  step="0.001"
                                  name={`cement_weight_consistency_${row}`}
                                  value={formData[`cement_weight_consistency_${row}`] || ''}
                                  onChange={handleInputChange}
                                  style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                />
                              </td>
                              <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  step="0.1"
                                  name={`water_percentage_${row}`}
                                  value={formData[`water_percentage_${row}`] || ''}
                                  onChange={handleInputChange}
                                  style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                />
                              </td>
                              <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  step="0.1"
                                  name={`penetration_height_${row}`}
                                  value={formData[`penetration_height_${row}`] || ''}
                                  onChange={handleInputChange}
                                  style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                />
                              </td>
                              <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                <Form.Control
                                  size="sm"
                                  type="text"
                                  name={`standard_consistency_${row}`}
                                  value={formData[`standard_consistency_${row}`] || ''}
                                  readOnly
                                  style={{ fontSize: '0.8rem', textAlign: 'center', backgroundColor: 'rgba(108, 117, 125, 0.1)' }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 2: Initial and Final Setting Time */}
                  <div className="mb-4">
                    <h6 className="fw-bold text-primary mb-3">2. Initial and Final Setting Time - IS 4031 (Part 5)</h6>
                    
                    {/* Subsection I: Initial Setting Time */}
                    <div className="mb-4">
                      <h6 className="fw-bold text-white mb-3">I) Initial Setting Time</h6>
                      
                      {/* Weight Input Fields */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Weight of Cement Taken (A)</Form.Label>
                            <Form.Control
                              size="sm"
                              type="number"
                              step="0.001"
                              name="initial_cement_weight"
                              value={formData.initial_cement_weight || ''}
                              onChange={handleInputChange}
                              style={{ fontSize: '0.8rem', borderColor: 'white' }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Weight of water taken (0.85×P) (B)</Form.Label>
                            <Form.Control
                              size="sm"
                              type="number"
                              step="0.001"
                              name="initial_water_weight"
                              value={formData.initial_water_weight || ''}
                              readOnly
                              style={{ fontSize: '0.8rem', backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: 'white' }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Initial Setting Time Data Table */}
                      <div className="table-responsive">
                        <table className="table transparent-table" style={{ fontSize: '0.9rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                          <thead className="table-dark">
                            <tr>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Sr. No.</th>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Time</th>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Height of Penetrated(mm)</th>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Sr. No.</th>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Time</th>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Height of Penetrated(mm)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[1, 2, 3, 4, 5].map((row) => (
                              <tr key={row}>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{row}</td>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                  <Form.Control
                                    size="sm"
                                    type="time"
                                    name={`initial_time_${row}`}
                                    value={formData[`initial_time_${row}`] || ''}
                                    onChange={handleInputChange}
                                    style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                  />
                                </td>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                  <Form.Control
                                    size="sm"
                                    type="number"
                                    step="0.1"
                                    name={`initial_penetration_${row}`}
                                    value={formData[`initial_penetration_${row}`] || ''}
                                    onChange={handleInputChange}
                                    style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                  />
                                </td>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{row + 5}</td>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                  <Form.Control
                                    size="sm"
                                    type="time"
                                    name={`initial_time_${row + 5}`}
                                    value={formData[`initial_time_${row + 5}`] || ''}
                                    onChange={handleInputChange}
                                    style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                  />
                                </td>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                  <Form.Control
                                    size="sm"
                                    type="number"
                                    step="0.1"
                                    name={`initial_penetration_${row + 5}`}
                                    value={formData[`initial_penetration_${row + 5}`] || ''}
                                    onChange={handleInputChange}
                                    style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Observation Field for Initial Setting Time */}
                      <Form.Group className="mt-3">
                        <Form.Label>Observation Initial Setting Time</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="initial_observation"
                          value={formData.initial_observation || ''}
                          onChange={handleInputChange}
                          placeholder=""
                          style={{ fontSize: '0.8rem', borderColor: 'white' }}
                        />
                      </Form.Group>
                    </div>

                    {/* Subsection II: Final Setting Time */}
                    <div className="mb-4">
                      <h6 className="fw-bold text-white mb-3">II) Final Setting Time</h6>
                      
                      {/* Weight Input Fields */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Weight of Cement Taken (A)</Form.Label>
                            <Form.Control
                              size="sm"
                              type="number"
                              step="0.001"
                              name="final_cement_weight"
                              value={formData.final_cement_weight || ''}
                              onChange={handleInputChange}
                              style={{ fontSize: '0.8rem', borderColor: 'white' }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Weight of water taken (0.85×P) (B)</Form.Label>
                            <Form.Control
                              size="sm"
                              type="number"
                              step="0.001"
                              name="final_water_weight"
                              value={formData.final_water_weight || ''}
                              readOnly
                              style={{ fontSize: '0.8rem', backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: 'white' }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Final Setting Time Data Table */}
                      <div className="table-responsive">
                        <table className="table transparent-table" style={{ fontSize: '0.9rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                          <thead className="table-dark">
                            <tr>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Sr. No.</th>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Time</th>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Height of Penetrated(mm)</th>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Sr. No.</th>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Time</th>
                              <th style={{ width: '16.67%', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Height of Penetrated(mm)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[1, 2, 3, 4, 5].map((row) => (
                              <tr key={row}>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{row}</td>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                  <Form.Control
                                    size="sm"
                                    type="time"
                                    name={`final_time_${row}`}
                                    value={formData[`final_time_${row}`] || ''}
                                    onChange={handleInputChange}
                                    style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                  />
                                </td>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                  <Form.Control
                                    size="sm"
                                    type="number"
                                    step="0.1"
                                    name={`final_penetration_${row}`}
                                    value={formData[`final_penetration_${row}`] || ''}
                                    onChange={handleInputChange}
                                    style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                  />
                                </td>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{row + 5}</td>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                  <Form.Control
                                    size="sm"
                                    type="time"
                                    name={`final_time_${row + 5}`}
                                    value={formData[`final_time_${row + 5}`] || ''}
                                    onChange={handleInputChange}
                                    style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                  />
                                </td>
                                <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                  <Form.Control
                                    size="sm"
                                    type="number"
                                    step="0.1"
                                    name={`final_penetration_${row + 5}`}
                                    value={formData[`final_penetration_${row + 5}`] || ''}
                                    onChange={handleInputChange}
                                    style={{ fontSize: '0.8rem', textAlign: 'center' }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Observation Field for Final Setting Time */}
                      <Form.Group className="mt-3">
                        <Form.Label>Observation Final Setting Time</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="final_observation"
                          value={formData.final_observation || ''}
                          onChange={handleInputChange}
                          placeholder=""
                          style={{ fontSize: '0.8rem', borderColor: 'white' }}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      case 5:
        return (
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
                          <th colSpan="3" style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '1rem' }}>Size</th>
                          <th rowSpan="2" style={{ width: '90px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Area (mm²)</th>
                          <th rowSpan="2" style={{ width: '120px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Cube Weight (Kg)</th>
                          <th rowSpan="2" style={{ width: '120px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Density (Kg/m³)</th>
                          <th rowSpan="2" style={{ width: '120px', padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle', fontSize: '1rem' }}>Maximum Load (N)</th>
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
                          <td colSpan="7" className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', fontSize: '1.1rem' }}>Average</td>
                          <td className="text-center fw-bold" style={{ padding: '6px', border: '1px solid #dee2e6', backgroundColor: '#1C2333' }}>
                            <Form.Control className="average-input-transparent"
                              size="sm"
                              type="number"
                              step="0.1"
                              name="avg_load_max"
                              value={formData.avg_load_max}
                              readOnly
                              style={{ 
            fontSize: '0.8rem',
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
                            <Form.Control className="average-input-transparent"
                              size="sm"
                              type="number"
                              step="0.01"
                              name="avg_compressive_strength"
                              value={formData.avg_compressive_strength}
                              readOnly
                              style={{ 
            fontSize: '0.8rem',
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
        );
      default:
        return null;
    }
  };

  if (showPreview) {
    return (
      <div>
            <div style={{ backgroundColor: '#6c757d', padding: '2rem 0', borderRadius: '15px' }}>
          <Container>
            <Row className="align-items-center">
              <Col md={8}>
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faIndustry} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />
                  <div>
                    <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}>
                      Cement Testing - Preview
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
                      <p><strong>Customer:</strong> {formData.customer_id === '1' ? 'ABC Construction Ltd.' : formData.customer_id === '2' ? 'XYZ Builders' : formData.customer_id === '3' ? 'DEF Infrastructure' : formData.customer_id}</p>
                      <p><strong>Sample Description:</strong> {formData.sample_description}</p>
                      <p><strong>Date of Receipt:</strong> {formData.date_of_receipt}</p>
                      <p><strong>Cement Type:</strong> {formData.cement_type}</p>
                      <p><strong>Test Method:</strong> {formData.test_method}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Sample Test Code:</strong> {formData.sample_test_code}</p>
                      <p><strong>Date of Testing:</strong> {formData.date_of_testing}</p>
                      <p><strong>Cement Grade:</strong> {formData.cement_grade}</p>
                      <p><strong>Environmental Conditions:</strong> {formData.environmental_conditions}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

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
  }

  return (
    <div>
            <div style={{ backgroundColor: '#6c757d', padding: '2rem 0', borderRadius: '15px' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faIndustry} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />
                <div>
                  <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}>
                    Cement Testing - {currentTest}
                  </h1>
                  <p className="mb-0 mt-2" style={{ color: 'white' }}>
                    {testTypes.find(t => t.id === currentTest)?.description}
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
          {renderTestNavigation()}

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
                        <Form.Label>Customer Name *</Form.Label>
                        <Form.Select name="customer_id" value={formData.customer_id} onChange={handleInputChange} required>
                          <option value="">Select Customer</option>
                          <option value="1">ABC Construction Ltd.</option>
                          <option value="2">XYZ Builders</option>
                          <option value="3">DEF Infrastructure</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Sample Description *</Form.Label>
                        <Form.Control as="textarea" rows={3} name="sample_description" value={formData.sample_description} onChange={handleInputChange} placeholder="" required />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Receipt *</Form.Label>
                        <Form.Control type="date" name="date_of_receipt" value={formData.date_of_receipt} onChange={handleInputChange} required />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Type of Cement *</Form.Label>
                        <Form.Select name="cement_type" value={formData.cement_type} onChange={handleInputChange} required>
                          <option value="">Select Cement Type</option>
                          <option value="Ordinary Portland Cement (OPC)">Ordinary Portland Cement (OPC)</option>
                          <option value="Portland Pozzolana Cement (PPC)">Portland Pozzolana Cement (PPC)</option>
                          <option value="Portland Blast Furnace Cement (PBFC)">Portland Blast Furnace Cement (PBFC)</option>
                          <option value="Rapid Hardening Cement">Rapid Hardening Cement</option>
                          <option value="Quick Setting Cement">Quick Setting Cement</option>
                          <option value="Low Heat Cement">Low Heat Cement</option>
                          <option value="Sulfate Resisting Cement">Sulfate Resisting Cement</option>
                          <option value="White Cement">White Cement</option>
                          <option value="Colored Cement">Colored Cement</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Test Method *</Form.Label>
                        <Form.Select name="test_method" value={formData.test_method} onChange={handleInputChange} required>
                          <option value="">Select Test Method</option>
                          <option value="IS 4031 (Part 1) - 1996">IS 4031 (Part 1) - 1996</option>
                          <option value="IS 4031 (Part 2) - 1999">IS 4031 (Part 2) - 1999</option>
                          <option value="IS 4031 (Part 3) - 1988">IS 4031 (Part 3) - 1988</option>
                          <option value="IS 4031 (Part 4) - 1988">IS 4031 (Part 4) - 1988</option>
                          <option value="IS 4031 (Part 5) - 1988">IS 4031 (Part 5) - 1988</option>
                          <option value="ASTM C150">ASTM C150</option>
                          <option value="ASTM C595">ASTM C595</option>
                          <option value="BS EN 197-1">BS EN 197-1</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Sample Test Code Number *</Form.Label>
                        <Form.Control type="text" name="sample_test_code" value={formData.sample_test_code} onChange={handleInputChange} placeholder="" required />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Testing *</Form.Label>
                        <Form.Control type="date" name="date_of_testing" value={formData.date_of_testing} onChange={handleInputChange} required />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Grade of Cement *</Form.Label>
                        <Form.Select name="cement_grade" value={formData.cement_grade} onChange={handleInputChange} required>
                          <option value="">Select Grade</option>
                          <option value="33 Grade">33 Grade</option>
                          <option value="43 Grade">43 Grade</option>
                          <option value="53 Grade">53 Grade</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Environmental Conditions</Form.Label>
                        <Form.Control type="text" name="environmental_conditions" value={formData.environmental_conditions} onChange={handleInputChange} placeholder="" />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

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
            renderCurrentTest()
          )}

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
                        <Form.Control type="text" name="tested_by_name" value={formData.tested_by_name} onChange={handleInputChange} required />
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
                        <Form.Control type="text" name="checked_by_name" value={formData.checked_by_name} onChange={handleInputChange} required />
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
                    <Form.Control as="textarea" rows={4} name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="" />
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

export default CementTestingForm;
