import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWeightHanging, 
  faTint, 
  faCube, 
  faCubes, 
  faIndustry, 
  faMountain,
  faFlask,
  faInfoCircle,
  faSeedling
} from '@fortawesome/free-solid-svg-icons';
import FineAggregateTestSelection from './otherServices/FineAggregate/FineAggregateTestSelection';
import CoarseAggregateTestSelection from './otherServices/CoarseAggregate/CoarseAggregateTestSelection';
import CementTestingSelection from './otherServices/CementTesting/CementTestingSelection';

const OtherServices = () => {
  const navigate = useNavigate();
  const [showFineAggregatePopup, setShowFineAggregatePopup] = useState(false);
  const [showCoarseAggregatePopup, setShowCoarseAggregatePopup] = useState(false);
  const [showCementTestingPopup, setShowCementTestingPopup] = useState(false);

  const handleFineAggregateClick = () => {
    setShowFineAggregatePopup(true);
  };

  const handleFineAggregateProceed = (selectedTests) => {
    setShowFineAggregatePopup(false);
    // Navigate to fine aggregate form with selected tests
    navigate('/fine-aggregate-form', { 
      state: { selectedTests } 
    });
  };

  const handleCoarseAggregateClick = () => {
    setShowCoarseAggregatePopup(true);
  };

  const handleCoarseAggregateProceed = (selectedTests) => {
    setShowCoarseAggregatePopup(false);
    // Navigate to coarse aggregate form with selected tests
    navigate('/coarse-aggregate-form', { 
      state: { selectedTests } 
    });
  };

  const handleCementTestingClick = () => {
    setShowCementTestingPopup(true);
  };

  const handleCementTestingProceed = (selectedTests) => {
    setShowCementTestingPopup(false);
    // Navigate to cement testing form with selected tests
    navigate('/cement-testing-form', { 
      state: { selectedTests } 
    });
  };

  const services = [
    {
      id: 1,
      name: 'Bulk Density and Moisture Content',
      icon: faWeightHanging,
      color: 'success',
      available: true
    },
    {
      id: 2,
      name: 'Liquid Admixture',
      icon: faTint,
      color: 'danger',
      available: true
    },
    {
      id: 3,
      name: 'AAC Blocks',
      icon: faCube,
      color: 'warning',
      available: true
    },
    {
      id: 4,
      name: '10/20 mm Aggregate',
      icon: faCubes,
      color: 'primary',
      available: true
    },
    {
      id: 5,
      name: 'Cement Testing',
      icon: faIndustry,
      color: 'secondary',
      available: true
    },
    {
      id: 6,
      name: 'Fine Aggregate',
      icon: faMountain,
      color: 'info',
      available: true
    },
    {
      id: 7,
      name: 'Soil Testing',
      icon: faSeedling,
      color: 'brown',
      available: true
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
                <h1 style={{ color: '#ffffff', fontWeight: '700', margin: 0 }}>
                  Other Testing Services
                </h1>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                variant="primary" 
                className="btn-vitrag-primary"
                onClick={() => navigate('/other-services-dashboard')}
              >
                View Other Services Dashboard
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>

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
                  
        {service.available ? (
          service.id === 4 ? (
            <Button
              onClick={handleCoarseAggregateClick}
              variant="primary"
              className="btn-vitrag-primary"
            >
              Start Testing
            </Button>
          ) : service.id === 5 ? (
            <Button
              onClick={handleCementTestingClick}
              variant="primary"
              className="btn-vitrag-primary"
            >
              Start Testing
            </Button>
          ) : service.id === 6 ? (
            <Button
              onClick={handleFineAggregateClick}
              variant="primary"
              className="btn-vitrag-primary"
            >
              Start Testing
            </Button>
          ) : service.id === 7 ? (
            <Button
              as={Link}
              to="/soil-testing-form"
              variant="primary"
              className="btn-vitrag-primary"
            >
              Start Testing
            </Button>
          ) : (
            <Button
              as={Link}
              to={
                service.id === 1 ? '/bulk-density-moisture-form' :
                service.id === 2 ? '/liquid-admixture-form' :
                service.id === 3 ? '/aac-blocks-form' : '#'
              }
              variant="primary"
              className="btn-vitrag-primary"
            >
              Start Testing
            </Button>
          )
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

      </Container>

      {/* Fine Aggregate Test Selection Popup */}
      <FineAggregateTestSelection
        show={showFineAggregatePopup}
        onHide={() => setShowFineAggregatePopup(false)}
        onProceed={handleFineAggregateProceed}
      />

      {/* Coarse Aggregate Test Selection Popup */}
      <CoarseAggregateTestSelection
        show={showCoarseAggregatePopup}
        onHide={() => setShowCoarseAggregatePopup(false)}
        onProceed={handleCoarseAggregateProceed}
      />

      {/* Cement Testing Selection Popup */}
      <CementTestingSelection
        show={showCementTestingPopup}
        onHide={() => setShowCementTestingPopup(false)}
        onProceed={handleCementTestingProceed}
      />

    </div>
  );
};

export default OtherServices;
