import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faChartLine, 
  faFilePdf,
  faVial,
  faUser,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

const Samples = () => {
  // Mock detailed sample data - This is the specific test from the form
  const sampleData = {
    id: 1,
    jobNumber: 'T-2501690',
    customer: 'Lords Developers',
    contactPerson: 'jamkhandey',
    phone: '9067877490',
    email: '',
    siteName: 'shivyogi residency',
    receiptDate: '25-08-2025',
    completionDate: '09-08-2025',
    status: 'pending',
    cubeTests: [{
      srNo: 1.0,
      idMark: '—',
      locationNature: 'column',
      grade: 'M-25',
      castingDate: '11-08-2025',
      testingDate: '08-09-2025',
      ageInDays: 28.0,
      noOfCubes: 3,
      method: 'IS 516 (Part1/Sec1):2021'
    }]
  };

  const handleEnterObservations = (testId) => {
    alert('Navigate to data entry page for test ID: ' + testId);
  };

  const handleGenerateGraph = (testId) => {
    alert('Navigate to strength graph page for test ID: ' + testId);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'warning', text: 'Sample Received' },
      'received': { variant: 'secondary', text: 'Sample Received' },
      'testing': { variant: 'warning', text: 'Testing' },
      'reporting': { variant: 'info', text: 'Generating Report' },
      'completed': { variant: 'success', text: 'Completed' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: 'Unknown' };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="container-fluid">
      <Container>
        {/* Header Banner */}
        <Row className="mb-4">
          <Col>
            <Card className="card-vitrag">
              <Card.Header className="d-flex justify-content-between align-items-center" style={{backgroundColor: '#FFA500', color: 'white'}}>
                <div className="d-flex align-items-center">
                  <img src="/logo.png" alt="Vitrag Associates" height="40" className="me-3" />
                  <div>
                    <h3 className="mb-0">Vitrag Associates LLP - Sample Test Request</h3>
                    <p className="mb-0">Job Number: {sampleData.jobNumber}</p>
                  </div>
                </div>
                <div>
                  <Button variant="light" className="me-2">
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </Button>
                  <Button variant="light" className="me-2">
                    <FontAwesomeIcon icon={faVial} className="me-1" />
                    Capture Images & Observations
                  </Button>
                  <Button variant="light">
                    <FontAwesomeIcon icon={faChartLine} className="me-1" />
                    Generate Graph
                  </Button>
                </div>
              </Card.Header>
            </Card>
          </Col>
        </Row>

        {/* Customer Information */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="card-vitrag h-100">
              <Card.Header style={{backgroundColor: '#FFA500', color: 'white'}}>
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Customer Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <tbody>
                    <tr>
                      <td><strong>Name of Customer:</strong></td>
                      <td>{sampleData.customer} {sampleData.siteName}</td>
                    </tr>
                    <tr>
                      <td><strong>Contact Person:</strong></td>
                      <td>{sampleData.contactPerson}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone/Mobile:</strong></td>
                      <td>{sampleData.phone}</td>
                    </tr>
                    <tr>
                      <td><strong>E-mail:</strong></td>
                      <td>{sampleData.email || '—'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Sample Information */}
          <Col md={6}>
            <Card className="card-vitrag h-100">
              <Card.Header style={{backgroundColor: '#FFA500', color: 'white'}}>
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faVial} className="me-2" />
                  Sample Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <tbody>
                    <tr>
                      <td><strong>Receipt Date:</strong></td>
                      <td>{sampleData.receiptDate}</td>
                    </tr>
                    <tr>
                      <td><strong>Site Name:</strong></td>
                      <td>{sampleData.siteName}</td>
                    </tr>
                    <tr>
                      <td><strong>Probable Completion Date:</strong></td>
                      <td>{sampleData.completionDate}</td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>{getStatusBadge(sampleData.status)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Testing Requirement (Concrete Cube/Core) */}
        <Row className="mb-4">
          <Col>
            <Card className="card-vitrag">
              <Card.Header style={{backgroundColor: '#FFA500', color: 'white'}}>
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faBuilding} className="me-2" />
                  Testing Requirement (Concrete Cube/Core)
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table bordered hover>
                    <thead className="table-dark">
                      <tr>
                        <th>Sr No</th>
                        <th>ID Mark</th>
                        <th>Location/Nature/Work</th>
                        <th>Grade</th>
                        <th>Casting Date</th>
                        <th>Testing Date</th>
                        <th>Age in days</th>
                        <th>No of cubes/Cores</th>
                        <th>Method/</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.cubeTests.map((test, index) => (
                        <tr key={index}>
                          <td>{test.srNo}</td>
                          <td>{test.idMark}</td>
                          <td>{test.locationNature}</td>
                          <td>{test.grade}</td>
                          <td>{test.castingDate}</td>
                          <td>{test.testingDate}</td>
                          <td>{test.ageInDays}</td>
                          <td>{test.noOfCubes}</td>
                          <td>{test.method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row className="mb-4">
          <Col>
            <Card className="card-vitrag">
              <Card.Body className="text-center">
                <h5 className="mb-3">Next Steps</h5>
                <div className="d-flex justify-content-center gap-3">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => handleEnterObservations(sampleData.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Enter Observations
                  </Button>
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={() => handleGenerateGraph(sampleData.id)}
                  >
                    <FontAwesomeIcon icon={faChartLine} className="me-2" />
                    Generate Graph
                  </Button>
                  <Link to={`/generate-pdf/${sampleData.id}`} className="btn btn-danger btn-lg">
                    <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                    Generate PDF
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Samples;
