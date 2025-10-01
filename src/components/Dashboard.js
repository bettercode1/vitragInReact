import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Tab, Tabs, Table, Form, Dropdown, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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
  faPaperclip,
  faHourglass
} from '@fortawesome/free-solid-svg-icons';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { getDashboardData } from '../apis/dashboard';
import ConcreteCubeFinalTest from './ConcreteCubeFinalTest';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_tests: 0,
      pending_tests: 0,
      completed_tests: 0,
      recent_tests: 0,
      completion_rate: 0
    },
    recentTests: [],
    pendingTests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to refresh data - following Customers page pattern
  const refreshData = async () => {
    await fetchDashboardData();
  };

  // Fetch dashboard data - following Customers page pattern
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching fresh dashboard data from API');
      const data = await getDashboardData();
      console.log('Dashboard data received:', data);
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Use real data from API
  const stats = {
    totalTests: dashboardData.stats.total_tests,
    pendingTests: dashboardData.stats.pending_tests,
    completedTests: dashboardData.stats.completed_tests,
    recentTests: dashboardData.stats.recent_tests,
    completionRate: dashboardData.stats.completion_rate
  };

  const achievements = [
    { id: 1, name: 'First Test', icon: faVial, requirement: 1, completed: Math.min(stats.totalTests, 1), color: 'success', unlocked: true },
    { id: 2, name: '5 Tests', icon: faMicroscope, requirement: 5, completed: Math.min(stats.totalTests, 5), color: stats.totalTests >= 5 ? 'success' : 'secondary', unlocked: stats.totalTests >= 5 },
    { id: 3, name: '10 Tests', icon: faFlask, requirement: 10, completed: Math.min(stats.totalTests, 10), color: stats.totalTests >= 10 ? 'success' : 'secondary', unlocked: stats.totalTests >= 10 },
    { id: 4, name: '25 Tests', icon: faCog, requirement: 25, completed: Math.min(stats.totalTests, 25), color: stats.totalTests >= 25 ? 'success' : 'secondary', unlocked: stats.totalTests >= 25 },
    { id: 5, name: '50 Tests', icon: faChartLine, requirement: 50, completed: Math.min(stats.totalTests, 50), color: stats.totalTests >= 50 ? 'warning' : 'secondary', unlocked: stats.totalTests >= 50 },
    { id: 6, name: '100 Tests', icon: faCheckCircle, requirement: 100, completed: Math.min(stats.totalTests, 100), color: stats.totalTests >= 100 ? 'danger' : 'secondary', unlocked: stats.totalTests >= 100 }
  ];

  // Use real test data from API
  const testData = dashboardData.recentTests.map(test => ({
    id: test.id,
    jobNumber: test.job_number,
    customer: test.customer_name,
    site: test.site_name,
    receiptDate: test.receipt_date ? new Date(test.receipt_date).toLocaleDateString('en-GB') : 'N/A',
    status: test.status || 'pending',
    statusText: test.status === 'completed' || test.status === 'test_completed' ? 'Test Completed' : 
                test.status === 'sample-received' ? 'Sample Received' :
                test.status === 'observations_completed' ? 'Observations Completed' :
                test.status === 'graph_generated' ? 'Graph Generated' :
                'Pending'
  }));

  // Debug: Log the data to console
  console.log('Dashboard Debug:', {
    totalRecentTests: dashboardData.recentTests.length,
    totalTestData: testData.length,
    firstFewTests: testData.slice(0, 5)
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FontAwesomeIcon icon={faClock} className="text-secondary" />;
      case 'sample-received':
        return <FontAwesomeIcon icon={faVial} className="text-warning" />;
      case 'observations_completed':
        return <FontAwesomeIcon icon={faClipboardCheck} className="text-info" />;
      case 'graph_generated':
        return <FontAwesomeIcon icon={faChartLine} className="text-primary" />;
      case 'completed':
      case 'test_completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
      default:
        return <FontAwesomeIcon icon={faClock} className="text-secondary" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'secondary',
      'sample-received': 'warning',
      'observations_completed': 'info',
      'graph_generated': 'primary',
      'completed': 'success',
      'test_completed': 'success'
    };
    return variants[status] || 'secondary';
  };

  const filteredTests = testData.filter(test => {
    // Apply tab filter first
    let tabMatch = true;
    if (activeTab === 'pending') tabMatch = test.status === 'pending' || test.status === 'sample-received' || test.status === 'observations_completed' || test.status === 'graph_generated';
    if (activeTab === 'completed') tabMatch = test.status === 'completed' || test.status === 'test_completed' || test.status === 'results-available';
    
    // Apply search filter
    const searchMatch = !searchQuery || 
      test.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.site.toLowerCase().includes(searchQuery.toLowerCase());
    
    return tabMatch && searchMatch;
  });

  // Debug: Log filtered tests
  console.log('Filtered Tests Debug:', {
    activeTab,
    totalFilteredTests: filteredTests.length,
    firstFewFiltered: filteredTests.slice(0, 5)
  });

  const nextAchievement = achievements.find(a => !a.unlocked) || achievements[achievements.length - 1];
  const progressToNext = (stats.completedTests / nextAchievement.requirement) * 100;

  // Get real data for PDF generation - use actual API data
  const pdfTestData = dashboardData.recentTests.length > 0 ? {
    test_request: dashboardData.recentTests[0],
    customer: {
      name: dashboardData.recentTests[0].customer_name,
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
  } : null;

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

  // Show loading state with skeleton loading
  if (loading) {
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
          {/* Stats Skeleton */}
          <Row className="mb-5">
            {[1, 2, 3].map(i => (
              <Col lg={4} md={6} key={i} className="mb-4">
                <div style={{
                  background: 'linear-gradient(90deg, #2a3441 25%, #3a4451 50%, #2a3441 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-loading 1.5s infinite',
                  borderRadius: '15px',
                  padding: '30px',
                  height: '150px',
                  border: '1px solid rgba(255, 165, 0, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    height: '40px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    width: '60%'
                  }}></div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    height: '20px',
                    borderRadius: '4px',
                    width: '80%'
                  }}></div>
                </div>
              </Col>
            ))}
          </Row>

          {/* Table Skeleton */}
          <Row>
            <Col>
              <div style={{
                background: '#1C2333',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 165, 0, 0.2)'
              }}>
                {/* Tab Skeleton */}
                <div className="d-flex mb-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      height: '50px',
                      width: '150px',
                      borderRadius: '8px',
                      marginRight: '10px'
                    }}></div>
                  ))}
                </div>

                {/* Table Rows Skeleton */}
                <div>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{
                      background: 'linear-gradient(90deg, #2a3441 25%, #3a4451 50%, #2a3441 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'skeleton-loading 1.5s infinite',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '10px',
                      height: '60px'
                    }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          height: '20px',
                          width: '20px',
                          borderRadius: '4px'
                        }}></div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          height: '20px',
                          width: '120px',
                          borderRadius: '4px'
                        }}></div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          height: '20px',
                          width: '150px',
                          borderRadius: '4px'
                        }}></div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          height: '20px',
                          width: '100px',
                          borderRadius: '4px'
                        }}></div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          height: '20px',
                          width: '80px',
                          borderRadius: '4px'
                        }}></div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          height: '20px',
                          width: '100px',
                          borderRadius: '4px'
                        }}></div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          height: '20px',
                          width: '200px',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <style jsx>{`
          @keyframes skeleton-loading {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <h4 className="alert-heading">Dashboard Error</h4>
          <p>Unable to load dashboard data: {error}</p>
          <hr />
          <p className="mb-0">Please check your connection and try again.</p>
        </Alert>
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



        {/* Search Bar */}
        <Row className="mb-4">
          <Col>
            <div style={{
              background: '#1C2333',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 165, 0, 0.2)'
            }}>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 me-3">
                  <Form.Control
                    type="text"
                    placeholder="Search by Job Number, Customer, or Site..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 165, 0, 0.3)',
                      color: '#ffffff',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div className="d-flex align-items-center gap-3">
                  <Button 
                    variant="outline-warning" 
                    size="sm"
                    onClick={refreshData}
                    disabled={loading}
                    style={{
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: '500'
                    }}
                  >
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                  </Button>
                  <div className="text-muted">
                    <small>
                      {filteredTests.length} of {testData.length} tests
                    </small>
                  </div>
                </div>
              </div>
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
              overflow: 'visible'
            }}>
              {/* Tab Navigation */}
              <div style={{
                background: '#1C2333',
                padding: '0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div className="d-flex">
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
                </div>
              </div>

              {/* Table Container */}
              <div style={{
                background: '#1C2333',
                padding: '20px',
                maxHeight: 'none',
                overflow: 'visible'
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
                              variant={
                                test.status === 'test_completed' || test.status === 'completed' ? 'success' :
                                test.status === 'observations_completed' ? 'info' :
                                test.status === 'graph_generated' ? 'primary' :
                                'warning'
                              }
                              style={{
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontWeight: '600',
                                boxShadow: 
                                  test.status === 'test_completed' || test.status === 'completed' ? '0 2px 8px rgba(40, 167, 69, 0.3)' :
                                  test.status === 'observations_completed' ? '0 2px 8px rgba(13, 202, 240, 0.3)' :
                                  test.status === 'graph_generated' ? '0 2px 8px rgba(13, 110, 253, 0.3)' :
                                  '0 2px 8px rgba(255, 193, 7, 0.3)',
                                border: 'none',
                                backgroundColor: 
                                  test.status === 'test_completed' || test.status === 'completed' ? '#28a745' :
                                  test.status === 'observations_completed' ? '#0dcaf0' :
                                  test.status === 'graph_generated' ? '#0d6efd' :
                                  '#ffc107',
                                color: 
                                  test.status === 'test_completed' || test.status === 'completed' ? '#ffffff' :
                                  test.status === 'observations_completed' ? '#000000' :
                                  test.status === 'graph_generated' ? '#ffffff' :
                                  '#000000',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              {test.status === 'test_completed' || test.status === 'completed' ? (
                                <FontAwesomeIcon icon={faCheckCircle} />
                              ) : test.status === 'observations_completed' ? (
                                <FontAwesomeIcon icon={faPaperclip} />
                              ) : test.status === 'graph_generated' ? (
                                <FontAwesomeIcon icon={faChartLine} />
                              ) : (
                                <FontAwesomeIcon icon={faHourglass} />
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
                                onClick={() => navigate(`/view-sample/${test.id}`)}
                                style={{
                                  borderRadius: '8px',
                                  padding: '6px 12px',
                                  fontWeight: '500',
                                  backgroundColor: 'rgba(13, 202, 240, 0.1)',
                                  border: '1px solid #0dcaf0',
                                  color: '#0dcaf0',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 202, 240, 0.5)';
                                  e.currentTarget.style.backgroundColor = 'rgba(13, 202, 240, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.boxShadow = 'none';
                                  e.currentTarget.style.backgroundColor = 'rgba(13, 202, 240, 0.1)';
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
                                  color: '#0dcaf0',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 202, 240, 0.5)';
                                  e.currentTarget.style.backgroundColor = 'rgba(13, 202, 240, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.boxShadow = 'none';
                                  e.currentTarget.style.backgroundColor = 'rgba(13, 202, 240, 0.1)';
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
                                    color: '#0d6efd',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.5)';
                                    e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.2)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.1)';
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
