import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTable } from '@fortawesome/free-solid-svg-icons';

const Form5PlasticLimit = ({ formData, handleInputChange }) => {
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
                      value={formData.test_method || "IS 2720 (PART-5)-1985"} 
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
              <h5 style={{ color: 'var(--vitrag-gold)', textDecoration: 'underline', textAlign: 'center', marginBottom: '1.5rem' }}>PLASTIC LIMIT DETERMINATION</h5>
              <div className="table-responsive">
                <table className="table transparent-table" style={{ fontSize: '0.9rem', marginBottom: '2rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '60px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>Sr.No</th>
                      <th style={{ width: '300px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem' }}>Description</th>
                      <th style={{ width: '80px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>1</th>
                      <th style={{ width: '80px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>2</th>
                      <th style={{ width: '80px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>3</th>
                      <th style={{ width: '80px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>4</th>
                      <th style={{ width: '80px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>1</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Container No.</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="plastic_container_no_1" value={formData.plastic_container_no_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="plastic_container_no_2" value={formData.plastic_container_no_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="plastic_container_no_3" value={formData.plastic_container_no_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="plastic_container_no_4" value={formData.plastic_container_no_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="plastic_container_no_5" value={formData.plastic_container_no_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>2</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wt. of Container (W1) gm</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_1" value={formData.plastic_wt_container_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_2" value={formData.plastic_wt_container_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_3" value={formData.plastic_wt_container_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_4" value={formData.plastic_wt_container_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_5" value={formData.plastic_wt_container_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>3</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wt. of Container + Wet Soil (W2) gm</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_wet_soil_1" value={formData.plastic_wt_container_wet_soil_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_wet_soil_2" value={formData.plastic_wt_container_wet_soil_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_wet_soil_3" value={formData.plastic_wt_container_wet_soil_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_wet_soil_4" value={formData.plastic_wt_container_wet_soil_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_wet_soil_5" value={formData.plastic_wt_container_wet_soil_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>4</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wt. of Container + Dry Soil (W3) gm</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_dry_soil_1" value={formData.plastic_wt_container_dry_soil_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_dry_soil_2" value={formData.plastic_wt_container_dry_soil_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_dry_soil_3" value={formData.plastic_wt_container_dry_soil_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_dry_soil_4" value={formData.plastic_wt_container_dry_soil_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_container_dry_soil_5" value={formData.plastic_wt_container_dry_soil_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>5</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wt. of Water (W2-W3) gm</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_water_1" value={formData.plastic_wt_water_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_water_2" value={formData.plastic_wt_water_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_water_3" value={formData.plastic_wt_water_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_water_4" value={formData.plastic_wt_water_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_water_5" value={formData.plastic_wt_water_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>6</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wt. of Dry Soil (W3-W1) gm</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_dry_soil_1" value={formData.plastic_wt_dry_soil_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_dry_soil_2" value={formData.plastic_wt_dry_soil_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_dry_soil_3" value={formData.plastic_wt_dry_soil_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_dry_soil_4" value={formData.plastic_wt_dry_soil_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_wt_dry_soil_5" value={formData.plastic_wt_dry_soil_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>7</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Moisture Content (%) = (W2-W3)/(W3-W1)× 100</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_moisture_content_1" value={formData.plastic_moisture_content_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_moisture_content_2" value={formData.plastic_moisture_content_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_moisture_content_3" value={formData.plastic_moisture_content_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_moisture_content_4" value={formData.plastic_moisture_content_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="plastic_moisture_content_5" value={formData.plastic_moisture_content_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Final Results */}
              <div className="text-center" style={{ marginTop: '2rem' }}>
                <div className="mb-3">
                  <h5 style={{ color: 'var(--vitrag-gold)', marginBottom: '1rem' }}>
                    <strong>PLASTIC LIMIT = </strong>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      name="plastic_limit" 
                      value={formData.plastic_limit} 
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
                <div>
                  <h5 style={{ color: 'var(--vitrag-gold)', marginBottom: '1rem' }}>
                    <strong>PLASTIC INDEX = LIQUID LIMIT - PLASTIC LIMIT = </strong>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      name="plastic_index" 
                      value={formData.plastic_index} 
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
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Form5PlasticLimit;
