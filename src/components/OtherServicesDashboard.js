import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWeightHanging, 
  faTint, 
  faCube, 
  faCubes, 
  faIndustry, 
  faMountain,
  faFlask,
  faArrowLeft,
  faChartLine,
  faEye,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

const OtherServicesDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for dashboard
  const testData = [
    {
      id: 1,
      testType: 'Bulk Density and Moisture Content',
      customer: 'ABC Construction Ltd.',
      status: 'completed',
      date: '2025-01-15',
      icon: faWeightHanging,
      color: 'success'
    },
    {
      id: 2,
      testType: 'Liquid Admixture',
      customer: 'XYZ Builders',
      status: 'in-progress',
      date: '2025-01-14',
      icon: faTint,
      color: 'warning'
    },
    {
      id: 3,
      testType: 'AAC Blocks',
      customer: 'DEF Developers',
      status: 'pending',
      date: '2025-01-13',
      icon: faCube,
      color: 'info'
    },
    {
      id: 4,
      testType: '10/20 mm Aggregate',
      customer: 'GHI Contractors',
      status: 'completed',
      date: '2025-01-12',
      icon: faCubes,
      color: 'primary'
    },
    {
      id: 5,
      testType: 'Cement Testing',
      customer: 'JKL Engineers',
      status: 'in-progress',
      date: '2025-01-11',
      icon: faIndustry,
      color: 'secondary'
    },
    {
      id: 6,
      testType: 'Fine Aggregate',
      customer: 'MNO Construction',
      status: 'completed',
      date: '2025-01-10',
      icon: faMountain,
      color: 'info'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'in-progress':
        return <Badge bg="warning">In Progress</Badge>;
      case 'pending':
        return <Badge bg="info">Pending</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const filteredData = selectedFilter === 'all' 
    ? testData 
    : testData.filter(item => item.status === selectedFilter);

  const stats = {
    total: testData.length,
    completed: testData.filter(item => item.status === 'completed').length,
    inProgress: testData.filter(item => item.status === 'in-progress').length,
    pending: testData.filter(item => item.status === 'pending').length
  };

  return (
    <div>
      {/* Header */}
      <div className="header-vitrag">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faChartLine} className="me-3" style={{ fontSize: '2rem' }} />
                <h1 style={{ color: '#ffffff', fontWeight: '700', margin: 0 }}>
                  Other Services Dashboard
                </h1>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                as={Link}
                to="/other-services"
                variant="outline-light"
                className="btn-vitrag-primary"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to Services
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="card-vitrag shadow-sm text-center">
              <Card.Body>
                <FontAwesomeIcon icon={faFlask} className="text-primary mb-2" size="2x" />
                <h3 className="text-primary">{stats.total}</h3>
                <p className="text-muted mb-0">Total Tests</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="card-vitrag shadow-sm text-center">
              <Card.Body>
                <FontAwesomeIcon icon={faWeightHanging} className="text-success mb-2" size="2x" />
                <h3 className="text-success">{stats.completed}</h3>
                <p className="text-muted mb-0">Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="card-vitrag shadow-sm text-center">
              <Card.Body>
                <FontAwesomeIcon icon={faTint} className="text-warning mb-2" size="2x" />
                <h3 className="text-warning">{stats.inProgress}</h3>
                <p className="text-muted mb-0">In Progress</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="card-vitrag shadow-sm text-center">
              <Card.Body>
                <FontAwesomeIcon icon={faCube} className="text-info mb-2" size="2x" />
                <h3 className="text-info">{stats.pending}</h3>
                <p className="text-muted mb-0">Pending</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filter Buttons */}
        <Row className="mb-4">
          <Col>
            <Card className="card-vitrag shadow-sm">
              <Card.Body>
                <div className="d-flex gap-2 flex-wrap">
                  <Button
                    variant={selectedFilter === 'all' ? 'primary' : 'outline-primary'}
                    onClick={() => setSelectedFilter('all')}
                    size="sm"
                  >
                    All Tests
                  </Button>
                  <Button
                    variant={selectedFilter === 'completed' ? 'success' : 'outline-success'}
                    onClick={() => setSelectedFilter('completed')}
                    size="sm"
                  >
                    Completed
                  </Button>
                  <Button
                    variant={selectedFilter === 'in-progress' ? 'warning' : 'outline-warning'}
                    onClick={() => setSelectedFilter('in-progress')}
                    size="sm"
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={selectedFilter === 'pending' ? 'info' : 'outline-info'}
                    onClick={() => setSelectedFilter('pending')}
                    size="sm"
                  >
                    Pending
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Test Results Table */}
        <Row>
          <Col>
            <Card className="card-vitrag shadow-sm">
              <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                <h5 className="mb-0" style={{ color: 'var(--vitrag-gold)' }}>
                  <FontAwesomeIcon icon={faFlask} className="me-2" />
                  Test Results Overview
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Test Type</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((test) => (
                        <tr key={test.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon 
                                icon={test.icon} 
                                className={`text-${test.color} me-2`}
                              />
                              {test.testType}
                            </div>
                          </td>
                          <td>{test.customer}</td>
                          <td>{getStatusBadge(test.status)}</td>
                          <td>{test.date}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-primary" size="sm">
                                <FontAwesomeIcon icon={faEye} />
                              </Button>
                              <Button variant="outline-warning" size="sm">
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OtherServicesDashboard;
