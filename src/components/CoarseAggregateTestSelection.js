import React, { useState } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes, faTimes } from '@fortawesome/free-solid-svg-icons';

const CoarseAggregateTestSelection = ({ show, onHide, onProceed }) => {
  const [selectedTests, setSelectedTests] = useState({
    selectAll: true,
    bulkDensity: true,
    sieveAnalysis: true,
    specificGravity: true,
    impactValue: true,
    crushingValue: true
  });

  const testOptions = [
    {
      id: 'bulkDensity',
      label: '1. Determination of Bulk Density of Coarse Aggregate (Rodded & Loose)',
      checked: selectedTests.bulkDensity
    },
    {
      id: 'sieveAnalysis',
      label: '2. Sieve Analysis of Coarse Aggregate (10/20 mm)',
      checked: selectedTests.sieveAnalysis
    },
    {
      id: 'specificGravity',
      label: '3. Determination of Specific Gravity & Water Absorption of Coarse Aggregate',
      checked: selectedTests.specificGravity
    },
    {
      id: 'impactValue',
      label: '4. Determination of Impact Value of Coarse Aggregate',
      checked: selectedTests.impactValue
    },
    {
      id: 'crushingValue',
      label: '5. Determination of Crushing Value of Coarse Aggregate',
      checked: selectedTests.crushingValue
    }
  ];

  const handleSelectAll = (checked) => {
    setSelectedTests({
      selectAll: checked,
      bulkDensity: checked,
      sieveAnalysis: checked,
      specificGravity: checked,
      impactValue: checked,
      crushingValue: checked
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
                       newSelectedTests.specificGravity &&
                       newSelectedTests.impactValue &&
                       newSelectedTests.crushingValue;
    
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
      specificGravity: false,
      impactValue: false,
      crushingValue: false
    });
  };

  const handleProceed = () => {
    const selectedTestIds = [];
    if (selectedTests.bulkDensity) selectedTestIds.push('bulkDensity');
    if (selectedTests.sieveAnalysis) selectedTestIds.push('sieveAnalysis');
    if (selectedTests.specificGravity) selectedTestIds.push('specificGravity');
    if (selectedTests.impactValue) selectedTestIds.push('impactValue');
    if (selectedTests.crushingValue) selectedTestIds.push('crushingValue');
    
    onProceed(selectedTestIds);
  };

  const hasAnySelected = selectedTests.bulkDensity || 
                        selectedTests.sieveAnalysis || 
                        selectedTests.specificGravity ||
                        selectedTests.impactValue ||
                        selectedTests.crushingValue;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size="lg"
      className="coarse-aggregate-selection-modal"
    >
      <Modal.Header 
        closeButton={false}
        style={{ 
          backgroundColor: '#007bff', // Blue color for Coarse Aggregate
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
                  icon={faCubes} 
                  size="lg" 
                  className="text-white" 
                />
              </div>
              <h4 className="mb-0 text-white fw-bold">
                10/20 mm Aggregate Testing
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
          minHeight: '500px'
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

export default CoarseAggregateTestSelection;
