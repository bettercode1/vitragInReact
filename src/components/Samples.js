import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faChartLine, 
  faFilePdf,
  faVial,
  faUser,
  faBuilding,
  faSearch,
  faFilter,
  faCube,
  faCalendarAlt,
  faCalendarCheck,
  faTimes,
  faSyncAlt,
  faEye,
  faClipboardCheck,
  faPlus,
  faArrowLeft,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import databaseService from '../services/database';
import './Samples.css';

const Samples = () => {
  const navigate = useNavigate();
  const [apiTestRequests, setApiTestRequests] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filteredData, setFilteredData] = useState([]);

  // Fetch test requests from API - following Customers page pattern
  const fetchTestRequests = async () => {
    try {
      setApiLoading(true);
      setApiError(null);
      console.log('🔍 Fetching test requests from API...');
      
      // Fetch all data without pagination
      const data = await databaseService.getTestRequests();
      
      console.log('📊 API Response:', data);
      console.log('📊 API Response type:', typeof data);
      console.log('📊 API Response is array:', Array.isArray(data));
      console.log('📊 Number of test requests received:', data?.length || 'undefined');
      console.log('📊 First item:', data?.[0] || 'No first item');
      setApiTestRequests(data || []);
    } catch (err) {
      console.error('❌ Error fetching test requests:', err);
      setApiError('Failed to fetch test requests');
      setApiTestRequests([]);
    } finally {
      setApiLoading(false);
    }
  };

  // Refresh data when component mounts
  useEffect(() => {
    fetchTestRequests();
  }, []);

  // Use ONLY API data - no fallbacks to mock data
  const testRequestsData = apiTestRequests;
  
  // Debug logging
  console.log('🔍 Data Sources:', {
    apiTestRequests: apiTestRequests.length,
    finalData: testRequestsData.length,
    dataSource: 'API Only',
    firstItem: testRequestsData[0] || 'No data'
  });

  const applyFilters = useCallback(() => {
    console.log('🔍 applyFilters called with testRequestsData:', testRequestsData.length);
    
    // Don't apply filters if we don't have data yet
    if (!testRequestsData || testRequestsData.length === 0) {
      console.log('🔍 No data to filter, setting empty array');
      setFilteredData([]);
      return;
    }
    
    let filtered = [...testRequestsData];
    console.log('🔍 Initial filtered length:', filtered.length);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.job_number?.toLowerCase().includes(query) ||
        item.customer_name?.toLowerCase().includes(query) ||
        item.site_name?.toLowerCase().includes(query)
      );
      console.log('🔍 After search filter:', filtered.length);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(item => {
        if (typeFilter === 'cube') return item.concrete_tests?.length > 0;
        if (typeFilter === 'sand') return item.river_sand || item.crushed_sand || item.m_sand || item.p_sand;
        if (typeFilter === 'cement') return item.cement;
        if (typeFilter === 'other') return item.materials?.length > 0;
        return true;
      });
    }

    // Date filters
    if (fromDate) {
      filtered = filtered.filter(item => {
        if (!item.receipt_date) return false;
        const itemDate = new Date(item.receipt_date.split('-').reverse().join('-'));
        const fromDateObj = new Date(fromDate);
        return itemDate >= fromDateObj;
      });
    }

    if (toDate) {
      filtered = filtered.filter(item => {
        if (!item.receipt_date) return false;
        const itemDate = new Date(item.receipt_date.split('-').reverse().join('-'));
        const toDateObj = new Date(toDate);
        return itemDate <= toDateObj;
      });
    }

    console.log('🔍 Final filtered length:', filtered.length);
    setFilteredData(filtered);
  }, [testRequestsData, searchQuery, statusFilter, typeFilter, fromDate, toDate]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredData].sort((a, b) => {
      let aVal, bVal;

      switch (key) {
        case 'receipt-date':
          aVal = a.receipt_date ? new Date(a.receipt_date.split('-').reverse().join('-')) : new Date(0);
          bVal = b.receipt_date ? new Date(b.receipt_date.split('-').reverse().join('-')) : new Date(0);
          break;
        case 'ulr-no':
          aVal = a.concrete_tests?.[0]?.ulr_number || '';
          bVal = b.concrete_tests?.[0]?.ulr_number || '';
          break;
        case 'job-no':
          aVal = a.job_number || '';
          bVal = b.job_number || '';
          break;
        case 'customer-name':
          aVal = a.customer_name || '';
          bVal = b.customer_name || '';
          break;
        case 'site-name':
          aVal = a.site_name || '';
          bVal = b.site_name || '';
          break;
        default:
          aVal = '';
          bVal = '';
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString;
  };

  const getSampleType = (item) => {
    if (item.concrete_tests?.length > 0) return 'Concrete Cube';
    if (item.river_sand || item.crushed_sand || item.m_sand || item.p_sand) return 'Sand';
    if (item.cement) return 'Cement';
    if (item.materials?.length > 0) return 'Other';
    return 'N/A';
  };

  const getSampleTypeBadge = (item) => {
    const type = getSampleType(item);
    const variants = {
      'Concrete Cube': 'warning',
      'Sand': 'secondary',
      'Cement': 'secondary',
      'Other': 'secondary',
      'N/A': 'secondary'
    };
    return <Badge bg={variants[type] || 'secondary'} text={type === 'Concrete Cube' ? 'dark' : 'light'}>{type}</Badge>;
  };

  const getActionButtons = (item) => {
    const buttons = [];

    // Transform item data to match ViewSample expected structure
    const viewData = {
      customerName: item.customer_name || 'N/A',
      contactPerson: 'Contact Person', // Default value
      phone: 'N/A',
      email: 'N/A',
      siteName: item.site_name || 'N/A',
      siteAddress: 'N/A',
      testType: 'CC',
      receiptDate: item.receipt_date || 'N/A',
      ulrNumber: item.concrete_tests?.[0]?.ulr_number || 'N/A',
      referenceNumber: 'N/A',
      jobNumber: item.job_number || 'N/A',
      cubeTests: item.concrete_tests?.map((test, index) => ({
        id: index + 1,
        idMark: test.idMark || 'N/A',
        locationNature: test.locationNature || 'N/A',
        grade: test.grade || 'N/A',
        castingDate: test.casting_date || 'N/A',
        testingDate: test.testing_date || 'N/A',
        quantity: test.num_of_cubes || 0,
        testMethod: test.method || 'IS 516 (Part1/Sec1):2021'
      })) || []
    };

    // View button - always present
    buttons.push(
      <Link 
        key="view" 
        to="/view-sample" 
        state={{ formData: viewData }}
        className="btn btn-sm btn-outline-info me-1" 
        title="View Details"
      >
        <FontAwesomeIcon icon={faEye} />
        <span className="d-none d-xl-inline ms-1">View</span>
      </Link>
    );

    // Edit button - only if not completed
    if (item.status !== 'completed' && item.status !== 'test_completed') {
      buttons.push(
        <Link 
          key="edit" 
          to={`/test-request`} 
          state={{ editData: item }}
          className="btn btn-sm btn-outline-warning me-1" 
          title="Edit"
        >
          <FontAwesomeIcon icon={faEdit} />
          <span className="d-none d-xl-inline ms-1">Edit</span>
        </Link>
      );
    }

    // Status-based action buttons
    if (item.status === 'completed' || item.status === 'test_completed') {
      buttons.push(
        <Link 
          key="preview" 
          to={`/test-report-preview`} 
          state={{ testData: item }}
          className="btn btn-sm btn-warning me-1" 
          title="Preview Report"
        >
          <FontAwesomeIcon icon={faFilePdf} />
          <span className="d-none d-xl-inline ms-1">Preview Report</span>
        </Link>
      );
    } else if (item.status === 'observations_completed') {
      buttons.push(
        <Link 
          key="graph" 
          to={`/strength-graph`} 
          state={{ testData: item }}
          className="btn btn-sm btn-warning me-1" 
          title="Generate Graph"
        >
          <FontAwesomeIcon icon={faChartLine} />
          <span className="d-none d-xl-inline ms-1">Generate Graph</span>
        </Link>
      );
    } else if (item.status === 'graph_generated') {
      buttons.push(
        <Link 
          key="finalize" 
          to={`/test-report-preview`} 
          state={{ testData: item }}
          className="btn btn-sm btn-warning me-1" 
          title="Finalize Test"
        >
          <FontAwesomeIcon icon={faClipboardCheck} />
          <span className="d-none d-xl-inline ms-1">Finalize Test</span>
        </Link>
      );
    }

    return buttons;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
    setFromDate('');
    setToDate('');
  };

  const hasActiveFilters = searchQuery || statusFilter || typeFilter || fromDate || toDate;

  if (apiLoading) {
    return (
      <div className="container-fluid px-2">
        <Card className="shadow mb-3 mb-md-4">
          {/* Header Skeleton */}
          <Card.Header className="bg-primary text-white">
            <Row className="align-items-center">
              <Col xs={12} md={8} className="mb-2 mb-md-0">
                <div className="d-flex align-items-center">
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    height: '40px',
                    width: '40px',
                    borderRadius: '8px',
                    marginRight: '15px'
                  }}></div>
                  <div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      height: '20px',
                      width: '200px',
                      borderRadius: '4px',
                      marginBottom: '8px'
                    }}></div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      height: '16px',
                      width: '150px',
                      borderRadius: '4px',
                      marginBottom: '4px'
                    }}></div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      height: '14px',
                      width: '180px',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} className="text-md-end text-center">
                <div className="d-flex gap-2 justify-content-end">
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      height: '35px',
                      width: '80px',
                      borderRadius: '6px'
                    }}></div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card.Header>

          {/* Search and Filter Skeleton */}
          <Card.Body className="bg-secondary p-3">
            <Row className="g-3">
              <Col xs={12} lg={4}>
                <div style={{
                  background: 'linear-gradient(90deg, #2a3441 25%, #3a4451 50%, #2a3441 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-loading 3s infinite',
                  height: '40px',
                  borderRadius: '8px'
                }}></div>
              </Col>
              <Col xs={12} lg={8}>
                <Row className="g-2">
                  {[1, 2, 3, 4].map(i => (
                    <Col xs={6} md={3} key={i}>
                      <div style={{
                        background: 'linear-gradient(90deg, #2a3441 25%, #3a4451 50%, #2a3441 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'skeleton-loading 3s infinite',
                        height: '35px',
                        borderRadius: '6px'
                      }}></div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Card.Body>

          {/* Table Skeleton */}
          <Card.Body>
            <div className="table-responsive" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <Table bordered hover className="samples-table">
                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(i => (
                      <th key={i} style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        height: '50px',
                        borderRadius: '4px'
                      }}></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(j => (
                        <td key={j} style={{
                          background: 'linear-gradient(90deg, #2a3441 25%, #3a4451 50%, #2a3441 75%)',
                          backgroundSize: '200% 100%',
                          animation: 'skeleton-loading 3s infinite',
                          height: '60px',
                          borderRadius: '4px'
                        }}>
                          <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            height: '16px',
                            borderRadius: '2px',
                            width: j === 14 ? '120px' : '80%'
                          }}></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        <style jsx>{`
          @keyframes skeleton-loading {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          .samples-table td {
            padding: 12px 8px !important;
            vertical-align: middle !important;
            word-wrap: break-word !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          
          .samples-table th {
            padding: 12px 8px !important;
            font-weight: 600 !important;
            background-color: #f8f9fa !important;
            border-bottom: 2px solid #dee2e6 !important;
          }
          
          .samples-table tr:hover {
            background-color: rgba(0, 123, 255, 0.05) !important;
          }
        `}</style>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="container-fluid">
        <Alert variant="danger">
          <Alert.Heading>Backend Connection Error</Alert.Heading>
          <p><strong>Error:</strong> {apiError}</p>
          <p><strong>Solution:</strong> Make sure the backend server is running at http://localhost:5000</p>
          <Button variant="outline-danger" onClick={fetchTestRequests} className="mt-2">
            <FontAwesomeIcon icon={faSyncAlt} className="me-2" />
            Retry Connection
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2">
      <Card className="shadow mb-3 mb-md-4">
        {/* Header */}
        <Card.Header className="bg-primary text-white">
          <Row className="align-items-center">
            <Col xs={12} md={8} className="mb-2 mb-md-0">
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
                  <h4 className="mt-1 h6 h-md-4">Sample Man</h4>
                  <p className="mb-0 small text-light">
                    Showing {filteredData.length} of {testRequestsData.length} test requests
                  </p>
                </div>
              </div>
            </Col>
            <Col xs={12} md={4} className="text-md-end text-center">
              <div className="d-flex gap-2 justify-content-end">
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => navigate(-1)}
                  title="Go Back"
                  className="me-2"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                  <span className="d-none d-sm-inline">Back</span>
                </Button>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={fetchTestRequests}
                  title="Refresh Data"
                  disabled={apiLoading}
                  className="me-2"
                >
                  <FontAwesomeIcon icon={faSyncAlt} className={apiLoading ? "fa-spin" : ""} />
                  <span className="d-none d-sm-inline ms-1">Refresh</span>
                </Button>
                <Link to="/test-request" className="btn btn-light w-100 w-md-auto">
                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                  New Test Request
                </Link>
              </div>
            </Col>
        </Row>
        </Card.Header>

        {/* Search and Filter Section */}
        <Card.Body className="bg-secondary p-3">
          <Row className="g-3">
            {/* Search Section */}
            <Col xs={12} lg={4}>
              <InputGroup>
                <InputGroup.Text className="bg-dark text-white border-secondary">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  className="bg-dark text-white border-secondary"
                  placeholder="Search job #, customer, site..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderLeft: 'none' }}
                />
                <Button variant="warning" className="px-3">
                  <span className="d-none d-sm-inline">Search</span>
                  <span className="d-sm-none">Go</span>
                </Button>
              </InputGroup>
            </Col>
            
            {/* Filters Section */}
            <Col xs={12} lg={8}>
              <Row className="g-2">
                <Col xs={6} md={3}>
                  <InputGroup size="sm">
                    <InputGroup.Text className="bg-dark text-white border-secondary">
                      <FontAwesomeIcon icon={faFilter} />
                    </InputGroup.Text>
                    <Form.Select 
                      className="bg-dark text-white border-secondary"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="observations_completed">Observations Completed</option>
                      <option value="graph_generated">Graph Generated</option>
                      <option value="test_completed">Test Completed</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
                
                <Col xs={6} md={3}>
                  <InputGroup size="sm">
                    <InputGroup.Text className="bg-dark text-white border-secondary">
                      <FontAwesomeIcon icon={faCube} />
                    </InputGroup.Text>
                    <Form.Select 
                      className="bg-dark text-white border-secondary"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="cube">Cube Testing</option>
                      <option value="sand">Sand</option>
                      <option value="cement">Cement</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
                
                <Col xs={6} md={3}>
                  <InputGroup size="sm">
                    <InputGroup.Text className="bg-dark text-white border-secondary">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      className="bg-dark text-white border-secondary"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </InputGroup>
          </Col>

                <Col xs={6} md={3}>
                  <InputGroup size="sm">
                    <InputGroup.Text className="bg-dark text-white border-secondary">
                      <FontAwesomeIcon icon={faCalendarCheck} />
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      className="bg-dark text-white border-secondary"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </InputGroup>
          </Col>
        </Row>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Row className="mt-2">
                  <Col xs={12} className="text-end">
                    <Button 
                      variant="outline-light" 
                      size="sm"
                      onClick={resetFilters}
                    >
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      Reset Filters
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Card.Body>

        {/* Table Section */}
              <Card.Body>
          {filteredData.length > 0 ? (
            <div className="table-responsive" style={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'auto' }}>
              <Table bordered hover className="samples-table" style={{ 
                minWidth: '1400px', 
                tableLayout: 'fixed',
                fontSize: '14px'
              }}>
                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th 
                      className="sortable" 
                      style={{ cursor: 'pointer', width: '120px' }}
                      onClick={() => handleSort('receipt-date')}
                    >
                      Date of Receipt <span className="ms-1">{getSortIcon('receipt-date')}</span>
                    </th>
                    <th 
                      className="sortable" 
                      style={{ cursor: 'pointer', width: '120px' }}
                      onClick={() => handleSort('ulr-no')}
                    >
                      ULR Number <span className="ms-1">{getSortIcon('ulr-no')}</span>
                    </th>
                    <th 
                      className="sortable" 
                      style={{ cursor: 'pointer', width: '150px' }}
                      onClick={() => handleSort('job-no')}
                    >
                      Sample Test Job Number <span className="ms-1">{getSortIcon('job-no')}</span>
                    </th>
                    <th 
                      className="sortable" 
                      style={{ cursor: 'pointer', width: '200px' }}
                      onClick={() => handleSort('customer-name')}
                    >
                      Name of Customer <span className="ms-1">{getSortIcon('customer-name')}</span>
                    </th>
                    <th 
                      className="sortable" 
                      style={{ cursor: 'pointer', width: '200px' }}
                      onClick={() => handleSort('site-name')}
                    >
                      Site Name <span className="ms-1">{getSortIcon('site-name')}</span>
                    </th>
                    <th style={{ width: '100px' }}>Sample</th>
                    <th style={{ width: '80px' }}>Qty</th>
                    <th style={{ width: '150px' }}>Test Requirement</th>
                    <th style={{ width: '120px' }}>Date of Casting</th>
                    <th style={{ width: '120px' }}>Date of Testing</th>
                    <th style={{ width: '120px' }}>Date of Report</th>
                    <th style={{ width: '120px' }}>Date of Disposal</th>
                    <th style={{ width: '100px' }}>Remarks</th>
                    <th style={{ width: '200px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center">{formatDate(item.receipt_date)}</td>
                      <td className="text-center">
                        {item.concrete_tests?.[0]?.ulr_number || 'N/A'}
                      </td>
                      <td className="text-center">
                        <Badge bg="warning" text="dark">{item.job_number}</Badge>
                      </td>
                      <td className="text-start">{item.customer_name}</td>
                      <td className="text-start">
                        {item.site_name?.length > 30 
                          ? `${item.site_name.substring(0, 30)}...` 
                          : item.site_name
                        }
                      </td>
                      <td className="text-center">{getSampleTypeBadge(item)}</td>
                      <td className="text-center">
                        {item.concrete_tests?.length > 0 
                          ? `${item.concrete_tests.reduce((sum, test) => sum + (test.num_of_cubes || 0), 0)} cubes`
                          : 'N/A'
                        }
                      </td>
                      <td className="text-start">
                        {item.concrete_tests?.length > 0 ? 'Compression Test' : 'N/A'}
                      </td>
                      <td className="text-center">
                        {formatDate(item.concrete_tests?.[0]?.casting_date)}
                      </td>
                      <td className="text-center">
                        {formatDate(item.concrete_tests?.[0]?.testing_date)}
                      </td>
                      <td className="text-center">
                        {formatDate(item.completion_date)}
                      </td>
                      <td className="text-center">N/A</td>
                      <td className="text-start">N/A</td>
                      <td className="text-center">
                        <div className="d-flex flex-wrap gap-1" style={{ minWidth: '180px' }}>
                          {getActionButtons(item)}
                        </div>
                      </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
          ) : (
            <Alert variant="info">
              <FontAwesomeIcon icon={faSearch} className="me-2" />
              No sample test requests found. 
              <Link to="/test-request" className="alert-link ms-1">
                Create a new test request
              </Link>.
            </Alert>
          )}
              </Card.Body>
            </Card>

      {/* Floating Navigation Button */}
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
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
                </div>
    </div>
  );
};

export default Samples;
