import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTable, faUserCheck, faComment } from '@fortawesome/free-solid-svg-icons';

const Form1CompactionTest = ({ formData, handleInputChange }) => {
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
                      as="textarea" 
                      rows={2} 
                      name="test_method" 
                      value={formData.test_method} 
                      onChange={handleInputChange} 
                      className="form-control-vitrag" 
                      placeholder="IS 2720 (PART 7-1980)&#10;IS 2720 (PART 8-1983)"
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
              <div className="table-responsive">
                <table className="table transparent-table" style={{ fontSize: '0.9rem', marginBottom: '2rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '50px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>Sr.No</th>
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
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Weight of the mould Wm (gm)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_mould_1" value={formData.weight_mould_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_mould_2" value={formData.weight_mould_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_mould_3" value={formData.weight_mould_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_mould_4" value={formData.weight_mould_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_mould_5" value={formData.weight_mould_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>2</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Weight of the Mould + compacted soil W (gm)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_mould_soil_1" value={formData.weight_mould_soil_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_mould_soil_2" value={formData.weight_mould_soil_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_mould_soil_3" value={formData.weight_mould_soil_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_mould_soil_4" value={formData.weight_mould_soil_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_mould_soil_5" value={formData.weight_mould_soil_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>3</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Moisture Container No.</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="container_no_1" value={formData.container_no_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="container_no_2" value={formData.container_no_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="container_no_3" value={formData.container_no_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="container_no_4" value={formData.container_no_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="container_no_5" value={formData.container_no_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>4</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Weight of moisture container W₁ (gm)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_container_1" value={formData.weight_container_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_container_2" value={formData.weight_container_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_container_3" value={formData.weight_container_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_container_4" value={formData.weight_container_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_container_5" value={formData.weight_container_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>5</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Weight of Container + Wet Soil W₂ (gm)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_wet_soil_1" value={formData.weight_wet_soil_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_wet_soil_2" value={formData.weight_wet_soil_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_wet_soil_3" value={formData.weight_wet_soil_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_wet_soil_4" value={formData.weight_wet_soil_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_wet_soil_5" value={formData.weight_wet_soil_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>6</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Weight of Container + Dry Soil W₃ (gm)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_dry_soil_1" value={formData.weight_dry_soil_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_dry_soil_2" value={formData.weight_dry_soil_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_dry_soil_3" value={formData.weight_dry_soil_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_dry_soil_4" value={formData.weight_dry_soil_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_dry_soil_5" value={formData.weight_dry_soil_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>7</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wet Density γm = (W-Wm)/ Vm (gm/cm³)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wet_density_1" value={formData.wet_density_1} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wet_density_2" value={formData.wet_density_2} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wet_density_3" value={formData.wet_density_3} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wet_density_4" value={formData.wet_density_4} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wet_density_5" value={formData.wet_density_5} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>8</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Moisture Content w% = (W₂-W₃) ×100/(W₃-W₁)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_1" value={formData.moisture_content_1} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_2" value={formData.moisture_content_2} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_3" value={formData.moisture_content_3} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_4" value={formData.moisture_content_4} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_5" value={formData.moisture_content_5} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>9</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Dry Density γd = γm/ (1+w/100) (gm/cm³)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="dry_density_1" value={formData.dry_density_1} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="dry_density_2" value={formData.dry_density_2} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="dry_density_3" value={formData.dry_density_3} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="dry_density_4" value={formData.dry_density_4} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="dry_density_5" value={formData.dry_density_5} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Observation Tables */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h6 style={{ color: 'var(--vitrag-gold)', textDecoration: 'underline', marginBottom: '1rem' }}>Observation</h6>
                  <table className="table transparent-table" style={{ fontSize: '0.9rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: '50px', padding: '6px', border: '1px solid #dee2e6', fontSize: '0.9rem', textAlign: 'center' }}>Sr.No</th>
                        <th style={{ width: '200px', padding: '6px', border: '1px solid #dee2e6', fontSize: '0.9rem' }}>Description</th>
                        <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', fontSize: '0.9rem', textAlign: 'center' }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>1</td>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Volume of Mould, Vm :</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="volume_mould" value={formData.volume_mould} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>2</td>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Weight of the Rammer :</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_rammer" value={formData.weight_rammer} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>3</td>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Percentage passing <Form.Control size="sm" type="number" name="sieve_size_passing" value={formData.sieve_size_passing} onChange={handleInputChange} style={{ width: '60px', display: 'inline-block', fontSize: '0.8rem' }} /> mm Sieve:</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percentage_passing" value={formData.percentage_passing} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>4</td>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Percentage retained on <Form.Control size="sm" type="number" name="sieve_size_retained" value={formData.sieve_size_retained} onChange={handleInputChange} style={{ width: '60px', display: 'inline-block', fontSize: '0.8rem' }} /> mm Sieve:</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percentage_retained" value={formData.percentage_retained} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6 mb-3">
                  <h6 style={{ color: 'var(--vitrag-gold)', textDecoration: 'underline', marginBottom: '1rem' }}>Observation</h6>
                  <table className="table transparent-table" style={{ fontSize: '0.9rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: '50px', padding: '6px', border: '1px solid #dee2e6', fontSize: '0.9rem', textAlign: 'center' }}>Sr.No</th>
                        <th style={{ width: '200px', padding: '6px', border: '1px solid #dee2e6', fontSize: '0.9rem' }}>Description</th>
                        <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', fontSize: '0.9rem', textAlign: 'center' }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>1</td>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Maximum Dry Density</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="max_dry_density" value={formData.max_dry_density} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>2</td>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Optimum Moisture Content</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="optimum_moisture" value={formData.optimum_moisture} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Form1CompactionTest;
