import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Form, InputGroup, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faCube,
  faCalendarAlt,
  faCalendarCheck,
  faEye,
  faEdit,
  faFilePdf,
  faChartBar,
  faClipboardCheck,
  faSyncAlt,
  faPlus,
  faUser,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const TestRecords = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Sample test records data
  const [testRecords] = useState([
    {
      id: 1,
      receiptDate: '11-08-2025',
      ulrNumber: 'ULR-2024-001',
      jobNumber: 'T-2501690',
      customerName: 'Lords Developers Shivyogi Residency',
      siteName: 'shivyogi residency',
      sampleType: 'Concrete Cube',
      quantity: '3 cubes',
      testRequirement: 'Compression Test',
      castingDate: '11-08-2025',
      testingDate: '08-09-2025',
      reportDate: '09-09-2025',
      disposalDate: 'N/A',
      remarks: 'Test completed',
      status: 'completed'
    },
    {
      id: 2,
      receiptDate: '02-08-2025',
      ulrNumber: 'ULR-2024-002',
      jobNumber: 'T-2501609',
      customerName: 'Maheshwari Constrosolution Wadia Hospital',
      siteName: 'Wadia Hospital',
      sampleType: 'Concrete Cube',
      quantity: '3 cubes',
      testRequirement: 'Compression Test',
      castingDate: '02-08-2025',
      testingDate: '08-09-2025',
      reportDate: '09-09-2025',
      disposalDate: 'N/A',
      remarks: 'N/A',
      status: 'completed'
    },
    {
      id: 3,
      receiptDate: '01-09-2025',
      ulrNumber: 'ULR-2024-003',
      jobNumber: '2088888',
      customerName: 'Ishan Kishan',
      siteName: 'pune',
      sampleType: 'Concrete Cube',
      quantity: '1 cubes',
      testRequirement: 'Compression Test',
      castingDate: '01-09-2025',
      testingDate: '30-09-2025',
      reportDate: '08-09-2025',
      disposalDate: 'N/A',
      remarks: 'Test completed',
      status: 'completed'
    },
    {
      id: 4,
      receiptDate: '01-09-2025',
      ulrNumber: 'ULR-2024-004',
      jobNumber: '1414141414',
      customerName: 'Shashwat Paratwar',
      siteName: 'Pune',
      sampleType: 'Concrete Cube',
      quantity: '3 cubes',
      testRequirement: 'Compression Test',
      castingDate: '01-09-2025',
      testingDate: '26-09-2025',
      reportDate: '04-09-2025',
      disposalDate: 'N/A',
      remarks: 'Test completed',
      status: 'completed'
    },
    {
      id: 5,
      receiptDate: '03-09-2025',
      ulrNumber: 'ULR-2024-005',
      jobNumber: '-',
      customerName: 'Dhananjay Dube',
      siteName: 'Pune',
      sampleType: 'Concrete Cube',
      quantity: '1 cubes',
      testRequirement: 'Compression Test',
      castingDate: '03-09-2025',
      testingDate: '03-09-2025',
      reportDate: '03-09-2025',
      disposalDate: 'N/A',
      remarks: '-',
      status: 'pending'
    }
  ]);

  const [filteredRecords, setFilteredRecords] = useState(testRecords);

  // Filter and search functionality
  useEffect(() => {
    let filtered = testRecords;

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.siteName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(record => record.sampleType.toLowerCase().includes(typeFilter.toLowerCase()));
    }

    // Apply table search filter
    if (tableSearch) {
      filtered = filtered.filter(record =>
        Object.values(record).some(value =>
          value.toString().toLowerCase().includes(tableSearch.toLowerCase())
        )
      );
    }

    // Apply customer filter
    if (customerFilter) {
      filtered = filtered.filter(record =>
        record.customerName.toLowerCase().includes(customerFilter.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [searchQuery, statusFilter, typeFilter, tableSearch, customerFilter, testRecords]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
    setFromDate('');
    setToDate('');
    setTableSearch('');
    setCustomerFilter('');
    setDateRangeFilter('');
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return '';
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  const getActionButtons = (record) => {
    const buttons = [];

    // View button (always present)
    buttons.push(
      <Button
        key="view"
        size="sm"
        variant="info"
        style={{
          borderRadius: '8px',
          padding: '6px 12px',
          fontWeight: '500',
          backgroundColor: 'rgba(13, 202, 240, 0.1)',
          border: '1px solid #0dcaf0',
          color: '#0dcaf0',
          marginRight: '4px'
        }}
        onClick={() => navigate('/view-sample', { state: { testData: record } })}
      >
        <FontAwesomeIcon icon={faEye} className="me-1" />
        View
      </Button>
    );

    // Status-based buttons
    if (record.status === 'completed') {
      buttons.push(
        <Button
          key="preview"
          size="sm"
          variant="warning"
          style={{
            borderRadius: '8px',
            padding: '6px 12px',
            fontWeight: '500',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid #ffc107',
            color: '#ffc107'
          }}
          onClick={() => navigate('/test-report-preview', { state: { testData: record } })}
        >
          <FontAwesomeIcon icon={faFilePdf} className="me-1" />
          Preview Report
        </Button>
      );
    } else if (record.status === 'pending') {
      buttons.push(
        <Button
          key="edit"
          size="sm"
          variant="warning"
          style={{
            borderRadius: '8px',
            padding: '6px 12px',
            fontWeight: '500',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid #ffc107',
            color: '#ffc107'
          }}
        >
          <FontAwesomeIcon icon={faEdit} className="me-1" />
          Edit
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FFA500, #E69500)',
        color: '#ffffff',
        padding: '20px 0',
        marginBottom: '20px',
        borderRadius: '15px'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <img 
                  src="/logo.png" 
                  alt="Vitrag Associates Logo" 
                  height="40" 
                  className="me-3"
                />
                <div>
                  <h3 className="mb-0" style={{ color: '#FFD700', fontWeight: '700' }}>
                    Vitrag Associates LLP
                  </h3>
                  <h4 className="mt-1" style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                    Sample Test Record Register
                  </h4>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end">
              <Button 
                variant="light" 
                size="lg"
                style={{
                  borderRadius: '10px',
                  padding: '10px 20px',
                  fontWeight: '600'
                }}
                onClick={() => navigate('/test-request')}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                New Test Request
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Search and Filter Section */}
        <div style={{
          background: '#495057',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <Form>
            <Row className="g-3">
              {/* Search Section */}
              <Col lg={4}>
                <InputGroup>
                  <InputGroup.Text style={{
                    backgroundColor: '#212529',
                    borderColor: '#495057',
                    color: '#ffffff'
                  }}>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search job #, customer, site..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      backgroundColor: '#212529',
                      borderColor: '#495057',
                      color: '#ffffff'
                    }}
                  />
                  <Button 
                    variant="primary" 
                    type="submit"
                    style={{
                      backgroundColor: '#FFA500',
                      borderColor: '#FFA500',
                      color: '#000000'
                    }}
                  >
                    Go
                  </Button>
                </InputGroup>
              </Col>
              
              {/* Filters Section */}
              <Col lg={8}>
                <Row className="g-2">
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text style={{
                        backgroundColor: '#212529',
                        borderColor: '#495057',
                        color: '#ffffff'
                      }}>
                        <FontAwesomeIcon icon={faFilter} />
                      </InputGroup.Text>
                      <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                          backgroundColor: '#212529',
                          borderColor: '#495057',
                          color: '#ffffff'
                        }}
                      >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>
                  
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text style={{
                        backgroundColor: '#212529',
                        borderColor: '#495057',
                        color: '#ffffff'
                      }}>
                        <FontAwesomeIcon icon={faCube} />
                      </InputGroup.Text>
                      <Form.Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        style={{
                          backgroundColor: '#212529',
                          borderColor: '#495057',
                          color: '#ffffff'
                        }}
                      >
                        <option value="">All Types</option>
                        <option value="cube">Cube Testing</option>
                        <option value="sand">Sand</option>
                        <option value="cement">Cement</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>
                  
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text style={{
                        backgroundColor: '#212529',
                        borderColor: '#495057',
                        color: '#ffffff'
                      }}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        style={{
                          backgroundColor: '#212529',
                          borderColor: '#495057',
                          color: '#ffffff'
                        }}
                      />
                    </InputGroup>
                  </Col>
                  
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text style={{
                        backgroundColor: '#212529',
                        borderColor: '#495057',
                        color: '#ffffff'
                      }}>
                        <FontAwesomeIcon icon={faCalendarCheck} />
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        style={{
                          backgroundColor: '#212529',
                          borderColor: '#495057',
                          color: '#ffffff'
                        }}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>

        {/* Secondary Filter Section */}
        <div style={{
          background: '#1C2333',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <Row className="g-3">
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text style={{
                  backgroundColor: '#495057',
                  borderColor: '#6c757d',
                  color: '#ffffff'
                }}>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search any column..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  style={{
                    backgroundColor: '#495057',
                    borderColor: '#6c757d',
                    color: '#ffffff'
                  }}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text style={{
                  backgroundColor: '#495057',
                  borderColor: '#6c757d',
                  color: '#ffffff'
                }}>
                  <FontAwesomeIcon icon={faUser} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Filter by customer..."
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  style={{
                    backgroundColor: '#495057',
                    borderColor: '#6c757d',
                    color: '#ffffff'
                  }}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text style={{
                  backgroundColor: '#495057',
                  borderColor: '#6c757d',
                  color: '#ffffff'
                }}>
                  <FontAwesomeIcon icon={faCalendar} />
                </InputGroup.Text>
                <Form.Select
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value)}
                  style={{
                    backgroundColor: '#495057',
                    borderColor: '#6c757d',
                    color: '#ffffff'
                  }}
                >
                  <option value="">Any date</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="year">This year</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={3}>
              <Button 
                variant="secondary" 
                className="w-100"
                onClick={resetFilters}
                style={{
                  backgroundColor: '#6c757d',
                  borderColor: '#6c757d',
                  color: '#ffffff'
                }}
              >
                <FontAwesomeIcon icon={faSyncAlt} className="me-1" />
                Reset Filters
              </Button>
            </Col>
          </Row>
        </div>

        {/* Main Data Table */}
        <div style={{
          background: '#1C2333',
          borderRadius: '15px',
          padding: '0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}>
          <div className="table-responsive" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Table style={{
              backgroundColor: '#1C2333',
              color: '#ffffff',
              margin: '0',
              borderCollapse: 'collapse'
            }}>
              <thead style={{
                position: 'sticky',
                top: '0',
                zIndex: '10',
                background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))',
                borderBottom: '2px solid #FFA500'
              }}>
                <tr>
                  <th 
                    style={{ 
                      color: '#FFD700', 
                      fontWeight: '600',
                      padding: '15px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('quantity')}
                  >
                    Qty {getSortIcon('quantity')}
                  </th>
                  <th 
                    style={{ 
                      color: '#FFD700', 
                      fontWeight: '600',
                      padding: '15px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('testRequirement')}
                  >
                    Test Requirement {getSortIcon('testRequirement')}
                  </th>
                  <th 
                    style={{ 
                      color: '#FFD700', 
                      fontWeight: '600',
                      padding: '15px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('castingDate')}
                  >
                    Date of Casting {getSortIcon('castingDate')}
                  </th>
                  <th 
                    style={{ 
                      color: '#FFD700', 
                      fontWeight: '600',
                      padding: '15px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('testingDate')}
                  >
                    Date of Testing {getSortIcon('testingDate')}
                  </th>
                  <th 
                    style={{ 
                      color: '#FFD700', 
                      fontWeight: '600',
                      padding: '15px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('reportDate')}
                  >
                    Date of Report {getSortIcon('reportDate')}
                  </th>
                  <th 
                    style={{ 
                      color: '#FFD700', 
                      fontWeight: '600',
                      padding: '15px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('disposalDate')}
                  >
                    Date of Disposal {getSortIcon('disposalDate')}
                  </th>
                  <th 
                    style={{ 
                      color: '#FFD700', 
                      fontWeight: '600',
                      padding: '15px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('remarks')}
                  >
                    Remarks {getSortIcon('remarks')}
                  </th>
                  <th 
                    style={{ 
                      color: '#FFD700', 
                      fontWeight: '600',
                      padding: '15px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center'
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr 
                    key={record.id} 
                    style={{
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
                      padding: '10px 8px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      color: '#ffffff'
                    }}>
                      {record.quantity}
                    </td>
                    <td style={{ 
                      padding: '10px 8px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      color: '#ffffff'
                    }}>
                      {record.testRequirement}
                    </td>
                    <td style={{ 
                      padding: '10px 8px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      color: '#ffffff'
                    }}>
                      {record.castingDate}
                    </td>
                    <td style={{ 
                      padding: '10px 8px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      color: '#ffffff'
                    }}>
                      {record.testingDate}
                    </td>
                    <td style={{ 
                      padding: '10px 8px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      color: '#ffffff'
                    }}>
                      {record.reportDate}
                    </td>
                    <td style={{ 
                      padding: '10px 8px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      color: '#ffffff'
                    }}>
                      {record.disposalDate}
                    </td>
                    <td style={{ 
                      padding: '10px 8px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      color: '#ffffff'
                    }}>
                      {record.remarks}
                    </td>
                    <td style={{ 
                      padding: '10px 8px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center'
                    }}>
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                        {getActionButtons(record)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TestRecords;
