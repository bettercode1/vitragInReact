import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { createTestRequest } from '../apis/testRequests';
import { useFormSubmission } from '../hooks/useApiError';

/**
 * Clean example using custom hooks for error handling
 */
const CleanErrorHandlingExample = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    testType: 'CC',
    receiptDate: '',
    ulrNumber: '',
    jobNumber: ''
  });

  // Using the custom hook for clean error handling
  const {
    handleSubmit,
    loading,
    error,
    success,
    reset
  } = useFormSubmission(createTestRequest, {
    successMessage: 'Test request created successfully!',
    errorMessage: 'Failed to create test request',
    onSuccess: (data) => {
      console.log('Success:', data);
      // You can add additional success logic here
    },
    onError: (error, message) => {
      console.error('Error details:', error);
      // You can add additional error logic here
    }
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="bg-dark text-white">
            <Card.Header>
              <h3>Clean Error Handling with Custom Hook</h3>
            </Card.Header>
            <Card.Body>
              {/* Success Alert */}
              {success && (
                <Alert variant="success" dismissible onClose={reset}>
                  Test request created successfully!
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" dismissible onClose={reset}>
                  <strong>Error:</strong> {error}
                </Alert>
              )}

              <Form onSubmit={onSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Customer Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        style={{ backgroundColor: 'transparent', border: '1px solid #6c757d', color: 'white' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Test Type</Form.Label>
                      <Form.Select
                        name="testType"
                        value={formData.testType}
                        onChange={handleInputChange}
                        style={{ backgroundColor: 'transparent', border: '1px solid #6c757d', color: 'white' }}
                      >
                        <option value="CC">Concrete Cube</option>
                        <option value="MT">Material Testing</option>
                        <option value="NDT">Non-Destructive Testing</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Receipt Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="receiptDate"
                        value={formData.receiptDate}
                        onChange={handleInputChange}
                        required
                        style={{ backgroundColor: 'transparent', border: '1px solid #6c757d', color: 'white' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ULR Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="ulrNumber"
                        value={formData.ulrNumber}
                        onChange={handleInputChange}
                        placeholder="Leave empty for auto-generation"
                        style={{ backgroundColor: 'transparent', border: '1px solid #6c757d', color: 'white' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading}
                    className="me-2"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Creating...
                      </>
                    ) : (
                      'Create Test Request'
                    )}
                  </Button>

                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={reset}
                    disabled={loading}
                  >
                    Reset
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CleanErrorHandlingExample;
