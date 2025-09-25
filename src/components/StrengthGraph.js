import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Button, Table, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload, faChartLine, faSpinner } from '@fortawesome/free-solid-svg-icons';
import GraphService from '../services/graphService';

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
  const [generatedGraph, setGeneratedGraph] = useState(null);
  const [serviceStatus, setServiceStatus] = useState({ available: false });
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

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

  // Check graph service status on component mount
  useEffect(() => {
    const checkService = async () => {
      const status = await GraphService.checkServiceStatus();
      setServiceStatus(status);
    };
    checkService();
  }, []);

  // Redraw graph when data changes
  useEffect(() => {
    if (showGraph) {
      drawGraph();
    }
  }, [strengthData, showGraph]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStrengthData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate graph using Matplotlib service
  const generateMatplotlibGraph = async () => {
    if (!serviceStatus.available) {
      alert('Graph generation service is not available. Please ensure the Python backend is running.');
      return;
    }

    setIsGenerating(true);
    try {
      // Prepare test data for graph generation
      const testResults = [];
      
      // Add test results from observations if available
      if (observationsData?.testRows && observationsData.testRows.length > 0) {
        observationsData.testRows.forEach((row, index) => {
          testResults.push({
            cube_number: index + 1,
            compressive_strength: parseFloat(row.compressiveStrength) || 0,
            age_in_days: 28, // Default age
            casting_date: row.castingDate || 'N/A',
            testing_date: row.testingDate || 'N/A'
          });
        });
      } else {
        // Use manual input data
        if (strengthData.actual_7) {
          testResults.push({
            cube_number: 1,
            compressive_strength: parseFloat(strengthData.actual_7) || 0,
            age_in_days: 7,
            casting_date: 'N/A',
            testing_date: 'N/A'
          });
        }
        if (strengthData.actual_14) {
          testResults.push({
            cube_number: 2,
            compressive_strength: parseFloat(strengthData.actual_14) || 0,
            age_in_days: 14,
            casting_date: 'N/A',
            testing_date: 'N/A'
          });
        }
        if (strengthData.actual_28) {
          testResults.push({
            cube_number: 3,
            compressive_strength: parseFloat(strengthData.actual_28) || 0,
            age_in_days: 28,
            casting_date: 'N/A',
            testing_date: 'N/A'
          });
        }
      }

      if (testResults.length === 0) {
        alert('Please enter test results before generating the graph.');
        return;
      }

      // Prepare test data
      const testData = {
        job_number: formData?.jobNumber || testData?.job_number || 'N/A',
        customer_name: formData?.customerName || testData?.customer_name || 'N/A',
        site_name: formData?.siteName || testData?.site_name || 'N/A',
        grade: 'M25', // Default grade
        casting_date: 'N/A',
        test_results: testResults
      };

      // Generate graph
      const result = await GraphService.generateStrengthGraph(testData);
      
      if (result.success) {
        setGeneratedGraph(result);
        setShowGraph(true);
      } else {
        alert(`Graph generation failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error generating graph:', error);
      alert('Error generating graph. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download generated graph
  const downloadGraph = () => {
    if (generatedGraph) {
      const filename = `strength_graph_${generatedGraph.jobNumber || 'test'}.png`;
      GraphService.downloadGraph(generatedGraph.imageData, filename);
    }
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
      drawGraph();
    }, 2000);
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set background
    ctx.fillStyle = '#1C2333';
    ctx.fillRect(0, 0, width, height);

    // Graph dimensions
    const margin = 60;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;

    // Draw axes
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = margin + (graphHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();
    }

    // Prepare data
    const days = [7, 14, 28];
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

    const maxValue = Math.max(...requiredValues, ...actualValues, 30);
    const scale = graphHeight / maxValue;

    // Draw required strength bars
    ctx.fillStyle = '#FFA500';
    for (let i = 0; i < days.length; i++) {
      const barWidth = graphWidth / 6;
      const x = margin + (i * graphWidth / 3) + barWidth * 0.1;
      const barHeight = requiredValues[i] * scale;
      const y = height - margin - barHeight;
      
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    }

    // Draw actual strength bars
    ctx.fillStyle = '#28a745';
    for (let i = 0; i < days.length; i++) {
      const barWidth = graphWidth / 6;
      const x = margin + (i * graphWidth / 3) + barWidth * 0.1 + barWidth * 0.9;
      const barHeight = actualValues[i] * scale;
      const y = height - margin - barHeight;
      
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    }

    // Draw labels
    ctx.fillStyle = '#FFA500';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let i = 0; i < days.length; i++) {
      const x = margin + (i * graphWidth / 3) + graphWidth / 6;
      ctx.fillText(`${days[i]} Days`, x, height - margin + 20);
    }

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * i;
      const y = height - margin - (graphHeight / 5) * i;
      ctx.fillText(value.toFixed(1), margin - 10, y + 5);
    }

    // Draw legend
    ctx.fillStyle = '#FFA500';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Required Strength', margin + graphWidth + 20, margin + 30);
    
    ctx.fillStyle = '#28a745';
    ctx.fillText('Actual Strength', margin + graphWidth + 20, margin + 60);

    // Draw title
    ctx.fillStyle = '#FFA500';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Concrete Cube Strength Comparison', width / 2, 30);
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
                <span className="badge" style={{ backgroundColor: '#FFA500' }} className="fs-6 p-2">
                  Reference Number: {testData?.referenceNumber || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-1">
            <Button variant="light" size="sm" onClick={() => navigate('/test-observations', { state: location.state })}>
              <i className="fas fa-arrow-left"></i> Back
            </Button>
            <Button variant="warning" size="sm">
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
                        <i className="fas fa-chart-bar me-2"></i> Generate Graph (Chart.js)
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="warning" 
                    size="lg"
                    onClick={generateMatplotlibGraph}
                    disabled={isGenerating || !serviceStatus.available}
                    title={!serviceStatus.available ? 'Graph service not available' : 'Generate professional graph with Matplotlib'}
                  >
                    {isGenerating ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="me-2" spin />
                        Generating Matplotlib Graph...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faChartLine} className="me-2" />
                        Generate Matplotlib Graph
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
                <h4 className="text-center mb-3 text-white">Fig. 2 – Graphical Representation of Comparison of Compressive Strengths</h4>
                <Card>
                  <Card.Body className="text-center">
                    <div className="d-flex justify-content-center">
                      <div className="p-4 rounded" style={{ backgroundColor: '#1C2333', minHeight: '500px', width: '100%', maxWidth: '800px' }}>
                        <canvas
                          ref={canvasRef}
                          width={700}
                          height={400}
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                        
                        {/* Data Summary */}
                        <div className="mt-4 text-white">
                          <h5 className="text-warning mb-3">Data Summary</h5>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="card bg-dark border-warning">
                                <div className="card-body p-3">
                                  <h6 className="card-title text-warning">7 Days</h6>
                                  <p className="card-text mb-1">Actual: {strengthData.actual_7 || 'N/A'} N/mm²</p>
                                  <p className="card-text mb-0">Required: {strengthData.required_7 || 'N/A'} N/mm²</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="card bg-dark border-warning">
                                <div className="card-body p-3">
                                  <h6 className="card-title text-warning">14 Days</h6>
                                  <p className="card-text mb-1">Actual: {strengthData.actual_14 || 'N/A'} N/mm²</p>
                                  <p className="card-text mb-0">Required: {strengthData.required_14 || 'N/A'} N/mm²</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="card bg-dark border-warning">
                                <div className="card-body p-3">
                                  <h6 className="card-title text-warning">28 Days</h6>
                                  <p className="card-text mb-1">Actual: {strengthData.actual_28 || 'N/A'} N/mm²</p>
                                  <p className="card-text mb-0">Required: {strengthData.required_28 || 'N/A'} N/mm²</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                
                {/* Matplotlib Graph Display */}
                {generatedGraph && (
                  <Row className="mt-4">
                    <Col xs={12}>
                      <h4 className="text-center mb-3 text-white">
                        <FontAwesomeIcon icon={faChartLine} className="me-2" />
                        Professional Matplotlib Graph
                      </h4>
                      <Card>
                        <Card.Body className="text-center">
                          <div className="d-flex justify-content-center mb-3">
                            <img 
                              src={GraphService.getImageDataUrl(generatedGraph.imageData)}
                              alt="Matplotlib Strength Graph"
                              style={{ 
                                maxWidth: '100%', 
                                height: 'auto',
                                border: '2px solid #FFA500',
                                borderRadius: '8px'
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-center gap-2">
                            <Button 
                              variant="warning" 
                              onClick={downloadGraph}
                            >
                              <FontAwesomeIcon icon={faDownload} className="me-2" />
                              Download Graph
                            </Button>
                            <Button 
                              variant="outline-light" 
                              onClick={() => setGeneratedGraph(null)}
                            >
                              Close Graph
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}
                
                {/* Service Status Alert */}
                {!serviceStatus.available && (
                  <Row className="mt-3">
                    <Col xs={12}>
                      <Alert variant="warning">
                        <Alert.Heading>Graph Service Not Available</Alert.Heading>
                        <p>
                          The Matplotlib graph generation service is not running. 
                          To use professional graph generation:
                        </p>
                        <ol>
                          <li>Install Python dependencies: <code>pip install matplotlib numpy</code></li>
                          <li>Start the graph server: <code>node graph-server.js</code></li>
                          <li>Refresh this page</li>
                        </ol>
                      </Alert>
                    </Col>
                  </Row>
                )}
                
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
                        onClick={() => navigate('/test-report-preview', { state: { testData: { ...formData, ...testData, strengthData } } })}
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
