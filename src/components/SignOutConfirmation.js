import React from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const SignOutConfirmation = ({ show, onHide, onConfirm }) => {
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size="md"
      className="signout-confirmation-modal"
    >
      <Modal.Header 
        closeButton={false}
        style={{ 
          backgroundColor: '#dc3545', // Red color for warning
          border: 'none',
          padding: '1.5rem 2rem'
        }}
      >
        <Container fluid>
          <Row className="align-items-center">
            <Col className="d-flex align-items-center">
              <div 
                className="d-inline-flex align-items-center justify-content-center me-3"
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  minWidth: '50px',
                  minHeight: '50px',
                  maxWidth: '50px',
                  maxHeight: '50px'
                }}
              >
                <FontAwesomeIcon 
                  icon={faExclamationTriangle} 
                  size="lg" 
                  className="text-white" 
                />
              </div>
              <h4 className="mb-0 text-white fw-bold">
                Are you sure you want to sign out?
              </h4>
            </Col>
            <Col xs="auto">
              <Button 
                variant="link" 
                onClick={onHide}
                className="text-white p-0"
                style={{ fontSize: '1.5rem' }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Header>

      <Modal.Body 
        style={{ 
          backgroundColor: '#1C2333', // Home page color
          padding: '2rem',
          minHeight: '200px'
        }}
      >
        <Container fluid>
          <Row className="justify-content-center">
            <Col md={10}>
              <div className="text-center">
                <div className="mb-4">
                  <FontAwesomeIcon 
                    icon={faSignOutAlt} 
                    size="3x" 
                    className="text-warning mb-3"
                  />
                </div>
                <h5 className="text-white mb-4">
                  You will be redirected to the sign in page
                </h5>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>

      <Modal.Footer 
        style={{ 
          backgroundColor: '#1C2333', // Home page color
          border: 'none',
          padding: '1.5rem 2rem',
          justifyContent: 'center'
        }}
      >
        <Button 
          variant="danger" 
          onClick={onConfirm}
          className="me-3 px-4"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Yes, Sign Out
        </Button>
        <Button 
          variant="outline-light" 
          onClick={onHide}
          className="px-4"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignOutConfirmation;
