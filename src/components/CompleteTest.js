import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const CompleteTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state
  const { formData, testData, testIndex, observationsData } = location.state || {};
  
  const [reviewerInfo, setReviewerInfo] = useState({
    name: 'Lalita S. Dussa',
    designation: 'Quality Manager',
    graduation: 'B.Tech.(Civil)'
  });

  const [currentDate] = useState(new Date().toLocaleDateString('en-GB'));

  // Calculate age of specimen
  const calculateAge = () => {
    if (testData?.castingDate && testData?.testingDate) {
      const castingDate = new Date(testData.castingDate);
      const testingDate = new Date(testData.testingDate);
      const diffTime = Math.abs(testingDate - castingDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const handleReviewerChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    if (selectedOption.value) {
      setReviewerInfo({
        name: selectedOption.getAttribute('data-name'),
        designation: selectedOption.getAttribute('data-designation'),
        graduation: selectedOption.getAttribute('data-graduation')
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <Container className="mt-3">
      <style jsx>{`
        .table-center-force td,
        .table-center-force th {
          text-align: center !important;
          vertical-align: middle !important;
        }
        .table-center-force td[rowspan] {
          vertical-align: middle !important;
        }
        .bg-dark {
          background-color: #1C2333 !important;
        }
        .bg-secondary {
          background-color: #6c757d !important;
        }
        .form-control, .form-select {
          background-color: #1C2333 !important;
          color: white !important;
          border: 2px solid #6c757d !important;
        }
        .form-control:focus, .form-select:focus {
          background-color: #1C2333 !important;
          color: white !important;
          border-color: #FFA500 !important;
          box-shadow: 0 0 0 0.25rem rgba(255, 165, 0, 0.25) !important;
        }
        .form-control::placeholder {
          color: #adb5bd !important;
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
        .list-group-item {
          background-color: #1C2333 !important;
          color: white !important;
          border: 1px solid #6c757d !important;
        }
      `}</style>

      <Card className="shadow mb-4">
        {/* Header with Logos */}
        <Card.Header className="bg-dark">
          <Row className="align-items-center">
            <Col xs={3} md={2} className="text-start">
              <img 
                src="/logo.png" 
                alt="Vitrag Associates Logo" 
                height="50" 
                className="d-none d-md-block"
              />
              <img 
                src="/logo.png" 
                alt="Vitrag Associates Logo" 
                height="40" 
                className="d-md-none"
              />
            </Col>
            <Col xs={6} md={8} className="text-center">
              <h2 className="text-white m-0 h4 h-md-2">TEST REPORT</h2>
            </Col>
            <Col xs={3} md={2} className="text-end">
              <img 
                src="/nabl_logo_final.png" 
                alt="NABL Logo" 
                height="50" 
                className="d-none d-md-block"
              />
              <img 
                src="/nabl_logo_final.png" 
                alt="NABL Logo" 
                height="40" 
                className="d-md-none"
              />
            </Col>
          </Row>
        </Card.Header>
        
        <Card.Body>
          {/* Customer Information Section */}
          <div className="table-responsive mb-3">
            <Table bordered>
              <tbody>
                <tr>
                  <th className="bg-dark text-white text-center" style={{ width: '25%' }} rowSpan="2">
                    Customer/Site Name & Address
                  </th>
                  <td className="bg-dark text-white text-center" rowSpan="2">
                    {formData?.customerName || 'N/A'}<br/>
                    {formData?.siteName && `${formData.siteName}<br/>`}
                    {formData?.address && `${formData.address}<br/>`}
                    {formData?.city || ''}
                  </td>
                  <th className="bg-dark text-white text-center" style={{ width: '18%' }}>
                    Date of Report
                  </th>
                  <td className="bg-dark text-white text-center" style={{ width: '25%' }}>
                    {currentDate}
                  </td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">ULR Number</th>
                  <td className="bg-dark text-white text-center">{formData?.ulrNumber || 'N/A'}</td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">Job Code Number</th>
                  <td className="bg-dark text-white text-center">{formData?.jobNumber || 'N/A'}</td>
                  <th className="bg-dark text-white text-center">Reference Number</th>
                  <td className="bg-dark text-white text-center">{testData?.referenceNumber || 'N/A'}</td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">Location/Structure Type</th>
                  <td className="bg-dark text-white text-center" colSpan="3">
                    {formData?.locationNature || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">Date of Receipt</th>
                  <td className="bg-dark text-white text-center">{formatDate(formData?.receiptDate)}</td>
                  <th className="bg-dark text-white text-center">Age of Specimen</th>
                  <td className="bg-dark text-white text-center">{calculateAge()} Days</td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">Date of Casting</th>
                  <td className="bg-dark text-white text-center">{formatDate(testData?.castingDate)}</td>
                  <th className="bg-dark text-white text-center">Date of Testing</th>
                  <td className="bg-dark text-white text-center">{formatDate(testData?.testingDate)}</td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">Type of Specimen</th>
                  <td className="bg-dark text-white text-center">
                    {observationsData?.formData?.sampleDescription || 'Concrete Cube Specimen'}
                  </td>
                  <th className="bg-dark text-white text-center">Grade of Specimen</th>
                  <td className="bg-dark text-white text-center">{testData?.grade || 'N/A'}</td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">Condition of Specimen</th>
                  <td className="bg-dark text-white text-center">
                    {observationsData?.formData?.cubeCondition || 'Good'}
                  </td>
                  <th className="bg-dark text-white text-center">Curing Condition</th>
                  <td className="bg-dark text-white text-center">
                    {observationsData?.formData?.curingCondition || '--'}
                  </td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">Machine used for Testing</th>
                  <td className="bg-dark text-white text-center" colSpan="3">
                    {observationsData?.formData?.machineUsed || 'Universal Testing Machine'}
                  </td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">Location of Test</th>
                  <td className="bg-dark text-white text-center" colSpan="3">Permanent</td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">Capacity/Range</th>
                  <td className="bg-dark text-white text-center">2000KN</td>
                  <th className="bg-dark text-white text-center">Calibration Due Date</th>
                  <td className="bg-dark text-white text-center">{currentDate}</td>
                </tr>
                <tr>
                  <th className="bg-dark text-white text-center">Test Method</th>
                  <td className="bg-dark text-white text-center">
                    {observationsData?.formData?.testMethod || 'IS 516 (Part1/Sec1):2021'}
                  </td>
                  <th className="bg-dark text-white text-center">Environmental condition</th>
                  <td className="bg-dark text-white text-center">Not Applicable</td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* Test Sample Description */}
          <Row className="mb-3">
            <Col md={12}>
              <h5 className="mb-3 bg-dark p-2 text-center text-white">DESCRIPTION OF TEST SAMPLE</h5>
              <div className="table-responsive">
                <Table bordered className="table-center-force mx-auto" style={{ width: 'auto', margin: '0 auto' }}>
                  <thead className="bg-dark text-white">
                    <tr>
                      <th className="text-white text-center" style={{ width: '70px' }}>Sr. No.</th>
                      <th className="text-white text-center" style={{ width: '100px' }}>ID Mark</th>
                      <th className="text-white text-center" colSpan="3" style={{ width: '200px' }}>
                        Dimensions of Specimen (mm) (L x B x H)
                      </th>
                      <th className="text-white text-center" style={{ width: '100px' }}>Area (mm²)</th>
                      <th className="text-white text-center" style={{ width: '100px' }}>Weight (kg)</th>
                      <th className="text-white text-center" style={{ width: '120px' }}>Maximum Load (kN)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-dark text-white">
                    {observationsData?.testRows?.map((row, index) => (
                      <tr key={row.id}>
                        <td className="text-white">{index + 1}</td>
                        <td className="text-white">{row.cubeId}</td>
                        <td className="text-white">{row.length || '--'}</td>
                        <td className="text-white">{row.breadth || '--'}</td>
                        <td className="text-white">{row.height || '--'}</td>
                        <td className="text-white">{row.area || '--'}</td>
                        <td className="text-white">{row.weight || '--'}</td>
                        <td className="text-white">{row.crushingLoad || '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          
          {/* Test Results */}
          <Row className="mb-4">
            <Col md={10} className="mx-auto">
              <h5 className="mb-3 bg-dark p-2 text-center text-white">
                Test Result for Compressive Strength of Concrete Cube
              </h5>
              <div className="table-responsive">
                <Table bordered className="table-center-force mx-auto" style={{ width: 'auto', margin: '0 auto' }}>
                  <thead style={{ backgroundColor: '#343a40' }}>
                    <tr>
                      <th className="text-white text-center" style={{ width: '100px' }}>Sr. No.</th>
                      <th className="text-white text-center" style={{ width: '120px' }}>ID Mark</th>
                      <th className="text-white text-center" style={{ width: '150px' }}>Density (kg/m³)</th>
                      <th className="text-white text-center" style={{ width: '200px' }}>Compressive Strength (N/mm²)</th>
                      <th className="text-white text-center" style={{ width: '220px' }}>Average Compressive Strength (N/mm²)</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: '#495057' }}>
                    {observationsData?.testRows?.map((row, index) => (
                      <tr key={row.id}>
                        <td className="text-white text-center">{index + 1}</td>
                        <td className="text-white text-center">{row.cubeId}</td>
                        <td className="text-white text-center">
                          {row.density && parseFloat(row.density) > 0 ? parseFloat(row.density).toFixed(1) : 'N/A'}
                        </td>
                        <td className="text-white text-center">
                          {row.compressiveStrength && parseFloat(row.compressiveStrength) > 0 
                            ? parseFloat(row.compressiveStrength).toFixed(1) : ''}
                        </td>
                        {index === 0 && (
                          <td 
                            className="text-white text-center align-middle" 
                            style={{ verticalAlign: 'middle !important' }} 
                            rowSpan={observationsData?.testRows?.length || 1}
                          >
                            {observationsData?.formData?.averageStrength && parseFloat(observationsData.formData.averageStrength) > 0 
                              ? parseFloat(observationsData.formData.averageStrength).toFixed(1) : ''}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>

          {/* Terms & Conditions */}
          <Row className="mb-4">
            <Col md={12}>
              <h5 className="mb-3 bg-dark p-2 text-white">Terms & Conditions –</h5>
              <ul className="list-group">
                <li className="list-group-item">Samples were not drawn by VAs lab.</li>
                <li className="list-group-item">The Test Reports & Results pertain to Sample/ Samples of material received by VAs.</li>
                <li className="list-group-item">The Test Report cannot be reproduced without the written approval of CEO/QM of VAs.</li>
                <li className="list-group-item">Any change/ correction/ alteration to the Test Report shall be invalid.</li>
                <li className="list-group-item">The role VAs is restricted to testing of the material sample as received in the laboratory. VAs or any of its employees shall not be liable for any dispute/ litigation arising between the customer & Third Party on account of test results. VAs shall not interact with any Third Party in this regard.</li>
                <li className="list-group-item">The CEO of VAs may make necessary changes to the terms & conditions without any prior notice.</li>
              </ul>
            </Col>
          </Row>
          
          {/* Reviewer Selection Section */}
          <Row className="mb-1 mt-1">
            <Col md={12}>
              <Card>
                <Card.Header className="bg-primary text-white py-1">
                  <h6 className="mb-0">Select Report Reviewer</h6>
                </Card.Header>
                <Card.Body className="py-1">
                  <Row>
                    <Col md={6}>
                      <Form.Label>Select Reviewer:</Form.Label>
                      <Form.Select 
                        id="reviewer_select" 
                        onChange={handleReviewerChange}
                        value={reviewerInfo.name}
                      >
                        <option value="Lalita S. Dussa" data-name="Lalita S. Dussa" data-designation="Quality Manager" data-graduation="B.Tech.(Civil)">
                          Lalita S. Dussa - Quality Manager
                        </option>
                        <option value="Harsha Prakarsha Sangave" data-name="Harsha Prakarsha Sangave" data-designation="Quality Manager" data-graduation="M.E(Civil-Structures)">
                          Harsha Prakarsha Sangave - Quality Manager
                        </option>
                        <option value="Amol A Adam" data-name="Amol A Adam" data-designation="Quality Manager" data-graduation="B.E(Civil)">
                          Amol A Adam - Quality Manager
                        </option>
                        <option value="Aaquib J. Shaikh" data-name="Aaquib J. Shaikh" data-designation="Quality Manager" data-graduation="B.E(Civil)">
                          Aaquib J. Shaikh - Quality Manager
                        </option>
                        <option value="Prakarsha A. Sangave" data-name="Prakarsha A. Sangave" data-designation="Chief Executive Officer" data-graduation="M.E(Civil-Structures)">
                          Prakarsha A. Sangave - Chief Executive Officer
                        </option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Authorization Section */}
          <Row className="mb-2">
            <Col md={6}>
              <div className="text-center">
                <p className="mb-0 fw-bold">Reviewed by –</p>
                <div>
                  <p className="mb-0 fw-bold">{reviewerInfo.name}</p>
                  <p className="mb-0">({reviewerInfo.designation})</p>
                  <p className="mb-0 fst-italic">{reviewerInfo.graduation}</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="text-center">
                <p className="mb-0 fw-bold">Authorized by –</p>
                <p className="mb-0 fw-bold">Mr. Prakarsh A Sangave</p>
                <p className="mb-0">(Chief Executive Officer)</p>
                <p className="mb-0 fst-italic">M.E(Civil-Structures)</p>
                <p className="mb-0 fst-italic">MTech (Civil-Geotechnical), M.I.E, F.I.E.</p>
              </div>
            </Col>
          </Row>
          
          {/* Report Footer */}
          <Row>
            <Col md={12} className="text-center border-top pt-3">
              <p>X-----------X-----------X-----------X----------END OF REPORT----------X-----------X-----------X-----------X</p>
            </Col>
          </Row>
          
          {/* Action Buttons */}
          <Row className="mt-4">
            <Col md={12} className="text-center">
              <Button 
                variant="secondary" 
                className="me-2"
                onClick={() => navigate('/strength-graph', { state: location.state })}
              >
                <i className="fas fa-arrow-left"></i> Back to Graph
              </Button>
              
              <Button 
                variant="primary" 
                className="me-2"
                onClick={() => window.print()}
              >
                <i className="fas fa-print"></i> Print
              </Button>
              
              <Button 
                variant="info" 
                className="me-2"
                onClick={() => window.print()}
              >
                <i className="fas fa-file-pdf"></i> Generate PDF
              </Button>
              
              <Button 
                variant="warning" 
                className="me-2"
                onClick={() => {
                  const subject = `Test Report - ${formData?.jobNumber || 'N/A'}`;
                  const body = `Please find attached the test report for ${formData?.jobNumber || 'N/A'}.\n\nRegards,\nVitrag Associates LLP`;
                  window.open(`mailto:${formData?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                }}
              >
                <i className="fas fa-envelope"></i> Email
              </Button>
              
              <Button 
                variant="success"
                onClick={() => {
                  const message = `Please find the test report for ${formData?.jobNumber || 'N/A'}`;
                  const phone = formData?.phone ? `91${formData.phone}` : '';
                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
                }}
              >
                <i className="fab fa-whatsapp"></i> WhatsApp
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CompleteTest;
