import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTable } from '@fortawesome/free-solid-svg-icons';

const Form3GrainSizeAnalysis = ({ formData, handleInputChange }) => {
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
                      defaultValue="IS 2720 (PART 4)-1985"
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
              {/* Observation Section */}
              <div className="mb-4">
                <h5 style={{ color: 'var(--vitrag-gold)', textDecoration: 'underline', textAlign: 'center', marginBottom: '1.5rem' }}>Observation</h5>
                
                {/* Observation List */}
                <div className="mb-4">
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-3" style={{ fontWeight: 'bold', minWidth: '20px' }}>1.</span>
                        <span className="me-3">Total Oven dried weight of representative sample:</span>
                        <Form.Control 
                          type="number" 
                          step="0.01" 
                          name="total_oven_dried_weight" 
                          value={formData.total_oven_dried_weight} 
                          onChange={handleInputChange}
                          style={{ width: '150px' }}
                          size="sm"
                        />
                        <span className="ms-2">gm</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-3" style={{ fontWeight: 'bold', minWidth: '20px' }}>2.</span>
                        <span className="me-3">Quantity Retained on 80 mm Sieve:</span>
                        <Form.Control 
                          type="number" 
                          step="0.01" 
                          name="quantity_retained_80mm" 
                          value={formData.quantity_retained_80mm} 
                          onChange={handleInputChange}
                          style={{ width: '150px' }}
                          size="sm"
                        />
                        <span className="ms-2">gm</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-3" style={{ fontWeight: 'bold', minWidth: '20px' }}>3.</span>
                        <span className="me-3">Quantity of Material Passing 80 mm Sieve:</span>
                        <Form.Control 
                          type="number" 
                          step="0.01" 
                          name="quantity_passing_80mm" 
                          value={formData.quantity_passing_80mm} 
                          onChange={handleInputChange}
                          style={{ width: '150px' }}
                          size="sm"
                        />
                        <span className="ms-2">gm</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-3" style={{ fontWeight: 'bold', minWidth: '20px' }}>4.</span>
                        <span className="me-3">Shape of Particles:</span>
                        <Form.Select 
                          name="particle_shape" 
                          value={formData.particle_shape} 
                          onChange={handleInputChange}
                          style={{ width: '200px' }}
                          size="sm"
                        >
                          <option value="">-- Select Shape --</option>
                          <option value="Rounded">(1) Rounded</option>
                          <option value="Sub-Rounded">(2) Sub-Rounded</option>
                          <option value="Angular">(3) Angular</option>
                          <option value="Sub-Angular">(4) Sub-Angular</option>
                        </Form.Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <span className="me-3" style={{ fontWeight: 'bold', minWidth: '20px' }}>5.</span>
                        <span className="me-3">Quantity taken for test:</span>
                        <Form.Control 
                          type="number" 
                          step="0.01" 
                          name="quantity_taken_for_test" 
                          value={formData.quantity_taken_for_test} 
                          onChange={handleInputChange}
                          style={{ width: '150px' }}
                          size="sm"
                        />
                        <span className="ms-2">gm</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sieve Analysis Table */}
                <div className="table-responsive">
                  <table className="table transparent-table" style={{ fontSize: '0.9rem', marginBottom: '2rem', tableLayout: 'fixed', width: '100%', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: '150px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>IS Sieve Size (mm)</th>
                        <th style={{ width: '150px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>Weight of Soil retained (gm)</th>
                        <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>% Retained</th>
                        <th style={{ width: '100px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>% Passing</th>
                        <th style={{ width: '200px', padding: '6px', border: '1px solid #dee2e6', fontSize: '1rem', textAlign: 'center' }}>Remarks (about sample)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>80</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_80" value={formData.weight_80} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_80" value={formData.percent_retained_80} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_80" value={formData.percent_passing_80} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_80" value={formData.remarks_80} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>20</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_20" value={formData.weight_20} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_20" value={formData.percent_retained_20} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_20" value={formData.percent_passing_20} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_20" value={formData.remarks_20} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>4.75</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_475" value={formData.weight_475} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_475" value={formData.percent_retained_475} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_475" value={formData.percent_passing_475} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_475" value={formData.remarks_475} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>2.000</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_2000" value={formData.weight_2000} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_2000" value={formData.percent_retained_2000} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_2000" value={formData.percent_passing_2000} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_2000" value={formData.remarks_2000} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>0.600</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_0600" value={formData.weight_0600} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_0600" value={formData.percent_retained_0600} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_0600" value={formData.percent_passing_0600} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_0600" value={formData.remarks_0600} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>0.425</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_0425" value={formData.weight_0425} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_0425" value={formData.percent_retained_0425} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_0425" value={formData.percent_passing_0425} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_0425" value={formData.remarks_0425} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>0.075</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_0075" value={formData.weight_0075} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_0075" value={formData.percent_retained_0075} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_0075" value={formData.percent_passing_0075} readOnly style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_0075" value={formData.remarks_0075} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Percentage Summary Section */}
              <div className="mb-4">
                <h5 style={{ color: 'var(--vitrag-gold)', textDecoration: 'underline', textAlign: 'center', marginBottom: '1.5rem' }}>PERCENTAGE SUMMARY</h5>
                
                <div className="table-responsive">
                  <table className="table transparent-table" style={{ fontSize: '0.9rem', tableLayout: 'fixed', width: '100%', border: '2px solid #000', borderRadius: '0' }}>
                     <thead>
                       <tr>
                         <th colSpan="6" style={{ padding: '8px', border: '2px solid #000', fontSize: '1.1rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#343a40', color: 'white' }}>PERCENTAGE SUMMARY</th>
                       </tr>
                       <tr>
                         <th colSpan="2" style={{ padding: '8px', border: '2px solid #000', fontSize: '1rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#495057', color: 'white' }}>GRAVEL</th>
                         <th colSpan="3" style={{ padding: '8px', border: '2px solid #000', fontSize: '1rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#495057', color: 'white' }}>SAND</th>
                         <th style={{ padding: '8px', border: '2px solid #000', fontSize: '1rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#495057', color: 'white' }}>SLIT & CLAY</th>
                       </tr>
                       <tr>
                         <th style={{ padding: '8px', border: '2px solid #000', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#6c757d', color: 'white' }}>Coarse Gravel<br/>(80-20mm)</th>
                         <th style={{ padding: '8px', border: '2px solid #000', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#6c757d', color: 'white' }}>Fine Gravel<br/>(20-4.75mm)</th>
                         <th style={{ padding: '8px', border: '2px solid #000', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#6c757d', color: 'white' }}>Coarse Sand<br/>(4.75-2.00mm)</th>
                         <th style={{ padding: '8px', border: '2px solid #000', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#6c757d', color: 'white' }}>Medium Sand<br/>(2.00-0.425mm)</th>
                         <th style={{ padding: '8px', border: '2px solid #000', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#6c757d', color: 'white' }}>Fine Sand<br/>(0.425-0.075)</th>
                         <th style={{ padding: '8px', border: '2px solid #000', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#6c757d', color: 'white' }}>&lt;0.075mm</th>
                       </tr>
                     </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="coarse_gravel_percent" 
                            value={formData.coarse_gravel_percent} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="fine_gravel_percent" 
                            value={formData.fine_gravel_percent} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="coarse_sand_percent" 
                            value={formData.coarse_sand_percent} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="medium_sand_percent" 
                            value={formData.medium_sand_percent} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="fine_sand_percent" 
                            value={formData.fine_sand_percent} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="silt_clay_percent" 
                            value={formData.silt_clay_percent} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="coarse_gravel_percent_2" 
                            value={formData.coarse_gravel_percent_2} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="fine_gravel_percent_2" 
                            value={formData.fine_gravel_percent_2} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="coarse_sand_percent_2" 
                            value={formData.coarse_sand_percent_2} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="medium_sand_percent_2" 
                            value={formData.medium_sand_percent_2} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="fine_sand_percent_2" 
                            value={formData.fine_sand_percent_2} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="silt_clay_percent_2" 
                            value={formData.silt_clay_percent_2} 
                            readOnly 
                            style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #000' }} 
                          />
                        </td>
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

export default Form3GrainSizeAnalysis;
