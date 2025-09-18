import React from 'react';
import { Container, Card, Button, Badge, Table, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewSample = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the submitted form data from location state
  const testRequest = location.state?.formData || {
    customerName: 'Lords Developers',
    contactPerson: 'John Smith',
    phone: '+91 9876543210',
    email: 'john@lordsdevelopers.com',
    siteName: 'Shivyogi Residency',
    siteAddress: 'Shelgi, Solapur, Maharashtra',
    testType: 'CC',
    receiptDate: '2024-01-15',
    ulrNumber: 'TC-1575625000001840F',
    referenceNumber: 'REF-2024-001',
    jobNumber: 'T-2501690',
    cubeTests: [{
      id: 1,
      idMark: 'CC-001',
      locationNature: 'Column - Ground Floor',
      grade: 'M25',
      castingDate: '2024-01-10',
      testingDate: '2024-02-07',
      quantity: 3,
      testMethod: 'IS 516 (Part1/Sec1):2021'
    }]
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <Container className="mt-4">
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
      `}</style>

      <Card className="shadow mb-4">
        <Card.Header className="text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#FFA500' }}>
          <div className="d-flex align-items-center">
            <img 
              src="/logo.png" 
              alt="Vitrag Associates Logo" 
              height="50" 
              className="me-3"
            />
            <div>
              <h3 className="mb-0">
                <span style={{ color: '#FFD700' }}>Vitrag Associates LLP</span> - Sample Test Request
              </h3>
              <div className="mt-2">
                <Badge style={{ backgroundColor: '#FFA500' }} className="fs-6 p-2">
                  Job Number: {testRequest.jobNumber}
                </Badge>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Button variant="light" size="sm" className="px-3 py-2">
              <i className="fas fa-edit"></i> Edit
            </Button>
            <Button variant="warning" size="sm" className="px-3 py-2">
              <i className="fas fa-camera"></i> Capture Images & Observations
            </Button>
            <Button variant="warning" size="sm" className="px-3 py-2">
              <i className="fas fa-chart-bar"></i> Generate Graph
            </Button>
            <Button variant="success" size="sm" className="px-3 py-2">
              <i className="fas fa-file-pdf"></i> Preview PDF
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h4 className="mb-3">Customer Information</h4>
              <Table bordered>
                <tbody>
                  <tr>
                    <th className="bg-secondary" style={{ width: '40%' }}>Name of Customer</th>
                    <td className="bg-dark">{testRequest.customerName}</td>
                  </tr>
                  <tr>
                    <th className="bg-secondary">Contact Person</th>
                    <td className="bg-dark">{testRequest.contactPerson}</td>
                  </tr>
                  <tr>
                    <th className="bg-secondary">Phone/Mobile</th>
                    <td className="bg-dark">{testRequest.phone}</td>
                  </tr>
                  <tr>
                    <th className="bg-secondary">E-mail</th>
                    <td className="bg-dark">{testRequest.email}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            
            <Col md={6}>
              <h4 className="mb-3">Sample Information</h4>
              <Table bordered>
                <tbody>
                  <tr>
                    <th className="bg-secondary">Receipt Date</th>
                    <td className="bg-dark">{formatDate(testRequest.receiptDate)}</td>
                  </tr>
                  <tr>
                    <th className="bg-secondary">Site Name</th>
                    <td className="bg-dark">{testRequest.siteName}</td>
                  </tr>
                  <tr>
                    <th className="bg-secondary">Site Address</th>
                    <td className="bg-dark">{testRequest.siteAddress}</td>
                  </tr>
                  <tr>
                    <th className="bg-secondary">Test Type</th>
                    <td className="bg-dark">{testRequest.testType}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          
          {testRequest.cubeTests && testRequest.cubeTests.length > 0 && (
            <>
              <h4 className="mb-3">Testing Requirement (Concrete Cube/Core)</h4>
              <div className="table-responsive mb-4">
                <Table bordered className="concrete-tests-table">
                  <thead className="table-secondary">
                    <tr>
                      <th>Sr No</th>
                      <th>ID Mark</th>
                      <th>Location/Nature/Work</th>
                      <th>Grade</th>
                      <th>Casting Date</th>
                      <th>Testing Date</th>
                      <th>Age in days</th>
                      <th>No of cubes/Cores</th>
                      <th>Test Method/Specification</th>
                      <th>Reference Number</th>
                      <th>ULR Number</th>
                      <th>Job Number</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testRequest.cubeTests.map((test, index) => (
                      <tr key={test.id}>
                        <td>{index + 1}</td>
                        <td>{test.idMark}</td>
                        <td>{test.locationNature}</td>
                        <td>{test.grade}</td>
                        <td>{formatDate(test.castingDate)}</td>
                        <td>{formatDate(test.testingDate)}</td>
                        <td>
                          {test.castingDate && test.testingDate ? 
                            Math.ceil((new Date(test.testingDate) - new Date(test.castingDate)) / (1000 * 60 * 60 * 24)) : 
                            'N/A'
                          }
                        </td>
                        <td>{test.quantity}</td>
                        <td>{test.testMethod}</td>
                        <td>{testRequest.referenceNumber}</td>
                        <td>{testRequest.ulrNumber}</td>
                        <td>{testRequest.jobNumber}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                             <Button 
                               variant="warning" 
                               size="sm"
                               onClick={() => navigate('/test-observations', { 
                                 state: { 
                                   testData: test,
                                   testRequest: testRequest,
                                   testIndex: index
                                 } 
                               })}
                             >
                               <i className="fas fa-plus"></i> Enter Observations
                             </Button>
                            <Button variant="success" size="sm" className="me-1">
                              <i className="fas fa-file-pdf"></i> Preview and Print PDF
                            </Button>
                            <Button variant="warning" size="sm" className="me-1">
                              <i className="fas fa-envelope"></i> Email
                            </Button>
                            <Button variant="success" size="sm">
                              <i className="fab fa-whatsapp"></i> WhatsApp
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
          
          <h4 className="mb-3">Testing Requirements Confirmation</h4>
          <Row className="mb-4">
            <Col md={12}>
              <ul className="list-group">
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" disabled checked />
                  Method of testing capability and resources acceptable
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" disabled checked />
                  Testing services requested may please be carried out
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" disabled checked />
                  Terms and conditions of Testing acceptable as per review remarks
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" disabled checked />
                  Statement of conformity or specifications on the test report
                </li>
              </ul>
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col md={6}>
              <div className="mb-2">
                <h5 className="fw-bold">LABORATORY REPRESENTATIVE</h5>
              </div>
              <p><strong>Name:</strong> Dr. Rajesh Kumar</p>
              <p><strong>Signature:</strong></p>
              <div className="border p-3 mb-2 bg-light" style={{ minHeight: '100px' }}>
                <p className="mt-3 text-dark text-center">Digital signature will be provided</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <h5 className="fw-bold">CUSTOMER'S REPRESENTATIVE</h5>
              </div>
              <p><strong>Name:</strong> {testRequest.contactPerson}</p>
              <p><strong>Signature:</strong></p>
              <div className="border p-3 mb-2 bg-light" style={{ minHeight: '100px' }}>
                <p className="mt-3 text-dark text-center">Digital signature will be provided</p>
              </div>
            </Col>
          </Row>
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button variant="secondary" className="me-md-2" onClick={() => navigate('/samples')}>
              Back to Samples
            </Button>
            <Button variant="primary" className="me-md-2" onClick={() => navigate('/test-request')}>
              Edit Request
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewSample;
