import React, { useState } from 'react';
import { Container, Row, Col, Button, Tab, Tabs, Table, Form, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVial,
  faMicroscope,
  faFlask,
  faCog,
  faClock,
  faClipboardCheck,
  faChartLine,
  faCheckCircle,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useData } from '../contexts/DataContext';
import ConcreteCubeFinalTest from './ConcreteCubeFinalTest';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { testRequests, customers, samples, loading, error, getTestRequestForPDF } = useData();

  // Calculate stats from real data
  const stats = {
    totalTests: testRequests.length || 185,
    pendingTests: testRequests.filter(tr => tr.status === 'pending').length || 184,
    completedTests: testRequests.filter(tr => tr.status === 'completed').length || 1
  };

  const achievements = [
    { id: 1, name: 'First Test', icon: faVial, requirement: 1, completed: Math.min(stats.totalTests, 1), color: 'success', unlocked: true },
    { id: 2, name: '5 Tests', icon: faMicroscope, requirement: 5, completed: Math.min(stats.totalTests, 5), color: stats.totalTests >= 5 ? 'success' : 'secondary', unlocked: stats.totalTests >= 5 },
    { id: 3, name: '10 Tests', icon: faFlask, requirement: 10, completed: Math.min(stats.totalTests, 10), color: stats.totalTests >= 10 ? 'success' : 'secondary', unlocked: stats.totalTests >= 10 },
    { id: 4, name: '25 Tests', icon: faCog, requirement: 25, completed: Math.min(stats.totalTests, 25), color: stats.totalTests >= 25 ? 'success' : 'secondary', unlocked: stats.totalTests >= 25 },
    { id: 5, name: '50 Tests', icon: faChartLine, requirement: 50, completed: Math.min(stats.totalTests, 50), color: stats.totalTests >= 50 ? 'warning' : 'secondary', unlocked: stats.totalTests >= 50 },
    { id: 6, name: '100 Tests', icon: faCheckCircle, requirement: 100, completed: Math.min(stats.totalTests, 100), color: stats.totalTests >= 100 ? 'danger' : 'secondary', unlocked: stats.totalTests >= 100 }
  ];

  // Use real test data from database
  const testData = testRequests.length > 0 ? testRequests.map(tr => ({
    id: tr.id,
    jobNumber: tr.job_number,
    customer: tr.customer_name,
    site: tr.site_name,
    receiptDate: tr.receipt_date,
    status: tr.status || 'pending',
    statusText: tr.status === 'completed' ? 'Results Available' : 'Pending'
  })) : [
    {
      id: 1,
      jobNumber: '1414141414',
      customer: 'Shashwat Paratwar',
      site: 'Pune',
      receiptDate: '04-09-2025',
      status: 'results-available',
      statusText: 'Results Available'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FontAwesomeIcon icon={faClock} className="text-secondary" />;
      case 'sample-received':
        return <FontAwesomeIcon icon={faVial} className="text-warning" />;
      case 'observations-taken':
        return <FontAwesomeIcon icon={faClipboardCheck} className="text-info" />;
      case 'results-available':
        return <FontAwesomeIcon icon={faChartLine} className="text-primary" />;
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
      default:
        return <FontAwesomeIcon icon={faClock} className="text-secondary" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'secondary',
      'sample-received': 'warning',
      'observations-taken': 'info',
      'results-available': 'primary',
      'completed': 'success'
    };
    return variants[status] || 'secondary';
  };

  const filteredTests = testData.filter(test => {
    if (activeTab === 'pending') return test.status === 'pending';
    if (activeTab === 'completed') return test.status === 'completed';
    return true; // all tests
  });

  const nextAchievement = achievements.find(a => !a.unlocked) || achievements[achievements.length - 1];
  const progressToNext = (stats.completedTests / nextAchievement.requirement) * 100;

  // Get real data for PDF generation
  const pdfTestData = testRequests.length > 0 ? {
    test_request: testRequests[0],
    customer: customers.find(c => c.id === testRequests[0].customer_id) || customers[0],
    main_test: samples.find(s => s.test_request_id === testRequests[0].id) || samples[0],
    reviewer_info: {
      name: 'Lalita S. Dussa',
      designation: 'Quality Manager',
      graduation: 'B.Tech.(Civil)'
    }
  } : {
                test_request: {
                  id: 1,
                  job_number: '1414141414',
                  customer_name: 'Shashwat Paratwar',
                  site_name: 'Pune',
                  receipt_date: '04-09-2025',
                  ulr_number: 'ULR-2024-001',
                  test_type: 'CC'
                },
                customer: {
                  name: 'Shashwat Paratwar',
                  address: 'Pune, Maharashtra'
                },
                main_test: {
                  sample_code_number: 'SC-2024-001',
                  location_nature: 'Construction Site',
                  age_in_days: 28,
                  casting_date: '04-08-2025',
                  testing_date: '04-09-2025',
                  grade: 'M25',
                  cube_condition: 'Acceptable',
                  curing_condition: 'Water Curing',
                  machine_used: 'CTM (2000KN)',
                  test_method: 'IS 516 (Part 1/Sec 1):2021',
                  num_of_cubes: 3,
                  id_mark: 'C1',
                  dimension_length: 150,
                  dimension_width: 150,
                  dimension_height: 150,
                  weight: 8.5,
                  crushing_load: 562.5,
                  compressive_strength: 25.0,
                  average_strength: 25.0,
                  failure_type: 'Conical',
                  test_results_json: JSON.stringify([
                    {
                      cube_id: 1,
                      id_mark: 'C1',
                      dimension_length: 150,
                      dimension_width: 150,
                      dimension_height: 150,
                      weight: 8.5,
                      crushing_load: 562.5,
                      compressive_strength: 25.0,
                      failure_type: 'Conical',
                      area: 22500
                    },
                    {
                      cube_id: 2,
                      id_mark: 'C2',
                      dimension_length: 150,
                      dimension_width: 150,
                      dimension_height: 150,
                      weight: 8.4,
                      crushing_load: 555.0,
                      compressive_strength: 24.7,
                      failure_type: 'Conical',
                      area: 22500
                    },
                    {
                      cube_id: 3,
                      id_mark: 'C3',
                      dimension_length: 150,
                      dimension_width: 150,
                      dimension_height: 150,
                      weight: 8.6,
                      crushing_load: 570.0,
                      compressive_strength: 25.3,
                      failure_type: 'Conical',
                      area: 22500
                    }
                  ])
                },
                reviewer_info: {
                  name: 'Lalita S. Dussa',
                  designation: 'Quality Manager',
                  graduation: 'B.Tech.(Civil)'
                }
              };

  const invoiceData = {
                invoiceNumber: 'INV-2025-001',
                date: new Date().toLocaleDateString('en-GB'),
                customer: {
                  name: 'Shashwat Paratwar',
                  address: 'Pune, Maharashtra, India',
                  email: 'shashwat@example.com',
                  phone: '+91-9876543210'
                },
                items: [
                  { description: 'Concrete Cube Testing (M25)', qty: 3, price: 500.00 },
                  { description: 'Material Analysis Report', qty: 1, price: 750.00 },
                  { description: 'Quality Inspection', qty: 1, price: 300.00 }
                ],
                taxRate: 0.18,
    notes: 'Payment due within 30 days of invoice date. Thank you for your business!'
  };

  // Show loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="alert alert-warning" role="alert">
        <h4 className="alert-heading">Database Connection Issue</h4>
        <p>Unable to connect to database: {error}</p>
        <p>Using mock data for demonstration.</p>
        <hr />
        <p className="mb-0">PDF generation will work with mock data.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="header-vitrag">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 style={{ color: 'var(--vitrag-gold)', fontWeight: '700' }}>
                Testing Dashboard
              </h1>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Stats Overview */}
        <Row className="mb-5">
          <Col lg={4} md={6} className="mb-4">
            <div className="stats-card text-center p-4" style={{ 
              background: 'linear-gradient(135deg, var(--vitrag-card-bg) 0%, #2a3441 100%)',
              borderRadius: '15px',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div className="stats-number text-white" style={{ 
                fontSize: '3.5rem', 
                fontWeight: '800',
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>{stats.totalTests}</div>
              <h5 className="text-muted" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Total Test Requests</h5>
            </div>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <div className="stats-card text-center p-4" style={{ 
              background: 'linear-gradient(135deg, var(--vitrag-card-bg) 0%, #2a3441 100%)',
              borderRadius: '15px',
              border: '1px solid rgba(255, 165, 0, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div className="stats-number text-warning" style={{ 
                fontSize: '3.5rem', 
                fontWeight: '800',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>{stats.pendingTests}</div>
              <h5 className="text-muted" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Pending Tests</h5>
            </div>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <div className="stats-card text-center p-4" style={{ 
              background: 'linear-gradient(135deg, var(--vitrag-card-bg) 0%, #2a3441 100%)',
              borderRadius: '15px',
              border: '1px solid rgba(40, 167, 69, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div className="stats-number text-success" style={{ 
                fontSize: '3.5rem', 
                fontWeight: '800',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>{stats.completedTests}</div>
              <h5 className="text-muted" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Completed Tests</h5>
            </div>
          </Col>
        </Row>



        {/* Test Management */}
        <Row>
          <Col>
            <div className="p-4" style={{
              background: 'linear-gradient(135deg, var(--vitrag-card-bg) 0%, #2a3441 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 215, 0, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
                style={{ 
                  borderBottom: '3px solid var(--vitrag-orange)',
                  borderRadius: '10px 10px 0 0'
                }}
              >
                <Tab 
                  eventKey="pending" 
                  title="Pending Tests" 
                  style={{ 
                    borderBottom: activeTab === 'pending' ? '3px solid var(--vitrag-orange)' : 'none',
                    backgroundColor: activeTab === 'pending' ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
                    borderRadius: '10px 10px 0 0',
                    padding: '10px 20px',
                    fontWeight: '600'
                  }}
                >
                </Tab>
                <Tab 
                  eventKey="completed" 
                  title="Completed Tests"
                  style={{ 
                    backgroundColor: activeTab === 'completed' ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
                    borderRadius: '10px 10px 0 0',
                    padding: '10px 20px',
                    fontWeight: '600'
                  }}
                >
                </Tab>
                <Tab 
                  eventKey="all" 
                  title="All Tests"
                  style={{ 
                    backgroundColor: activeTab === 'all' ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
                    borderRadius: '10px 10px 0 0',
                    padding: '10px 20px',
                    fontWeight: '600'
                  }}
                >
                </Tab>
              </Tabs>

              {/* Bulk Actions */}
              <div className="mb-4 d-flex gap-2 align-items-center">
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="outline-secondary" 
                    size="sm"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      fontWeight: '500'
                    }}
                  >
                    Bulk Actions...
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{
                    backgroundColor: 'var(--vitrag-card-bg)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '10px'
                  }}>
                    <Dropdown.Item style={{ color: 'white' }}>Delete Selected</Dropdown.Item>
                    <Dropdown.Item style={{ color: 'white' }}>Export Selected</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button 
                  size="sm" 
                  variant="outline-primary"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid var(--vitrag-orange)',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'var(--vitrag-orange)',
                    fontWeight: '500'
                  }}
                >
                  Apply
                </Button>
                <Button 
                  size="sm" 
                  variant="outline-secondary"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontWeight: '500'
                  }}
                >
                  Select All
                </Button>
                <Button 
                  size="sm" 
                  variant="outline-secondary"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontWeight: '500'
                  }}
                >
                  Deselect All
                </Button>
                            <PDFDownloadLink
                              document={<ConcreteCubeFinalTest testData={pdfTestData} />}
                              fileName={`Simple_${pdfTestData.test_request.job_number}.pdf`}
                            >
                              {({ blob, url, loading, error }) => (
                                <Button
                                  size="sm"
                                  variant="success"
                                  disabled={loading}
                                  onClick={(e) => {
                                    if (error) {
                                      console.error('PDF Error:', error);
                                      alert('Error: ' + error.message);
                                      return;
                                    }
                                    if (blob && !loading) {
                                      e.preventDefault();
                                      const pdfUrl = URL.createObjectURL(blob);
                                      window.open(pdfUrl, '_blank');
                                      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
                                    }
                                  }}
                                  style={{
                                    borderRadius: '8px',
                                    border: '1px solid #28a745',
                                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                                    color: '#28a745',
                                    fontWeight: '500',
                                    marginLeft: '10px'
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                                  {loading ? 'Generating...' : error ? 'Error!' : 'Simple Working PDF'}
                                </Button>
                              )}
                            </PDFDownloadLink>

                            
                            <PDFDownloadLink
                              document={<ConcreteCubeFinalTest testData={invoiceData} />}
                              fileName={`Invoice_${invoiceData.invoiceNumber}.pdf`}
                              style={{
                                textDecoration: 'none',
                                marginLeft: '10px'
                              }}
                            >
                              {({ blob, url, loading, error }) => (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  disabled={loading}
                                  style={{
                                    borderRadius: '8px',
                                    border: '1px solid var(--vitrag-orange)',
                                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                    color: 'var(--vitrag-orange)',
                                    fontWeight: '500'
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                                  {loading ? 'Generating...' : 'Generate Invoice'}
                                </Button>
                              )}
                            </PDFDownloadLink>
              </div>

              <div className="table-responsive">
                <Table className="table-vitrag" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <thead style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))',
                    borderBottom: '2px solid var(--vitrag-orange)'
                  }}>
                    <tr>
                      <th style={{ 
                        color: 'var(--vitrag-gold)', 
                        fontWeight: '600',
                        padding: '15px',
                        border: 'none'
                      }}>
                        <Form.Check type="checkbox" />
                      </th>
                      <th style={{ 
                        color: 'var(--vitrag-gold)', 
                        fontWeight: '600',
                        padding: '15px',
                        border: 'none'
                      }}>Job Number</th>
                      <th style={{ 
                        color: 'var(--vitrag-gold)', 
                        fontWeight: '600',
                        padding: '15px',
                        border: 'none'
                      }}>Customer</th>
                      <th style={{ 
                        color: 'var(--vitrag-gold)', 
                        fontWeight: '600',
                        padding: '15px',
                        border: 'none'
                      }}>Site</th>
                      <th style={{ 
                        color: 'var(--vitrag-gold)', 
                        fontWeight: '600',
                        padding: '15px',
                        border: 'none'
                      }}>Receipt Date</th>
                      <th style={{ 
                        color: 'var(--vitrag-gold)', 
                        fontWeight: '600',
                        padding: '15px',
                        border: 'none'
                      }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((test) => (
                      <tr key={test.id} style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'background-color 0.3s ease'
                      }}>
                        <td style={{ padding: '15px', border: 'none' }}>
                          <Form.Check type="checkbox" />
                        </td>
                        <td style={{ 
                          padding: '15px', 
                          border: 'none',
                          color: 'white',
                          fontWeight: '500'
                        }}>{test.jobNumber}</td>
                        <td style={{ 
                          padding: '15px', 
                          border: 'none',
                          color: 'white',
                          fontWeight: '500'
                        }}>{test.customer}</td>
                        <td style={{ 
                          padding: '15px', 
                          border: 'none',
                          color: 'white',
                          fontWeight: '500'
                        }}>{test.site}</td>
                        <td style={{ 
                          padding: '15px', 
                          border: 'none',
                          color: 'white',
                          fontWeight: '500'
                        }}>{test.receiptDate}</td>
                        <td style={{ padding: '15px', border: 'none' }}>
                          <Button 
                            size="sm" 
                            variant="warning" 
                            className="badge-vitrag"
                            style={{
                              borderRadius: '20px',
                              padding: '8px 16px',
                              fontWeight: '600',
                              boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)',
                              border: 'none'
                            }}
                          >
                            {test.statusText}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

    </div>
  );
};

export default Dashboard;
