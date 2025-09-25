import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTable } from '@fortawesome/free-solid-svg-icons';

const Form2FreeSwellIndex = ({ formData, handleInputChange }) => {
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
                      value={formData.test_method} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      defaultValue="IS2720 (PART-40)-1977"
                      style={{ fontWeight: 'bold' }}
                      readOnly
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
              <h5 style={{ color: 'var(--vitrag-gold)', marginBottom: '1rem', textAlign: 'center' }}>Free Swell Index of Soil Sample</h5>
              <div className="table-responsive">
                <table className="table transparent-table" style={{ fontSize: '0.9rem', marginBottom: '2rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '60px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>Sr.No</th>
                      <th style={{ width: '400px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem' }}>Description</th>
                      <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>1</th>
                      <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>2</th>
                      <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>1</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Volume of Soil Specimen read from graduated Cylinder containing distilled water (V1)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="volume_water_1" value={formData.volume_water_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="volume_water_2" value={formData.volume_water_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="volume_water_3" value={formData.volume_water_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>2</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Volume of soil Specimen read from graduated Cylinder containing distilled kerosene (V2)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="volume_kerosene_1" value={formData.volume_kerosene_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="volume_kerosene_2" value={formData.volume_kerosene_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="volume_kerosene_3" value={formData.volume_kerosene_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>3</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Free Swell Index = (V1-V2)X100/ V2 (%)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="free_swell_index_1" value={formData.free_swell_index_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="free_swell_index_2" value={formData.free_swell_index_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="free_swell_index_3" value={formData.free_swell_index_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Final Result */}
              <div className="text-center" style={{ marginTop: '2rem' }}>
                <h5 style={{ color: 'var(--vitrag-gold)', marginBottom: '1rem' }}>
                  <strong>Free Swell Index of Soil Sample = </strong>
                  <Form.Control 
                    type="number" 
                    step="0.01" 
                    name="final_free_swell_index" 
                    value={formData.final_free_swell_index} 
                    onChange={handleInputChange}
                    style={{ 
                      display: 'inline-block', 
                      width: '150px', 
                      marginLeft: '10px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                    className="form-control-vitrag"
                  />
                  <span style={{ marginLeft: '10px', fontSize: '1.1rem', fontWeight: 'bold' }}>%</span>
                </h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Form2FreeSwellIndex;
