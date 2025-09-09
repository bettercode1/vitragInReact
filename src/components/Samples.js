import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faEye, 
  faEdit, 
  faChartLine, 
  faCheckCircle, 
  faFileAlt,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

const Samples = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Mock data
  const sampleData = [
    {
      id: 1,
      receiptDate: '2024-01-15',
      ulrNumber: 'ULR-001',
      jobNumber: 'VIT-2024-001',
      customer: 'ABC Construction',
      siteName: 'Mumbai Project',
      sample: 'Concrete Cube',
      qty: '6',
      testRequirement: 'Compressive Strength',
      castingDate: '2024-01-10',
      testingDate: '2024-01-17',
      reportDate: '2024-01-20',
      disposalDate: '2024-01-25',
      remarks: 'Test completed successfully',
      status: 'completed'
    },
    {
      id: 2,
      receiptDate: '2024-01-14',
      ulrNumber: 'ULR-002',
      jobNumber: 'VIT-2024-002',
      customer: 'XYZ Builders',
      siteName: 'Pune Development',
      sample: 'Concrete Cube',
      qty: '9',
      testRequirement: 'Compressive Strength',
      castingDate: '2024-01-09',
      testingDate: '2024-01-16',
      reportDate: '',
      disposalDate: '',
      remarks: 'Testing in progress',
      status: 'testing'
    },
    {
      id: 3,
      receiptDate: '2024-01-13',
      ulrNumber: 'ULR-003',
      jobNumber: 'VIT-2024-003',
      customer: 'DEF Engineers',
      siteName: 'Delhi Complex',
      sample: 'Concrete Cube',
      qty: '12',
      testRequirement: 'Compressive Strength',
      castingDate: '2024-01-08',
      testingDate: '',
      reportDate: '',
      disposalDate: '',
      remarks: 'Sample received',
      status: 'received'
    },
    {
      id: 4,
      receiptDate: '2024-01-12',
      ulrNumber: 'ULR-004',
      jobNumber: 'VIT-2024-004',
      customer: 'GHI Contractors',
      siteName: 'Bangalore Site',
      sample: 'Concrete Cube',
      qty: '6',
      testRequirement: 'Compressive Strength',
      castingDate: '2024-01-07',
      testingDate: '2024-01-14',
      reportDate: '2024-01-17',
      disposalDate: '2024-01-22',
      remarks: 'Test completed',
      status: 'completed'
    },
    {
      id: 5,
      receiptDate: '2024-01-11',
      ulrNumber: 'ULR-005',
      jobNumber: 'VIT-2024-005',
      customer: 'JKL Developers',
      siteName: 'Chennai Project',
      sample: 'Concrete Cube',
      qty: '9',
      testRequirement: 'Compressive Strength',
      castingDate: '2024-01-06',
      testingDate: '2024-01-13',
      reportDate: '',
      disposalDate: '',
      remarks: 'Report generation in progress',
      status: 'reporting'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'received': { variant: 'secondary', text: 'Sample Received' },
      'testing': { variant: 'warning', text: 'Testing' },
      'reporting': { variant: 'info', text: 'Generating Report' },
      'completed': { variant: 'success', text: 'Completed' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: 'Unknown' };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const filteredData = sampleData.filter(sample => {
    const matchesSearch = 
      sample.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.ulrNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || sample.status === statusFilter;
    const matchesType = !typeFilter || sample.sample.toLowerCase().includes(typeFilter.toLowerCase());
    
    const matchesDateFrom = !dateFrom || new Date(sample.receiptDate) >= new Date(dateFrom);
    const matchesDateTo = !dateTo || new Date(sample.receiptDate) <= new Date(dateTo);
    
    return matchesSearch && matchesStatus && matchesType && matchesDateFrom && matchesDateTo;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div>
      {/* Header */}
      <div className="header-vitrag">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <i className="fas fa-flask me-3" style={{ fontSize: '2rem' }}></i>
                <div>
                  <h1 style={{ color: 'var(--vitrag-gold)', fontWeight: '700', margin: 0 }}>
                    Vitrag Associates LLP
                  </h1>
                  <h4 style={{ color: 'var(--vitrag-orange)', fontWeight: '500', margin: 0 }}>
                    Sample Test Record Register
                  </h4>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                as={Link} 
                to="/test-request" 
                variant="primary" 
                className="btn-vitrag-primary"
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
        <Card className="card-vitrag mb-4">
          <Card.Body>
            <Row className="align-items-end">
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by customer, job number, site..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control-vitrag"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-control-vitrag"
                  >
                    <option value="">All Status</option>
                    <option value="received">Sample Received</option>
                    <option value="testing">Testing</option>
                    <option value="reporting">Generating Report</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="form-control-vitrag"
                  >
                    <option value="">All Types</option>
                    <option value="concrete">Concrete Cube</option>
                    <option value="aggregate">Aggregate</option>
                    <option value="cement">Cement</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Date From</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="form-control-vitrag"
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Date To</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="form-control-vitrag"
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="mb-3">
                <Button
                  variant="outline-secondary"
                  onClick={resetFilters}
                  className="w-100"
                  title="Reset Filters"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Data Table */}
        <Card className="card-vitrag">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table className="table-vitrag mb-0">
                <thead>
                  <tr>
                    <th>Date of Receipt</th>
                    <th>ULR Number</th>
                    <th>Sample Test Job Number</th>
                    <th>Name of Customer</th>
                    <th>Site Name</th>
                    <th>Sample</th>
                    <th>Qty</th>
                    <th>Test Requirement</th>
                    <th>Date of Casting</th>
                    <th>Date of Testing</th>
                    <th>Date of Report</th>
                    <th>Date of Disposal</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((sample) => (
                    <tr key={sample.id}>
                      <td>{sample.receiptDate}</td>
                      <td>{sample.ulrNumber}</td>
                      <td>{sample.jobNumber}</td>
                      <td>{sample.customer}</td>
                      <td>{sample.siteName}</td>
                      <td>{sample.sample}</td>
                      <td>{sample.qty}</td>
                      <td>{sample.testRequirement}</td>
                      <td>{sample.castingDate || '-'}</td>
                      <td>{sample.testingDate || '-'}</td>
                      <td>{sample.reportDate || '-'}</td>
                      <td>{sample.disposalDate || '-'}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2">{sample.remarks}</span>
                          {getStatusBadge(sample.status)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          {sample.status === 'testing' && (
                            <Button
                              variant="outline-info"
                              size="sm"
                              title="Generate Graph"
                            >
                              <FontAwesomeIcon icon={faChartLine} />
                            </Button>
                          )}
                          {sample.status === 'testing' && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              title="Finalize Test"
                            >
                              <FontAwesomeIcon icon={faCheckCircle} />
                            </Button>
                          )}
                          {sample.status === 'completed' && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Preview Report"
                            >
                              <FontAwesomeIcon icon={faFileAlt} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
            {filteredData.length === 0 && (
              <div className="text-center py-5">
                <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted mb-3" />
                <h5 className="text-muted">No samples found</h5>
                <p className="text-muted">Try adjusting your search criteria</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Summary */}
        <Row className="mt-4">
          <Col>
            <Card className="card-vitrag">
              <Card.Body className="text-center">
                <h5 style={{ color: 'var(--vitrag-gold)' }}>
                  Total Samples: {filteredData.length}
                </h5>
                <p className="text-muted mb-0">
                  Showing {filteredData.length} of {sampleData.length} samples
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Samples;
