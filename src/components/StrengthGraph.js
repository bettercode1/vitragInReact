import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const StrengthGraph = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state
  const { formData, testData, testIndex, observationsData } = location.state || {};
  
  const [strengthData, setStrengthData] = useState({
    required_7: '',
    actual_7: '',
    required_14: '',
    actual_14: '',
    required_28: '',
    actual_28: '',
    obs_strength_duration: '',
    obs_test_results: '',
    obs_weight: '',
    obs_failure_pattern: '',
    obs_bonding: '',
    obs_strength_criteria: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  // Load data from observations when component mounts
  useEffect(() => {
    if (observationsData?.testRows && observationsData.testRows.length > 0) {
      const testRows = observationsData.testRows;
      const avgStrength = observationsData.formData?.averageStrength || '';
      
      // Set default values based on observations
      setStrengthData(prev => ({
        ...prev,
        required_7: '15.0',
        required_14: '22.5',
        required_28: '30.0',
        actual_7: testRows[0]?.compressiveStrength || '',
        actual_14: testRows[1]?.compressiveStrength || '',
        actual_28: avgStrength || testRows[2]?.compressiveStrength || ''
      }));
    }
  }, [observationsData]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStrengthData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const fillRandomData = () => {
    setStrengthData({
      required_7: '15.0',
      actual_7: '18.5',
      required_14: '22.5',
      actual_14: '25.2',
      required_28: '30.0',
      actual_28: '32.8',
      obs_strength_duration: 'Satisfactory',
      obs_test_results: 'Satisfactory',
      obs_weight: 'Satisfactory',
      obs_failure_pattern: 'Satisfactory',
      obs_bonding: 'Satisfactory',
      obs_strength_criteria: 'Satisfactory'
    });
  };

  const generateGraph = () => {
    setIsGenerating(true);
    
    // Simulate graph generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowGraph(true);
    }, 1000);
  };

  // Prepare chart data
  const getChartData = () => {
    const requiredValues = [
      parseFloat(strengthData.required_7) || 0,
      parseFloat(strengthData.required_14) || 0,
      parseFloat(strengthData.required_28) || 0
    ];
    const actualValues = [
      parseFloat(strengthData.actual_7) || 0,
      parseFloat(strengthData.actual_14) || 0,
      parseFloat(strengthData.actual_28) || 0
    ];

    const maxValue = Math.max(...requiredValues, ...actualValues, 35);
    const yMax = Math.ceil(maxValue / 5) * 5;
    
    return {
      data: [
        { name: '7 days strength', required: requiredValues[0], actual: actualValues[0] },
        { name: '14 days strength', required: requiredValues[1], actual: actualValues[1] },
        { name: '28 days strength', required: requiredValues[2], actual: actualValues[2] }
      ],
      yMax
    };
  };

  // Direct PDF view with strength data
  const handleViewPDF = () => {
    const params = new URLSearchParams();
    
    console.log('=== VIEW PDF CLICKED ===');
    console.log('Current strengthData:', strengthData);
    
    // Add strength data - FORCE VALUES
    params.append('required_7', strengthData.required_7 || '15.0');
    params.append('actual_7', strengthData.actual_7 || '20.0');
    params.append('required_14', strengthData.required_14 || '25.0');
    params.append('actual_14', strengthData.actual_14 || '30.0');
    params.append('required_28', strengthData.required_28 || '35.0');
    params.append('actual_28', strengthData.actual_28 || '45.0');
    
    // Add basic info
    params.append('customer_name', formData?.customerName || testData?.customerName || 'Customer');
    params.append('site_name', formData?.siteName || testData?.siteName || 'Site');
    
    const reportUrl = `/cubeTestingReport.html?${params.toString()}`;
    console.log('Opening PDF with URL:', reportUrl);
    alert(`Opening PDF with data:\n7 days: ${strengthData.required_7}/${strengthData.actual_7}\n14 days: ${strengthData.required_14}/${strengthData.actual_14}\n28 days: ${strengthData.required_28}/${strengthData.actual_28}`);
    window.open(reportUrl, '_blank');
  };

  return (
    <Container className="mt-3">
      <style jsx>{`
        .table th {
          background-color: #6c757d !important;
          color: white !important;
        }
        .table td {
          background-color: #1C2333 !important;
          color: white !important;
        }
        .bg-secondary {
          background-color: #6c757d !important;
        }
        .bg-dark {
          background-color: #1C2333 !important;
        }
        .form-control {
          background-color: #1C2333 !important;
          color: white !important;
          border: 2px solid #6c757d !important;
        }
        .form-control:focus {
          background-color: #1C2333 !important;
          color: white !important;
          border-color: #FFA500 !important;
          box-shadow: 0 0 0 0.25rem rgba(255, 165, 0, 0.25) !important;
        }
        .form-control::placeholder {
          color: #adb5bd !important;
        }
        .form-select {
          background-color: #1C2333 !important;
          color: white !important;
          border: 2px solid #6c757d !important;
        }
        .form-select:focus {
          background-color: #1C2333 !important;
          color: white !important;
          border-color: #FFA500 !important;
          box-shadow: 0 0 0 0.25rem rgba(255, 165, 0, 0.25) !important;
        }
        .form-select option {
          background-color: #1C2333 !important;
          color: white !important;
        }
        .card {
          background-color: #1C2333 !important;
          border: 2px solid #6c757d !important;
        }
        .card-header {
          background-color: #6c757d !important;
          color: white !important;
        }
        .card-body {
          background-color: #1C2333 !important;
          color: white !important;
        }
        
        /* Bar Chart CSS */
        .chart-bar-required {
          width: 80px;
          background-color: #4682B4;
        }
        
        .chart-bar-actual {
          width: 80px;
          background-color: #FFA500;
        }
        
        .chart-bar-group {
          display: flex;
          gap: 5px;
          align-items: flex-end;
        }
        
        .chart-data-labels {
          margin-top: 3px;
          font-size: 9pt;
          text-align: center;
          color: #000;
          display: flex;
          flex-direction: column;
          line-height: 1.4;
        }
      `}</style>

      <Card className="shadow mb-4">
        <Card.Header className="text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#FFA500' }}>
          <div className="d-flex align-items-center">
            <img 
              src="/logo.png" 
              alt="Vitrag Associates Logo" 
              height="40" 
              className="me-2"
            />
            <div>
              <h3 className="mb-0">Concrete Cube Strength Graph</h3>
              <div className="mt-2">
                <span className="badge fs-6 p-2" style={{ backgroundColor: '#FFA500' }}>
                  Reference Number: {testData?.referenceNumber || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-1">
            <Button variant="light" size="sm" onClick={() => navigate('/test-observations', { state: location.state })}>
              <i className="fas fa-arrow-left"></i> Back
            </Button>
            <Button variant="warning" size="sm" onClick={handleViewPDF}>
              <i className="fas fa-file-pdf"></i> View PDF
            </Button>
            <Button variant="success" size="sm">
              <i className="fas fa-download"></i> Download
            </Button>
            <Button variant="info" size="sm" onClick={() => window.print()}>
              <i className="fas fa-print"></i> Print
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body>
          <Row className="mb-4">
            <Col xs={12}>
              <Form>
                <h4 className="mb-3">Enter Actual Cube Strength Values</h4>
                <div className="table-responsive">
                  <Table bordered className="table-sm">
                    <thead className="table-secondary">
                      <tr>
                        <th className="text-center">Curing days</th>
                        <th className="text-center">Required strength</th>
                        <th className="text-center">Actual Cube strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-semibold">7 days strength</td>
                        <td>
                          <Form.Control
                            type="number"
                            step="0.01"
                            name="required_7"
                            value={strengthData.required_7}
                            onChange={handleInputChange}
                            placeholder="Required strength"
                            className="form-control-sm"
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            name="actual_7"
                            value={strengthData.actual_7}
                            onChange={handleInputChange}
                            placeholder="Actual strength"
                            className="form-control-sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">14 days strength</td>
                        <td>
                          <Form.Control
                            type="number"
                            step="0.01"
                            name="required_14"
                            value={strengthData.required_14}
                            onChange={handleInputChange}
                            placeholder="Required strength"
                            className="form-control-sm"
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            name="actual_14"
                            value={strengthData.actual_14}
                            onChange={handleInputChange}
                            placeholder="Actual strength"
                            className="form-control-sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">28 days strength</td>
                        <td>
                          <Form.Control
                            type="number"
                            step="0.01"
                            name="required_28"
                            value={strengthData.required_28}
                            onChange={handleInputChange}
                            placeholder="Required strength"
                            className="form-control-sm"
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            name="actual_28"
                            value={strengthData.actual_28}
                            onChange={handleInputChange}
                            placeholder="Actual strength"
                            className="form-control-sm"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                
                {/* Observations Table */}
                <Card className="mb-4 mt-4">
                  <Card.Header className="bg-secondary">
                    <h4 className="mb-0 text-center fw-bold text-white">Observations</h4>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table bordered className="mb-0 table-sm">
                        <tbody>
                          <tr>
                            <td className="text-center" style={{ width: '5%' }}>1.</td>
                            <td style={{ width: '70%' }}>
                              <span className="d-block">Compressive Strength acquired after specified duration</span>
                            </td>
                            <td style={{ width: '25%' }}>
                              <Form.Select
                                name="obs_strength_duration"
                                value={strengthData.obs_strength_duration}
                                onChange={handleInputChange}
                                className="form-select-sm"
                              >
                                <option value="">---------</option>
                                <option value="Satisfactory">Satisfactory</option>
                                <option value="Unsatisfactory">Unsatisfactory</option>
                              </Form.Select>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-center">2.</td>
                            <td>
                              <span className="d-block">Individual test results within ±15% of average strength</span>
                            </td>
                            <td>
                              <Form.Select
                                name="obs_test_results"
                                value={strengthData.obs_test_results}
                                onChange={handleInputChange}
                                className="form-select-sm"
                              >
                                <option value="">---------</option>
                                <option value="Satisfactory">Satisfactory</option>
                                <option value="Unsatisfactory">Unsatisfactory</option>
                              </Form.Select>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-center">3.</td>
                            <td>
                              <span className="d-block">Weight of cube</span>
                            </td>
                            <td>
                              <Form.Select
                                name="obs_weight"
                                value={strengthData.obs_weight}
                                onChange={handleInputChange}
                                className="form-select-sm"
                              >
                                <option value="">---------</option>
                                <option value="Satisfactory">Satisfactory</option>
                                <option value="Unsatisfactory">Unsatisfactory</option>
                              </Form.Select>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-center">4.</td>
                            <td>
                              <span className="d-block">Type of failure Pattern as per IS 516(Part-1/Sec-1): - 2021 Fig.1</span>
                            </td>
                            <td>
                              <Form.Select
                                name="obs_failure_pattern"
                                value={strengthData.obs_failure_pattern}
                                onChange={handleInputChange}
                                className="form-select-sm"
                              >
                                <option value="">---------</option>
                                <option value="Satisfactory">Satisfactory</option>
                                <option value="Unsatisfactory">Unsatisfactory</option>
                              </Form.Select>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-center">5.</td>
                            <td>
                              <span className="d-block">Bonding between Aggregates and cement paste.</span>
                            </td>
                            <td>
                              <Form.Select
                                name="obs_bonding"
                                value={strengthData.obs_bonding}
                                onChange={handleInputChange}
                                className="form-select-sm"
                              >
                                <option value="">---------</option>
                                <option value="Satisfactory">Satisfactory</option>
                                <option value="Unsatisfactory">Unsatisfactory</option>
                              </Form.Select>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-center">6.</td>
                            <td>
                              <span className="d-block">Compressive Strength as per acceptance criteria as Cl.16.1 of IS 456:2000</span>
                            </td>
                            <td>
                              <Form.Select
                                name="obs_strength_criteria"
                                value={strengthData.obs_strength_criteria}
                                onChange={handleInputChange}
                                className="form-select-sm"
                              >
                                <option value="">---------</option>
                                <option value="Satisfactory">Satisfactory</option>
                                <option value="Unsatisfactory">Unsatisfactory</option>
                              </Form.Select>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
                
                <div className="text-center mt-3">
                  <Button 
                    variant="info" 
                    className="me-2"
                    onClick={fillRandomData}
                  >
                    <i className="fas fa-magic me-2"></i> Fill Random Data
                  </Button>
                  <Button 
                    variant="success" 
                    className="me-2"
                    size="lg"
                    onClick={generateGraph}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Generating Graph...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-chart-bar me-2"></i> Generate Graph
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>

          {/* Loading Indicator for Graph Generation */}
          {isGenerating && (
            <Row className="mt-4">
              <Col xs={12}>
                <Card>
                  <Card.Body className="text-center">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                      <div>
                        <div 
                          className="spinner-border text-warning" 
                          role="status" 
                          style={{ width: '4rem', height: '4rem' }}
                        >
                          <span className="visually-hidden">Generating...</span>
                        </div>
                        <h4 className="mt-3 text-white">Generating Graph...</h4>
                        <p className="text-muted">Please wait while we create your strength comparison chart</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Graph Display Area */}
          {showGraph && !isGenerating && (
            <Row className="mt-4">
              <Col xs={12}>
                <Card>
                  <Card.Body className="text-center">
                    <div className="d-flex justify-content-center">
                      <div className="p-4 rounded" style={{ backgroundColor: 'white', width: '100%', maxWidth: '900px', border: '3px solid #000' }}>
                        {/* Pure CSS Bar Chart */}
                        <div style={{ fontFamily: "'Times New Roman', Times, serif", padding: '20px', position: 'relative' }}>
                          {/* Graph Title */}
                          <div style={{ textAlign: 'center', fontSize: '11pt', color: '#666', marginBottom: '30px' }}>
                            Graphical presentation of compressive strength
                          </div>
                          
                          {/* Chart Container */}
                          <div style={{ position: 'relative', height: '450px', marginTop: '20px', marginLeft: '50px' }}>
                            {/* Y-axis */}
                            <div style={{ position: 'absolute', left: '60px', top: '0', height: '350px', borderLeft: '2px solid #000' }}>
                              {/* Y-axis labels - 0 to 45 with gap of 5 */}
                              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45].reverse().map((value, i) => {
                                return (
                                  <div key={i} style={{ position: 'absolute', right: '10px', top: `${(i / 9) * 100}%`, transform: 'translateY(-50%)', fontSize: '9pt', color: '#000' }}>
                                    {value}
                                  </div>
                                );
                              })}
                              {/* Grid lines */}
                              {[...Array(9)].map((_, i) => (
                                <div key={i} style={{ position: 'absolute', left: '0', top: `${((i + 1) / 9) * 100}%`, width: '680px', borderTop: '1px solid rgba(0,0,0,0.15)' }} />
                              ))}
                            </div>
                            
                            {/* X-axis line */}
                            <div style={{ position: 'absolute', left: '60px', top: '350px', width: '680px', borderBottom: '2px solid #000' }}></div>
                            
                            {/* Bars - positioned absolutely at bottom of Y-axis */}
                            <div style={{ position: 'absolute', left: '70px', bottom: '35px', width: '680px', height: '350px', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
                              {getChartData().data.map((item, index) => {
                                const requiredHeight = (item.required / 45) * 350;
                                const actualHeight = (item.actual / 45) * 350;
                                
                                return (
                                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px', position: 'relative' }}>
                                    {/* Bar group */}
                                    <div className="chart-bar-group">
                                      {/* Required bar */}
                                      <div className="chart-bar-required" style={{ height: `${requiredHeight}px` }} />
                                      {/* Actual bar */}
                                      <div className="chart-bar-actual" style={{ height: `${actualHeight}px` }} />
                                </div>
                                    {/* X-axis label */}
                                    <div style={{ marginTop: '8px', fontSize: '9pt', textAlign: 'center', color: '#000' }}>{item.name}</div>
                                    {/* Data values below x-axis label - vertical layout */}
                                    <div className="chart-data-labels">
                                      <span>{item.required.toFixed(1)}</span>
                                      <span>{item.actual.toFixed(2)}</span>
                              </div>
                            </div>
                                );
                              })}
                                </div>
                              </div>
                          
                          {/* Y-axis label */}
                          <div style={{ position: 'absolute', left: '40px', top: '45%', transform: 'rotate(-90deg)', transformOrigin: 'center', fontSize: '10pt', color: '#000' }}>
                            Strength N/mm2
                          </div>
                          
                          {/* Legend - Left Side (Lower Position) */}
                          <div style={{ position: 'absolute', left: '0px', top: '480px', fontSize: '9pt', lineHeight: '1.8', color: '#000' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <div style={{ width: '20px', height: '15px', backgroundColor: '#4682B4' }} />
                              <span style={{ color: '#000' }}>Required strength N/mm2</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '20px', height: '15px', backgroundColor: '#FFA500' }} />
                              <span style={{ color: '#000' }}>Actual Cube strength</span>
                                </div>
                              </div>
                          
                          {/* Legend - Bottom Center */}
                          <div style={{ marginTop: '-15px', marginLeft: '60px', display: 'flex', justifyContent: 'center', gap: '80px', fontSize: '9pt', color: '#000' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '25px', height: '12px', backgroundColor: '#4682B4' }} />
                              <span style={{ color: '#000' }}>Required strength N/mm2</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '25px', height: '12px', backgroundColor: '#FFA500' }} />
                              <span style={{ color: '#000' }}>Actual Cube strength</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                
                
                {/* Complete Test Button */}
                <div className="text-center mt-4">
                  <Card className="border-success">
                    <Card.Body className="bg-dark">
                      <h5 className="card-title text-success mb-3">
                        <i className="fas fa-clipboard-check"></i> Test Completion
                      </h5>
                      <p className="card-text text-white mb-3">
                        Generate final report and complete the testing process
                      </p>
                      <Button 
                        variant="success" 
                        size="lg" 
                        className="px-5 py-3"
                        onClick={() => navigate('/test-report-preview', { 
                          state: { 
                            testData: { 
                              ...formData, 
                              ...testData, 
                              ...observationsData,
                              strengthData,
                              // Ensure rows data is passed
                              rows: observationsData?.testRows || observationsData?.rows || [],
                              testRemarks: observationsData?.formData?.testRemarks || observationsData?.testRemarks || '',
                              testedBy: observationsData?.formData?.testedBy || observationsData?.testedBy || '',
                              checkedBy: observationsData?.formData?.checkedBy || observationsData?.checkedBy || '',
                              verifiedBy: observationsData?.formData?.verifiedBy || observationsData?.verifiedBy || '',
                              sampleDescription: observationsData?.formData?.sampleDescription || observationsData?.sampleDescription || '',
                              cubeCondition: observationsData?.formData?.cubeCondition || observationsData?.cubeCondition || '',
                              curingCondition: observationsData?.formData?.curingCondition || observationsData?.curingCondition || '',
                              machineUsed: observationsData?.formData?.machineUsed || observationsData?.machineUsed || '',
                            } 
                          } 
                        })}
                      >
                        <i className="fas fa-clipboard-check me-2"></i> Complete Test
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StrengthGraph;
