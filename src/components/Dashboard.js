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
  faFilePdf,
  faEye,
  faEdit,
  faPaperclip
} from '@fortawesome/free-solid-svg-icons';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useData } from '../contexts/DataContext';
import ConcreteCubeFinalTest from './ConcreteCubeFinalTest';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { testRequests, customers, samples, loading, error, getTestRequestForPDF } = useData();

  // Calculate stats from real data or use sample data
  const sampleStats = {
    totalTests: 188,
    pendingTests: 175,
    completedTests: 13
  };
  
  const stats = testRequests.length > 0 ? {
    totalTests: testRequests.length,
    pendingTests: testRequests.filter(tr => tr.status === 'pending' || tr.status === 'sample-received').length,
    completedTests: testRequests.filter(tr => tr.status === 'completed' || tr.status === 'results-available').length
  } : sampleStats;

  const achievements = [
    { id: 1, name: 'First Test', icon: faVial, requirement: 1, completed: Math.min(stats.totalTests, 1), color: 'success', unlocked: true },
    { id: 2, name: '5 Tests', icon: faMicroscope, requirement: 5, completed: Math.min(stats.totalTests, 5), color: stats.totalTests >= 5 ? 'success' : 'secondary', unlocked: stats.totalTests >= 5 },
    { id: 3, name: '10 Tests', icon: faFlask, requirement: 10, completed: Math.min(stats.totalTests, 10), color: stats.totalTests >= 10 ? 'success' : 'secondary', unlocked: stats.totalTests >= 10 },
    { id: 4, name: '25 Tests', icon: faCog, requirement: 25, completed: Math.min(stats.totalTests, 25), color: stats.totalTests >= 25 ? 'success' : 'secondary', unlocked: stats.totalTests >= 25 },
    { id: 5, name: '50 Tests', icon: faChartLine, requirement: 50, completed: Math.min(stats.totalTests, 50), color: stats.totalTests >= 50 ? 'warning' : 'secondary', unlocked: stats.totalTests >= 50 },
    { id: 6, name: '100 Tests', icon: faCheckCircle, requirement: 100, completed: Math.min(stats.totalTests, 100), color: stats.totalTests >= 100 ? 'danger' : 'secondary', unlocked: stats.totalTests >= 100 }
  ];

  // Use real test data from database or sample data
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
      jobNumber: 'T-2501690',
      customer: 'Lords Developers Shivyogi Residency',
      site: 'shivyogi residency',
      receiptDate: '25-08-2025',
      status: 'results-available',
      statusText: 'Results Available'
    },
    {
      id: 2,
      jobNumber: 'T-2501609',
      customer: 'Maheshwari Constrosolution Wadia Hospital',
      site: 'Wadia Hospital',
      receiptDate: '18-08-2025',
      status: 'sample-received',
      statusText: 'Sample Received'
    },
    {
      id: 3,
      jobNumber: '2088888',
      customer: 'Ishan Kishan',
      site: 'pune',
      receiptDate: '08-09-2025',
      status: 'results-available',
      statusText: 'Results Available'
    },
    {
      id: 4,
      jobNumber: '1414141414',
      customer: 'Shashwat Paratwar',
      site: 'Pune',
      receiptDate: '04-09-2025',
      status: 'results-available',
      statusText: 'Results Available'
    },
    {
      id: 5,
      jobNumber: '-',
      customer: 'Dhananjay Dube',
      site: 'Pune',
      receiptDate: '03-09-2025',
      status: 'sample-received',
      statusText: 'Sample Received'
    },
    {
      id: 6,
      jobNumber: '1896321',
      customer: 'KI Rahul',
      site: 'hhH',
      receiptDate: '14-08-2025',
      status: 'results-available',
      statusText: 'Results Available'
    },
    {
      id: 7,
      jobNumber: 'T-2501500',
      customer: 'Rishabh Pant',
      site: 'Delhi',
      receiptDate: '03-08-2025',
      status: 'results-available',
      statusText: 'Results Available'
    },
    {
      id: 8,
      jobNumber: 'T-2501501',
      customer: 'Paras Mudholkar',
      site: 'Mumbai',
      receiptDate: '03-08-2025',
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
      'results-available': 'warning',
      'completed': 'success'
    };
    return variants[status] || 'secondary';
  };

  const filteredTests = testData.filter(test => {
    if (activeTab === 'pending') return test.status === 'pending' || test.status === 'sample-received';
    if (activeTab === 'completed') return test.status === 'completed' || test.status === 'results-available';
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
            <div style={{
              background: '#1C2333',
              borderRadius: '15px',
              padding: '0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden'
            }}>
              {/* Tab Navigation */}
              <div style={{
                background: '#1C2333',
                padding: '0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div className="d-flex">
                  <button
                    onClick={() => setActiveTab('pending')}
                    style={{
                      background: activeTab === 'pending' ? '#FFA500' : 'transparent',
                      color: activeTab === 'pending' ? '#000000' : '#ffffff',
                      border: 'none',
                      padding: '15px 25px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderBottom: activeTab === 'pending' ? '3px solid #FFA500' : '3px solid transparent'
                    }}
                  >
                    Pending Tests
                  </button>
                  <button
                    onClick={() => setActiveTab('completed')}
                    style={{
                      background: activeTab === 'completed' ? '#FFA500' : 'transparent',
                      color: activeTab === 'completed' ? '#000000' : '#ffffff',
                      border: 'none',
                      padding: '15px 25px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderBottom: activeTab === 'completed' ? '3px solid #FFA500' : '3px solid transparent'
                    }}
                  >
                    Completed Tests
                  </button>
                  <button
                    onClick={() => setActiveTab('all')}
                    style={{
                      background: activeTab === 'all' ? '#FFA500' : 'transparent',
                      color: activeTab === 'all' ? '#000000' : '#ffffff',
                      border: 'none',
                      padding: '15px 25px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderBottom: activeTab === 'all' ? '3px solid #FFA500' : '3px solid transparent'
                    }}
                  >
                    All Tests
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div style={{
                background: '#1C2333',
                padding: '20px'
              }}>
                <div className="table-responsive">
                  <Table style={{
                    backgroundColor: '#1C2333',
                    color: '#ffffff',
                    margin: '0',
                    borderCollapse: 'collapse',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <thead>
                      <tr style={{
                        background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))',
                        borderBottom: '2px solid #FFA500'
                      }}>
                        <th style={{ 
                          color: '#FFD700', 
                          fontWeight: '600',
                          padding: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'transparent'
                        }}>
                          <Form.Check type="checkbox" style={{ color: '#FFD700' }} />
                        </th>
                        <th style={{ 
                          color: '#FFD700', 
                          fontWeight: '600',
                          padding: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'transparent'
                        }}>Job Number</th>
                        <th style={{ 
                          color: '#FFD700', 
                          fontWeight: '600',
                          padding: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'transparent'
                        }}>Customer</th>
                        <th style={{ 
                          color: '#FFD700', 
                          fontWeight: '600',
                          padding: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'transparent'
                        }}>Site</th>
                        <th style={{ 
                          color: '#FFD700', 
                          fontWeight: '600',
                          padding: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'transparent'
                        }}>Receipt Date</th>
                        <th style={{ 
                          color: '#FFD700', 
                          fontWeight: '600',
                          padding: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'transparent'
                        }}>Status</th>
                        <th style={{ 
                          color: '#FFD700', 
                          fontWeight: '600',
                          padding: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'transparent'
                        }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTests.map((test, index) => (
                        <tr key={test.id} style={{
                          background: index % 2 === 0 ? '#1C2333' : 'rgba(255, 255, 255, 0.02)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = index % 2 === 0 ? '#1C2333' : 'rgba(255, 255, 255, 0.02)';
                        }}
                        >
                          <td style={{ 
                            padding: '15px', 
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff'
                          }}>
                            <Form.Check type="checkbox" style={{ color: '#ffffff' }} />
                          </td>
                          <td style={{ 
                            padding: '15px', 
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            fontWeight: '500'
                          }}>{test.jobNumber}</td>
                          <td style={{ 
                            padding: '15px', 
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            fontWeight: '500'
                          }}>{test.customer}</td>
                          <td style={{ 
                            padding: '15px', 
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            fontWeight: '500'
                          }}>{test.site}</td>
                          <td style={{ 
                            padding: '15px', 
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            fontWeight: '500'
                          }}>{test.receiptDate}</td>
                          <td style={{ 
                            padding: '15px', 
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}>
                            <Button 
                              size="sm" 
                              variant={test.status === 'sample-received' ? 'success' : 'warning'}
                              style={{
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontWeight: '600',
                                boxShadow: test.status === 'sample-received' ? '0 2px 8px rgba(40, 167, 69, 0.3)' : '0 2px 8px rgba(255, 193, 7, 0.3)',
                                border: 'none',
                                backgroundColor: test.status === 'sample-received' ? '#28a745' : '#ffc107',
                                color: test.status === 'sample-received' ? '#ffffff' : '#000000',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              {test.status === 'sample-received' ? (
                                <FontAwesomeIcon icon={faPaperclip} />
                              ) : (
                                <FontAwesomeIcon icon={faChartLine} />
                              )}
                              {test.statusText}
                            </Button>
                          </td>
                          <td style={{ 
                            padding: '15px', 
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}>
                            <div className="d-flex gap-2">
                              <Button 
                                size="sm" 
                                variant="info"
                                style={{
                                  borderRadius: '8px',
                                  padding: '6px 12px',
                                  fontWeight: '500',
                                  backgroundColor: 'rgba(13, 202, 240, 0.1)',
                                  border: '1px solid #0dcaf0',
                                  color: '#0dcaf0'
                                }}
                              >
                                <FontAwesomeIcon icon={faEye} className="me-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="info"
                                style={{
                                  borderRadius: '8px',
                                  padding: '6px 12px',
                                  fontWeight: '500',
                                  backgroundColor: 'rgba(13, 202, 240, 0.1)',
                                  border: '1px solid #0dcaf0',
                                  color: '#0dcaf0'
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} className="me-1" />
                                Edit
                              </Button>
                              {test.status === 'sample-received' && (
                                <Button 
                                  size="sm" 
                                  variant="primary"
                                  style={{
                                    borderRadius: '8px',
                                    padding: '6px 12px',
                                    fontWeight: '500',
                                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                                    border: '1px solid #0d6efd',
                                    color: '#0d6efd'
                                  }}
                                >
                                  <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                                  Complete Test
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

    </div>
  );
};

export default Dashboard;
