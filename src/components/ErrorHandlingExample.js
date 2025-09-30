import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { createTestRequest } from '../apis/testRequests';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Example component showing proper error handling for Flask API calls
 */
const ErrorHandlingExample = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    testType: 'CC',
    receiptDate: '',
    ulrNumber: '',
    jobNumber: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Method 1: Using try-catch with custom error handling
  const handleSubmitMethod1 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createTestRequest(formData);
      setSuccess(true);
      console.log('Test request created:', result);
    } catch (error) {
      // Error is already handled in the API function with user-friendly alerts
      // But we can also handle it here for additional logic
      console.error('Form submission error:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Method 2: Using try-catch with manual error handling
  const handleSubmitMethod2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createTestRequest(formData);
      setSuccess(true);
      console.log('Test request created:', result);
    } catch (error) {
      // Manual error handling
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      
      // You can also show additional UI feedback here
      console.error('Detailed error:', error.originalError || error);
    } finally {
      setLoading(false);
    }
  };

  // Method 3: Using async/await with error boundary pattern
  const handleSubmitMethod3 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await createTestRequest(formData)
      .then(data => {
        setSuccess(true);
        console.log('Test request created:', data);
        return data;
      })
      .catch(error => {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
        console.error('API Error:', error);
        throw error; // Re-throw if you want calling code to handle
      })
      .finally(() => {
        setLoading(false);
      });

    return result;
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
              <h3>Flask API Error Handling Examples</h3>
            </Card.Header>
            <Card.Body>
              {/* Success Alert */}
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
                  Test request created successfully!
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  <strong>Error:</strong> {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmitMethod1}>
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

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Job Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="jobNumber"
                        value={formData.jobNumber}
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
                      'Submit (Method 1)'
                    )}
                  </Button>

                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleSubmitMethod2}
                    disabled={loading}
                    className="me-2"
                  >
                    Submit (Method 2)
                  </Button>

                  <Button 
                    type="button" 
                    variant="info" 
                    onClick={handleSubmitMethod3}
                    disabled={loading}
                  >
                    Submit (Method 3)
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

export default ErrorHandlingExample;
