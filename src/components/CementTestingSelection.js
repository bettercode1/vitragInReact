import React, { useState } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndustry, faTimes } from '@fortawesome/free-solid-svg-icons';

const CementTestingSelection = ({ show, onHide, onProceed }) => {
  const [selectedTests, setSelectedTests] = useState({
    selectAll: true,
    fineness: true,
    consistency: true,
    settingTime: true,
    soundness: true,
    compressiveStrength: true
  });

  const testOptions = [
    {
      id: 'fineness',
      label: '1. Determination of Fineness of Cement by Dry Sieving',
      checked: selectedTests.fineness
    },
    {
      id: 'consistency',
      label: '2. Determination of Standard Consistency of Cement',
      checked: selectedTests.consistency
    },
    {
      id: 'settingTime',
      label: '3. Determination of Initial and Final Setting Time of Cement',
      checked: selectedTests.settingTime
    },
    {
      id: 'soundness',
      label: '4. Determination of Soundness of Cement by Le-Chatelier Method',
      checked: selectedTests.soundness
    },
    {
      id: 'compressiveStrength',
      label: '5. Determination of Compressive Strength of Cement',
      checked: selectedTests.compressiveStrength
    }
  ];

  const handleSelectAll = (checked) => {
    setSelectedTests({
      selectAll: checked,
      fineness: checked,
      consistency: checked,
      settingTime: checked,
      soundness: checked,
      compressiveStrength: checked
    });
  };

  const handleTestChange = (testId, checked) => {
    const newSelectedTests = {
      ...selectedTests,
      [testId]: checked
    };
    
    // Update selectAll based on individual selections
    const allSelected = newSelectedTests.fineness && 
                       newSelectedTests.consistency && 
                       newSelectedTests.settingTime &&
                       newSelectedTests.soundness &&
                       newSelectedTests.compressiveStrength;
    
    setSelectedTests({
      ...newSelectedTests,
      selectAll: allSelected
    });
  };

  const handleClearAll = () => {
    setSelectedTests({
      selectAll: false,
      fineness: false,
      consistency: false,
      settingTime: false,
      soundness: false,
      compressiveStrength: false
    });
  };

  const handleProceed = () => {
    const selectedTestIds = [];
    if (selectedTests.fineness) selectedTestIds.push('fineness');
    if (selectedTests.consistency) selectedTestIds.push('consistency');
    if (selectedTests.settingTime) selectedTestIds.push('settingTime');
    if (selectedTests.soundness) selectedTestIds.push('soundness');
    if (selectedTests.compressiveStrength) selectedTestIds.push('compressiveStrength');
    
    onProceed(selectedTestIds);
  };

  const hasAnySelected = selectedTests.fineness || 
                        selectedTests.consistency || 
                        selectedTests.settingTime ||
                        selectedTests.soundness ||
                        selectedTests.compressiveStrength;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size="lg"
      className="cement-testing-selection-modal"
    >
      <Modal.Header 
        closeButton={false}
        style={{ 
          backgroundColor: '#6c757d', // Gray color for Cement Testing
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
                  icon={faIndustry} 
                  size="lg" 
                  className="text-white" 
                />
              </div>
              <h4 className="mb-0 text-white fw-bold">
                Cement Testing
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

export default CementTestingSelection;
