import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTable } from '@fortawesome/free-solid-svg-icons';

const Form6WaterContent = ({ formData, handleInputChange }) => {
  return (
    <div>
      {/* General Information */}
      <Row className="mb-4">
        <Col>
          <Card className="card-vitrag">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faInfoCircle} className="me-2" />General Information</h4>
            </Card.Header>
            <Card.Body className="transparent-input-section">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Customer Name *</Form.Label>
                    <Form.Select name="customer_id" value={formData.customer_id} onChange={handleInputChange} className="form-control-vitrag" required>
                      <option value="">-- Select Customer --</option>
                      <option value="1">Sample Customer 1</option>
                      <option value="2">Sample Customer 2</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Test Code Number</Form.Label>
                    <Form.Control type="text" name="sample_test_code" value={formData.sample_test_code} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Receipt</Form.Label>
                    <Form.Control type="date" name="date_of_receipt" value={formData.date_of_receipt} onChange={handleInputChange} className="form-control-vitrag" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="text" name="quantity" value={formData.quantity} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Condition</Form.Label>
                    <Form.Control type="text" name="sample_condition" value={formData.sample_condition} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Description</Form.Label>
                    <Form.Control as="textarea" rows={3} name="sample_description" value={formData.sample_description} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Testing</Form.Label>
                    <Form.Control type="date" name="date_of_testing" value={formData.date_of_testing} onChange={handleInputChange} className="form-control-vitrag" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Test Method</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="test_method" 
                      value={formData.test_method || "IS 2720 (PART 2)-1973"} 
                      readOnly
                      className="form-control-vitrag" 
                      style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: '#495057', opacity: 0.9 }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Test Results */}
      <Row className="mb-4">
        <Col>
          <Card className="card-vitrag">
            <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
              <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faTable} className="me-2" />Test Results</h4>
            </Card.Header>
            <Card.Body className="transparent-input-section">
              <h5 style={{ color: 'var(--vitrag-gold)', textDecoration: 'underline', textAlign: 'center', marginBottom: '1.5rem' }}>Water Content Determination (Oven-Drying Method)</h5>
              <div className="table-responsive">
                <table className="table transparent-table" style={{ fontSize: '0.9rem', marginBottom: '2rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '80px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>Sr.No.</th>
                      <th style={{ width: '400px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem' }}>Description</th>
                      <th style={{ width: '150px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>1</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Container No.</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="water_container_no" value={formData.water_container_no} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>2</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Mass of container W₁, in g</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="water_mass_container" value={formData.water_mass_container} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>3</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Mass of container and wet soil W₂, in g</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="water_mass_container_wet_soil" value={formData.water_mass_container_wet_soil} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>4</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Mass of container and dry soil W₃, in g</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="water_mass_container_dry_soil" value={formData.water_mass_container_dry_soil} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>5</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Mass of moisture ( W₂ - W₃ ), in g</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="water_mass_moisture" value={formData.water_mass_moisture} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>6</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Mass of dry soil ( W₃ - W₁ ), in g</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="water_mass_dry_soil" value={formData.water_mass_dry_soil} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>7</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Water Content (%) (( W₂ - W₃ ) x 100)/( W₃ - W₁)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="water_content_percentage" value={formData.water_content_percentage} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Form6WaterContent;
