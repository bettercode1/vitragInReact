import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
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
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const OtherServices = () => {
  const services = [
    {
      id: 1,
      name: 'Bulk Density and Moisture Content',
      icon: faWeightHanging,
      color: 'success',
      available: true,
      description: 'Test for bulk density and moisture content of construction materials'
    },
    {
      id: 2,
      name: 'Liquid Admixture',
      icon: faTint,
      color: 'danger',
      available: true,
      description: 'Analysis of liquid admixtures for concrete'
    },
    {
      id: 3,
      name: 'AAC Blocks',
      icon: faCube,
      color: 'warning',
      available: false,
      description: 'Testing of Autoclaved Aerated Concrete blocks'
    },
    {
      id: 4,
      name: '10/20 mm Aggregate',
      icon: faCubes,
      color: 'primary',
      available: false,
      description: 'Testing of coarse aggregates (10mm and 20mm)'
    },
    {
      id: 5,
      name: 'Cement Testing',
      icon: faIndustry,
      color: 'secondary',
      available: false,
      description: 'Comprehensive cement quality testing'
    },
    {
      id: 6,
      name: 'Fine Aggregate',
      icon: faMountain,
      color: 'info',
      available: false,
      description: 'Testing of fine aggregates and sand'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="header-vitrag">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faFlask} className="me-3" style={{ fontSize: '2rem' }} />
                <h1 style={{ color: 'var(--vitrag-gold)', fontWeight: '700', margin: 0 }}>
                  Other Testing Services
                </h1>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                variant="primary" 
                className="btn-vitrag-primary"
                disabled
              >
                View Other Services Dashboard
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Coming Soon Notice */}
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="alert-vitrag">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              <strong>Notice:</strong> Most of these testing services are currently under development. 
              For now, please use our Concrete Cube Testing service.
            </Alert>
          </Col>
        </Row>

        {/* Services Grid */}
        <Row>
          {services.map((service) => (
            <Col lg={4} md={6} className="mb-4" key={service.id}>
              <Card className="card-vitrag service-card h-100">
                <Card.Body className="text-center p-4">
                  <div 
                    className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 ${
                      service.available ? `bg-${service.color}` : 'bg-secondary'
                    }`}
                    style={{ width: '80px', height: '80px' }}
                  >
                    <FontAwesomeIcon 
                      icon={service.icon} 
                      size="2x" 
                      className="text-white" 
                    />
                  </div>
                  
                  <h4 className="mb-3" style={{ color: 'var(--vitrag-gold)' }}>
                    {service.name}
                  </h4>
                  
                  <p className="mb-4 text-muted">
                    {service.description}
                  </p>
                  
                  {service.available ? (
                    <Button 
                      variant="primary" 
                      className="btn-vitrag-primary"
                    >
                      Start Testing
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary" 
                      disabled
                      className="w-100"
                    >
                      Coming Soon
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Service Statistics */}
        <Row className="mt-5">
          <Col>
            <Card className="card-vitrag">
              <Card.Body className="p-4">
                <Row className="text-center">
                  <Col md={3} className="mb-3">
                    <div className="stats-card p-3">
                      <div className="stats-number text-success" style={{ fontSize: '2rem' }}>
                        2
                      </div>
                      <h6 className="text-muted">Available Services</h6>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="stats-card p-3">
                      <div className="stats-number text-warning" style={{ fontSize: '2rem' }}>
                        4
                      </div>
                      <h6 className="text-muted">Coming Soon</h6>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="stats-card p-3">
                      <div className="stats-number text-info" style={{ fontSize: '2rem' }}>
                        6
                      </div>
                      <h6 className="text-muted">Total Services</h6>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="stats-card p-3">
                      <div className="stats-number text-primary" style={{ fontSize: '2rem' }}>
                        10%
                      </div>
                      <h6 className="text-muted">Testing Volume</h6>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Service Categories */}
        <Row className="mt-4">
          <Col md={6}>
            <Card className="card-vitrag">
              <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                <h5 style={{ color: 'var(--vitrag-gold)', margin: 0 }}>
                  Available Services
                </h5>
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faWeightHanging} className="text-success me-2" />
                    Bulk Density and Moisture Content
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faTint} className="text-danger me-2" />
                    Liquid Admixture Testing
                  </li>
                </ul>
                <p className="text-muted mb-0">
                  These services are currently available for testing requests.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="card-vitrag">
              <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
                <h5 style={{ color: 'var(--vitrag-gold)', margin: 0 }}>
                  Development Pipeline
                </h5>
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faCube} className="text-warning me-2" />
                    AAC Blocks Testing
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faCubes} className="text-primary me-2" />
                    10/20 mm Aggregate Testing
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faIndustry} className="text-secondary me-2" />
                    Cement Testing
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faMountain} className="text-info me-2" />
                    Fine Aggregate Testing
                  </li>
                </ul>
                <p className="text-muted mb-0">
                  These services are under development and will be available soon.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Back to Main Services */}
        <Row className="mt-4">
          <Col>
            <Card className="card-vitrag">
              <Card.Body className="text-center p-4">
                <h5 style={{ color: 'var(--vitrag-gold)' }}>
                  Need Concrete Cube Testing?
                </h5>
                <p className="text-muted mb-4">
                  Our main service - Concrete Cube Testing - is fully operational and ready for your testing needs.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Button 
                    as={Link} 
                    to="/test-request" 
                    variant="primary" 
                    className="btn-vitrag-primary"
                  >
                    Submit Test Request
                  </Button>
                  <Button 
                    as={Link} 
                    to="/samples" 
                    variant="outline-primary"
                  >
                    View Samples
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OtherServices;
