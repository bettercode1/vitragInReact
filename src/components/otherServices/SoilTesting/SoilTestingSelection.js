import React, { useState } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faTimes } from '@fortawesome/free-solid-svg-icons';

const SoilTestingSelection = ({ show, onHide, onProceed }) => {
  const [selectedTests, setSelectedTests] = useState({
    selectAll: true,
    compactionTest: true,
    freeSwellIndex: true,
    grainSizeAnalysis: true,
    liquidLimit: true,
    plasticLimit: true,
    waterContent: true
  });

  const testOptions = [
    {
      id: 'compactionTest',
      label: '1. Determination of Compaction Test (Light/Heavy)',
      checked: selectedTests.compactionTest
    },
    {
      id: 'freeSwellIndex',
      label: '2. Determination of Free Swell Index',
      checked: selectedTests.freeSwellIndex
    },
    {
      id: 'grainSizeAnalysis',
      label: '3. Determination of Grain Size Analysis',
      checked: selectedTests.grainSizeAnalysis
    },
    {
      id: 'liquidLimit',
      label: '4. Determination of Liquid Limit',
      checked: selectedTests.liquidLimit
    },
    {
      id: 'plasticLimit',
      label: '5. Determination of Plastic Limit',
      checked: selectedTests.plasticLimit
    },
    {
      id: 'waterContent',
      label: '6. Determination of Water Content (Oven-Drying Method)',
      checked: selectedTests.waterContent
    }
  ];

  const handleSelectAll = (checked) => {
    setSelectedTests({
      selectAll: checked,
      compactionTest: checked,
      freeSwellIndex: checked,
      grainSizeAnalysis: checked,
      liquidLimit: checked,
      plasticLimit: checked,
      waterContent: checked
    });
  };

  const handleTestChange = (testId, checked) => {
    const newSelectedTests = {
      ...selectedTests,
      [testId]: checked
    };
    
    // Update selectAll based on individual selections
    const allSelected = newSelectedTests.compactionTest && 
                       newSelectedTests.freeSwellIndex && 
                       newSelectedTests.grainSizeAnalysis &&
                       newSelectedTests.liquidLimit &&
                       newSelectedTests.plasticLimit &&
                       newSelectedTests.waterContent;
    
    setSelectedTests({
      ...newSelectedTests,
      selectAll: allSelected
    });
  };

  const handleClearAll = () => {
    setSelectedTests({
      selectAll: false,
      compactionTest: false,
      freeSwellIndex: false,
      grainSizeAnalysis: false,
      liquidLimit: false,
      plasticLimit: false,
      waterContent: false
    });
  };

  const handleProceed = () => {
    const selectedTestIds = [];
    if (selectedTests.compactionTest) selectedTestIds.push('compactionTest');
    if (selectedTests.freeSwellIndex) selectedTestIds.push('freeSwellIndex');
    if (selectedTests.grainSizeAnalysis) selectedTestIds.push('grainSizeAnalysis');
    if (selectedTests.liquidLimit) selectedTestIds.push('liquidLimit');
    if (selectedTests.plasticLimit) selectedTestIds.push('plasticLimit');
    if (selectedTests.waterContent) selectedTestIds.push('waterContent');
    
    onProceed(selectedTestIds);
  };

  const hasAnySelected = selectedTests.compactionTest || 
                        selectedTests.freeSwellIndex || 
                        selectedTests.grainSizeAnalysis ||
                        selectedTests.liquidLimit ||
                        selectedTests.plasticLimit ||
                        selectedTests.waterContent;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size="lg"
      className="soil-testing-selection-modal"
    >
      <Modal.Header 
        closeButton={false}
        style={{ 
          backgroundColor: 'var(--vitrag-brown)', // Brown color for Soil Testing
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
                  icon={faSeedling} 
                  size="lg" 
                  className="text-white" 
                />
              </div>
              <h4 className="mb-0 text-white fw-bold">
                Soil Testing
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

export default SoilTestingSelection;
