import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Badge, Table, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faList } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ViewSample = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testRequestId } = useParams();
  const [testRequest, setTestRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [observationsCompleted, setObservationsCompleted] = useState(false);
  
  // Debug: Log the received data
  console.log('ViewSample - location.state:', location.state);
  console.log('ViewSample - formData:', location.state?.formData);
  console.log('ViewSample - pathname:', location.pathname);
  console.log('ViewSample - search:', location.search);
  
  useEffect(() => {
    const fetchTestRequestData = async () => {
      // If testRequestId is in URL, fetch from API
      if (testRequestId) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:5000/api/test-requests/${testRequestId}/details`);
          const data = response.data;
          
          // Build testRequest object from API data
          console.log('🔍 RAW API DATA - concrete_tests:', data.concrete_tests);
          console.log('🔍 First concrete test sample_code_number:', data.concrete_tests?.[0]?.sample_code_number);
          
          const newTestRequest = {
            id: parseInt(testRequestId),
            customerName: data.customer?.name || 'N/A',
            contactPerson: data.customer?.contact_person || 'N/A',
            phone: data.customer?.phone || 'N/A',
            email: data.customer?.email || 'N/A',
            siteName: data.test_request?.site_name || 'N/A',
            siteAddress: data.customer?.address || 'N/A',
            testType: data.test_request?.test_type || 'CC',
            receiptDate: data.test_request?.receipt_date || 'N/A',
            ulrNumber: data.test_request?.ulr_number || 'N/A',
            referenceNumber: data.concrete_tests?.[0]?.sample_code_number || 'N/A',
            jobNumber: data.test_request?.job_number || 'N/A',
            cubeTests: data.concrete_tests?.map((ct, index) => {
              console.log(`🔍 Mapping concrete test ${index}:`, {
                id: ct.id,
                sample_code_number: ct.sample_code_number
              });
              return {
                id: ct.id || (index + 1),
                idMark: ct.idMark,
                locationNature: ct.locationNature,
                grade: ct.grade,
                castingDate: ct.castingDate,
                testingDate: ct.testingDate,
                quantity: ct.quantity,
                testMethod: ct.testMethod,
                sample_code_number: ct.sample_code_number
              };
            }) || []
          };
          
          console.log('✅ BUILT testRequest.referenceNumber:', newTestRequest.referenceNumber);
          console.log('✅ BUILT testRequest.cubeTests[0]?.sample_code_number:', newTestRequest.cubeTests?.[0]?.sample_code_number);
          
          setTestRequest(newTestRequest);
          
          // Check if observations are completed (if any concrete test has results)
          const hasObservations = data.concrete_tests?.some(ct => ct.has_results || ct.observations_completed);
          setObservationsCompleted(hasObservations);
        } catch (error) {
          console.error('Error fetching test request:', error);
          setTestRequest(null);
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to location.state
        const newTestRequest = location.state?.formData;
        setTestRequest(newTestRequest);
        console.log('ViewSample - Using location.state:', newTestRequest);
      }
    };
    
    fetchTestRequestData();
  }, [testRequestId, location.state, location.pathname]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Show skeleton loading state if testRequest is not loaded yet
  if (loading || !testRequest) {
    return (
      <Container className="mt-4">
        <style>
          {`
            @keyframes skeleton-pulse {
              0% { opacity: 1; }
              50% { opacity: 0.4; }
              100% { opacity: 1; }
            }
            .skeleton {
              background: linear-gradient(90deg, #2d3748 25%, #3a4553 50%, #2d3748 75%);
              background-size: 200% 100%;
              animation: skeleton-pulse 1.5s ease-in-out infinite;
              border-radius: 4px;
            }
          `}
        </style>
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <Card.Header style={{ backgroundColor: '#FFA500', padding: '20px' }}>
                <div className="skeleton" style={{ height: '60px', width: '100%' }}></div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="skeleton mb-2" style={{ height: '30px', width: '60%' }}></div>
                    <div className="skeleton mb-2" style={{ height: '150px', width: '100%' }}></div>
                  </Col>
                  <Col md={6}>
                    <div className="skeleton mb-2" style={{ height: '30px', width: '60%' }}></div>
                    <div className="skeleton mb-2" style={{ height: '150px', width: '100%' }}></div>
                  </Col>
                </Row>
                <div className="skeleton mb-2" style={{ height: '30px', width: '50%' }}></div>
                <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Navigation Header */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow">
            <Card.Header className="text-white" style={{ backgroundColor: '#FFA500' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img 
                    src="/logo.png" 
                    alt="Vitrag Associates Logo" 
                    height="40" 
                    className="me-2 d-none d-sm-block"
                  />
                  <div>
                    <h3 className="mb-0 h5 h-md-3">
                      <span style={{ color: '#FFD700' }}>Vitrag Associates LLP</span>
                    </h3>
                    <h4 className="mt-1 h6 h-md-4">Sample Details - {testRequest.jobNumber}</h4>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-light" 
                    onClick={() => navigate(-1)}
                    title="Go Back"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                    <span className="d-none d-sm-inline">Back</span>
                  </Button>
                  <Link 
                    to="/samples" 
                    className="btn btn-outline-light"
                    title="View All Samples"
                  >
                    <FontAwesomeIcon icon={faList} className="me-1" />
                    <span className="d-none d-sm-inline">All Samples</span>
                  </Link>
                </div>
              </div>
            </Card.Header>
          </Card>
        </Col>
      </Row>
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
            <Button 
              variant="light" 
              size="sm" 
              className="px-3 py-2"
              onClick={() => {
                // Navigate to edit test request form with current data
                navigate('/test-request-form', {
                  state: {
                    editMode: true,
                    testRequestData: testRequest
                  }
                });
              }}
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className="fas fa-edit"></i> Edit
            </Button>
            <Button 
              variant={observationsCompleted ? "info" : "warning"} 
              size="sm" 
              className="px-3 py-2"
              onClick={() => {
                const reqId = testRequestId || testRequest?.id;
                console.log('🔍 testRequestId from URL:', testRequestId);
                console.log('🔍 testRequest.id:', testRequest?.id);
                console.log('🔍 testRequest object:', testRequest);
                console.log('🔍 Final reqId:', reqId);
                
                if (!reqId) {
                  alert('Error: Test Request ID is missing!');
                  return;
                }
                
                navigate(`/test-observations/${reqId}`, {
                  state: {
                    testRequest: { ...testRequest, id: reqId },
                    testData: testRequest.cubeTests?.[0],
                    testIndex: 0,
                    editMode: observationsCompleted
                  }
                });
              }}
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = observationsCompleted 
                  ? '0 4px 12px rgba(23, 162, 184, 0.5)' 
                  : '0 4px 12px rgba(255, 193, 7, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {observationsCompleted ? (
                <>
                  <i className="fas fa-edit"></i> Edit Observations
                </>
              ) : (
                <>
                  <i className="fas fa-camera"></i> Capture Images & Observations
                </>
              )}
            </Button>
            <Button 
              variant="warning" 
              size="sm" 
              className="px-3 py-2"
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className="fas fa-chart-bar"></i> Generate Graph
            </Button>
            <Button 
              variant="success" 
              size="sm" 
              className="px-3 py-2"
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
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
              <h4 className="mb-3 mt-4">Testing Requirement (Concrete Cube/Core)</h4>
              <div className="table-responsive mb-4" style={{ overflowX: 'auto' }}>
                <Table bordered hover className="concrete-tests-table" style={{ minWidth: '1400px' }}>
                  <thead style={{ backgroundColor: '#FFC107', color: '#000' }}>
                    <tr>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>Casting Date</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>Testing Date</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>Age in days</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>No of cubes/Cores</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', backgroundColor: '#FFC107' }}>Test Method/Specification</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>Reference Number</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>ULR Number</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>Job Number</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testRequest.cubeTests.map((test, index) => (
                      <tr key={test.id} style={{ backgroundColor: index % 2 === 0 ? '#2d3748' : '#1a202c' }}>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#fff' }}>{formatDate(test.castingDate)}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#fff' }}>{formatDate(test.testingDate)}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#fff' }}>
                          {test.castingDate && test.testingDate ? 
                            Math.ceil((new Date(test.testingDate) - new Date(test.castingDate)) / (1000 * 60 * 60 * 24)) : 
                            'None'
                          }
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#fff' }}>{test.quantity}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#fff' }}>{test.testMethod}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#fff' }}>{test.sample_code_number || testRequest.referenceNumber || 'None'}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#fff' }}>{testRequest.ulrNumber || 'None'}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#fff' }}>{testRequest.jobNumber}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <Button 
                            variant="warning" 
                            size="sm"
                            style={{ whiteSpace: 'nowrap', fontSize: '13px' }}
                            onClick={() => {
                              const reqId = testRequestId || testRequest?.id;
                              navigate(`/test-observations/${reqId}`, {
                                state: {
                                  testRequest: testRequest,
                                  testData: test,
                                  testIndex: index
                                }
                              });
                            }}
                          >
                            <i className="fas fa-plus"></i> Enter Observations
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
          
          
          
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

      {/* Floating Navigation Buttons */}
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <Button
          variant="warning"
          size="lg"
          className="rounded-circle shadow"
          onClick={() => navigate(-1)}
          title="Go Back"
          style={{
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </Button>
        <Link
          to="/samples"
          className="btn btn-warning rounded-circle shadow"
          title="View All Samples"
          style={{
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none'
          }}
        >
          <FontAwesomeIcon icon={faList} size="lg" />
        </Link>
      </div>
    </Container>
  );
};

export default ViewSample;
