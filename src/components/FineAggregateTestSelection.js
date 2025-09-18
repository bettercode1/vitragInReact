import React, { useState } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountain, faTimes } from '@fortawesome/free-solid-svg-icons';

const FineAggregateTestSelection = ({ show, onHide, onProceed }) => {
  const [selectedTests, setSelectedTests] = useState({
    selectAll: true,
    bulkDensity: true,
    sieveAnalysis: true,
    specificGravity: true
  });

  const testOptions = [
    {
      id: 'bulkDensity',
      label: '1. Determination of Bulk Density of Aggregate (Rodded & Loose)',
      checked: selectedTests.bulkDensity
    },
    {
      id: 'sieveAnalysis',
      label: '2. Sieve Analysis of Fine Aggregate',
      checked: selectedTests.sieveAnalysis
    },
    {
      id: 'specificGravity',
      label: '3. Determination of Specific Gravity & Water Absorption of Fine Aggregate',
      checked: selectedTests.specificGravity
    }
  ];

  const handleSelectAll = (checked) => {
    setSelectedTests({
      selectAll: checked,
      bulkDensity: checked,
      sieveAnalysis: checked,
      specificGravity: checked
    });
  };

  const handleTestChange = (testId, checked) => {
    const newSelectedTests = {
      ...selectedTests,
      [testId]: checked
    };
    
    // Update selectAll based on individual selections
    const allSelected = newSelectedTests.bulkDensity && 
                       newSelectedTests.sieveAnalysis && 
                       newSelectedTests.specificGravity;
    
    setSelectedTests({
      ...newSelectedTests,
      selectAll: allSelected
    });
  };

  const handleClearAll = () => {
    setSelectedTests({
      selectAll: false,
      bulkDensity: false,
      sieveAnalysis: false,
      specificGravity: false
    });
  };

  const handleProceed = () => {
    const selectedTestIds = [];
    if (selectedTests.bulkDensity) selectedTestIds.push('bulkDensity');
    if (selectedTests.sieveAnalysis) selectedTestIds.push('sieveAnalysis');
    if (selectedTests.specificGravity) selectedTestIds.push('specificGravity');
    
    onProceed(selectedTestIds);
  };

  const hasAnySelected = selectedTests.bulkDensity || 
                        selectedTests.sieveAnalysis || 
                        selectedTests.specificGravity;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size="lg"
      className="fine-aggregate-selection-modal"
    >
      <Modal.Header 
        closeButton={false}
        style={{ 
          backgroundColor: '#20c997', // Teal color matching the reference
          border: 'none',
          padding: '1.5rem 2rem'
        }}
      >
        <Container fluid>
          <Row className="align-items-center">
            <Col className="d-flex align-items-center">
              <div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <FontAwesomeIcon 
                  icon={faMountain} 
                  size="lg" 
                  className="text-white" 
                />
              </div>
              <h4 className="mb-0 text-white fw-bold">
                Fine Aggregate Testing
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
          minHeight: '400px'
        }}
      >
        <Container fluid>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="text-center mb-4">
                <h5 className="text-white mb-4">Select the tests you want to perform:</h5>
                
                <Form className="text-start">
                  {/* Select All Checkbox */}
                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="selectAll"
                      label="Select all"
                      checked={selectedTests.selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="text-white"
                      style={{ fontSize: '1.1rem', fontWeight: '500' }}
                    />
                  </Form.Group>

                  {/* Individual Test Checkboxes */}
                  {testOptions.map((test) => (
                    <Form.Group key={test.id} className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id={test.id}
                        label={test.label}
                        checked={test.checked}
                        onChange={(e) => handleTestChange(test.id, e.target.checked)}
                        className="text-white"
                        style={{ fontSize: '1rem' }}
                      />
                    </Form.Group>
                  ))}
                </Form>

                {/* Buttons right below checkboxes */}
                <div className="d-flex justify-content-center mt-4">
                  <Button 
                    variant="outline-light" 
                    onClick={handleClearAll}
                    className="me-3 px-4"
                    disabled={!hasAnySelected}
                  >
                    Clear All
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleProceed}
                    className="px-4"
                    disabled={!hasAnySelected}
                  >
                    Proceed
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default FineAggregateTestSelection;
