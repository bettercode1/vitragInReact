import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const CubeTestingServices = () => {
  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-0">
                    <i className="fas fa-cube me-2"></i>Cube Testing Services
                  </h1>
                  <p className="mb-0">Comprehensive concrete cube testing for construction projects</p>
                </div>
                <Link to="/" className="btn btn-light">
                  <i className="fas fa-arrow-left me-2"></i>Back to Home
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Service Overview */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="card-title text-primary">
                <i className="fas fa-info-circle me-2"></i>About Our Cube Testing Services
              </h4>
              <p className="card-text">
                Vitrag Associates LLP provides comprehensive concrete cube testing services to ensure the quality 
                and strength of concrete used in construction projects. Our state-of-the-art laboratory follows 
                IS standards and provides accurate, reliable test results.
              </p>
              <Row className="mt-3">
                <Col md={4}>
                  <div className="text-center">
                    <i className="fas fa-certificate fa-2x text-success mb-2"></i>
                    <h6>NABL Accredited</h6>
                    <small className="text-muted">ISO 17025:2017 certified laboratory</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <i className="fas fa-clock fa-2x text-primary mb-2"></i>
                    <h6>Quick Turnaround</h6>
                    <small className="text-muted">Fast and efficient testing process</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <i className="fas fa-shield-alt fa-2x text-warning mb-2"></i>
                    <h6>Quality Assured</h6>
                    <small className="text-muted">IS 516:2021 compliant testing</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Service Options */}
      <Row className="mb-4">
        <Col xs={12}>
          <h4 className="text-primary mb-3">
            <i className="fas fa-list me-2"></i>Our Testing Services
          </h4>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title text-primary">
                  <i className="fas fa-cube me-2"></i>Standard Cube Testing
                </h5>
                <Badge bg="success" className="fs-6">Most Popular</Badge>
              </div>
              <p className="card-text">
                Comprehensive 7-day and 28-day compressive strength testing for standard concrete grades (M20-M35).
              </p>
              <ul className="list-unstyled">
                <li><i className="fas fa-check text-success me-2"></i>7-day & 28-day testing</li>
                <li><i className="fas fa-check text-success me-2"></i>IS 516:2021 compliant</li>
                <li><i className="fas fa-check text-success me-2"></i>Detailed test report</li>
                <li><i className="fas fa-check text-success me-2"></i>Digital photos included</li>
              </ul>
              <div className="mt-3">
                <h6 className="text-muted">Turnaround Time: 3-5 days</h6>
                <h6 className="text-muted">Price: ₹500 per test</h6>
              </div>
              <Link to="/test-request" className="btn btn-primary w-100 mt-3">
                <i className="fas fa-plus me-2"></i>Request Standard Test
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title text-primary">
                  <i className="fas fa-rocket me-2"></i>High-Strength Cube Testing
                </h5>
                <Badge bg="warning" className="fs-6">Premium</Badge>
              </div>
              <p className="card-text">
                Specialized testing for high-strength concrete grades (M40 and above) with advanced equipment.
              </p>
              <ul className="list-unstyled">
                <li><i className="fas fa-check text-success me-2"></i>M40+ grade testing</li>
                <li><i className="fas fa-check text-success me-2"></i>Advanced equipment</li>
                <li><i className="fas fa-check text-success me-2"></i>Detailed analysis</li>
                <li><i className="fas fa-check text-success me-2"></i>Expert consultation</li>
              </ul>
              <div className="mt-3">
                <h6 className="text-muted">Turnaround Time: 5-7 days</h6>
                <h6 className="text-muted">Price: ₹800 per test</h6>
              </div>
              <Link to="/test-request" className="btn btn-primary w-100 mt-3">
                <i className="fas fa-plus me-2"></i>Request High-Strength Test
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title text-primary">
                  <i className="fas fa-tachometer-alt me-2"></i>Rapid Cube Testing
                </h5>
                <Badge bg="danger" className="fs-6">Urgent</Badge>
              </div>
              <p className="card-text">
                Accelerated testing for urgent projects with same-day or next-day results.
              </p>
              <ul className="list-unstyled">
                <li><i className="fas fa-check text-success me-2"></i>Same-day results</li>
                <li><i className="fas fa-check text-success me-2"></i>Priority processing</li>
                <li><i className="fas fa-check text-success me-2"></i>Express delivery</li>
                <li><i className="fas fa-check text-success me-2"></i>24/7 support</li>
              </ul>
              <div className="mt-3">
                <h6 className="text-muted">Turnaround Time: 1-2 days</h6>
                <h6 className="text-muted">Price: ₹1000 per test</h6>
              </div>
              <Link to="/test-request" className="btn btn-primary w-100 mt-3">
                <i className="fas fa-plus me-2"></i>Request Rapid Test
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title text-primary">
                  <i className="fas fa-cogs me-2"></i>Specialized Testing
                </h5>
                <Badge bg="info" className="fs-6">Custom</Badge>
              </div>
              <p className="card-text">
                Custom testing solutions for unique requirements and specialized concrete applications.
              </p>
              <ul className="list-unstyled">
                <li><i className="fas fa-check text-success me-2"></i>Custom requirements</li>
                <li><i className="fas fa-check text-success me-2"></i>Specialized applications</li>
                <li><i className="fas fa-check text-success me-2"></i>Expert consultation</li>
                <li><i className="fas fa-check text-success me-2"></i>Flexible pricing</li>
              </ul>
              <div className="mt-3">
                <h6 className="text-muted">Turnaround Time: As per requirement</h6>
                <h6 className="text-muted">Price: Quote on request</h6>
              </div>
              <Link to="/test-request" className="btn btn-primary w-100 mt-3">
                <i className="fas fa-plus me-2"></i>Request Custom Test
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Process Steps */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="card-title text-primary mb-4">
                <i className="fas fa-route me-2"></i>Our 4-Step Process
              </h4>
              <Row>
                <Col md={3} className="text-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                    <span className="h4 mb-0">1</span>
                  </div>
                  <h6>Submit Request</h6>
                  <small className="text-muted">Fill out our comprehensive test request form with all required details</small>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                    <span className="h4 mb-0">2</span>
                  </div>
                  <h6>Sample Collection</h6>
                  <small className="text-muted">We collect your concrete samples and prepare them for testing</small>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                    <span className="h4 mb-0">3</span>
                  </div>
                  <h6>Laboratory Testing</h6>
                  <small className="text-muted">Our experts conduct thorough testing following IS standards</small>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                    <span className="h4 mb-0">4</span>
                  </div>
                  <h6>Report Delivery</h6>
                  <small className="text-muted">Receive your detailed test report via email and WhatsApp</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contact Information */}
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="card-title text-primary mb-3">
                <i className="fas fa-phone me-2"></i>Get Started Today
              </h4>
              <Row>
                <Col md={6}>
                  <p className="card-text">
                    Ready to get your concrete tested? Contact us now or submit your test request online.
                  </p>
                  <div className="d-flex flex-column flex-md-row gap-2">
                    <Link to="/test-request" className="btn btn-primary">
                      <i className="fas fa-plus me-2"></i>Submit Test Request
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline-primary">
                      <i className="fas fa-tachometer-alt me-2"></i>View Dashboard
                    </Link>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-md-end">
                    <h6 className="text-muted">Contact Information</h6>
                    <p className="mb-1">
                      <i className="fas fa-phone me-2"></i>+91 9876543210
                    </p>
                    <p className="mb-1">
                      <i className="fas fa-envelope me-2"></i>info@vitragassociates.com
                    </p>
                    <p className="mb-0">
                      <i className="fas fa-map-marker-alt me-2"></i>Pune, Maharashtra
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CubeTestingServices;
