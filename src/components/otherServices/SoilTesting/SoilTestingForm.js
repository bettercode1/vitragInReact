import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSeedling, 
  faArrowLeft, 
  faSave, 
  faTimes, 
  faMagic,
  faInfoCircle,
  faTable,
  faUserCheck,
  faComment,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import SoilTestingSelection from './SoilTestingSelection';

// Inline form components - all forms consolidated into this file

// Form 1: Compaction Test Component
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
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wet_density_1" value={formData.wet_density_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wet_density_2" value={formData.wet_density_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wet_density_3" value={formData.wet_density_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wet_density_4" value={formData.wet_density_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wet_density_5" value={formData.wet_density_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>8</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Moisture Content w% = (W₂-W₃) ×100/(W₃-W₁)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_1" value={formData.moisture_content_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_2" value={formData.moisture_content_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_3" value={formData.moisture_content_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_4" value={formData.moisture_content_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_5" value={formData.moisture_content_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>9</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Dry Density γd = γm/ (1+w/100) (gm/cm³)</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="dry_density_1" value={formData.dry_density_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="dry_density_2" value={formData.dry_density_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="dry_density_3" value={formData.dry_density_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="dry_density_4" value={formData.dry_density_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="dry_density_5" value={formData.dry_density_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
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
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="max_dry_density" value={formData.max_dry_density} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>2</td>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Optimum Moisture Content</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="optimum_moisture" value={formData.optimum_moisture} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
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

// Form 2: Free Swell Index Component
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

// Form 3: Grain Size Analysis Component
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
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_80" value={formData.percent_retained_80} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_80" value={formData.percent_passing_80} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_80" value={formData.remarks_80} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>20</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_20" value={formData.weight_20} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_20" value={formData.percent_retained_20} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_20" value={formData.percent_passing_20} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_20" value={formData.remarks_20} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>4.75</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_475" value={formData.weight_475} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_475" value={formData.percent_retained_475} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_475" value={formData.percent_passing_475} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_475" value={formData.remarks_475} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>2.000</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_2000" value={formData.weight_2000} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_2000" value={formData.percent_retained_2000} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_2000" value={formData.percent_passing_2000} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_2000" value={formData.remarks_2000} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>0.600</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_0600" value={formData.weight_0600} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_0600" value={formData.percent_retained_0600} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_0600" value={formData.percent_passing_0600} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_0600" value={formData.remarks_0600} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>0.425</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_0425" value={formData.weight_0425} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_0425" value={formData.percent_retained_0425} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_0425" value={formData.percent_passing_0425} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="remarks_0425" value={formData.remarks_0425} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>0.075</td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="weight_0075" value={formData.weight_0075} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_retained_0075" value={formData.percent_retained_0075} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                        <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="percent_passing_0075" value={formData.percent_passing_0075} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
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
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="fine_gravel_percent" 
                            value={formData.fine_gravel_percent} 
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="coarse_sand_percent" 
                            value={formData.coarse_sand_percent} 
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="medium_sand_percent" 
                            value={formData.medium_sand_percent} 
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="fine_sand_percent" 
                            value={formData.fine_sand_percent} 
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="silt_clay_percent" 
                            value={formData.silt_clay_percent} 
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
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
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="fine_gravel_percent_2" 
                            value={formData.fine_gravel_percent_2} 
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="coarse_sand_percent_2" 
                            value={formData.coarse_sand_percent_2} 
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="medium_sand_percent_2" 
                            value={formData.medium_sand_percent_2} 
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="fine_sand_percent_2" 
                            value={formData.fine_sand_percent_2} 
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', border: '2px solid #000', textAlign: 'center' }}>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            step="0.01" 
                            name="silt_clay_percent_2" 
                            value={formData.silt_clay_percent_2} 
                            onChange={handleInputChange} 
                            style={{ fontSize: '0.8rem', border: '1px solid #000' }} 
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

// Form 4: Liquid Limit Component
const Form4LiquidLimit = ({ formData, handleInputChange }) => {
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
                      defaultValue="IS 2720 (PART 5)-1985"
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
              <h5 style={{ color: 'var(--vitrag-gold)', textDecoration: 'underline', textAlign: 'center', marginBottom: '1.5rem' }}>Liquid Limit Determination</h5>
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
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>No. of Blows</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="no_of_blows_1" value={formData.no_of_blows_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="no_of_blows_2" value={formData.no_of_blows_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="no_of_blows_3" value={formData.no_of_blows_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="no_of_blows_4" value={formData.no_of_blows_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="no_of_blows_5" value={formData.no_of_blows_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>2</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Container No.</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="container_no_1" value={formData.container_no_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="container_no_2" value={formData.container_no_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="container_no_3" value={formData.container_no_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="container_no_4" value={formData.container_no_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="text" name="container_no_5" value={formData.container_no_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>3</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wt. of Container (W1) gm</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_1" value={formData.wt_container_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_2" value={formData.wt_container_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_3" value={formData.wt_container_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_4" value={formData.wt_container_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_5" value={formData.wt_container_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>4</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wt. of Container + Wet Soil (W2) gm</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_wet_soil_1" value={formData.wt_container_wet_soil_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_wet_soil_2" value={formData.wt_container_wet_soil_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_wet_soil_3" value={formData.wt_container_wet_soil_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_wet_soil_4" value={formData.wt_container_wet_soil_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_wet_soil_5" value={formData.wt_container_wet_soil_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>5</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wt. of Container + Dry Soil (W3) gm</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_dry_soil_1" value={formData.wt_container_dry_soil_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_dry_soil_2" value={formData.wt_container_dry_soil_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_dry_soil_3" value={formData.wt_container_dry_soil_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_dry_soil_4" value={formData.wt_container_dry_soil_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_container_dry_soil_5" value={formData.wt_container_dry_soil_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>6</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wt. of Water (W2-W3) gm</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_water_1" value={formData.wt_water_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_water_2" value={formData.wt_water_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_water_3" value={formData.wt_water_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_water_4" value={formData.wt_water_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_water_5" value={formData.wt_water_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>7</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Wt. of Dry Soil (W3-W1) gm</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_dry_soil_1" value={formData.wt_dry_soil_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_dry_soil_2" value={formData.wt_dry_soil_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_dry_soil_3" value={formData.wt_dry_soil_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_dry_soil_4" value={formData.wt_dry_soil_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="wt_dry_soil_5" value={formData.wt_dry_soil_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', textAlign: 'center' }}>8</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>Moisture Content (%) = (W2-W3)/(W3-W1) × 100</td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_1" value={formData.moisture_content_1} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_2" value={formData.moisture_content_2} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_3" value={formData.moisture_content_3} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_4" value={formData.moisture_content_4} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                      <td style={{ padding: '4px', border: '1px solid #dee2e6' }}><Form.Control size="sm" type="number" step="0.01" name="moisture_content_5" value={formData.moisture_content_5} onChange={handleInputChange} style={{ fontSize: '0.8rem' }} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Final Result */}
              <div className="text-center" style={{ marginTop: '2rem' }}>
                <h5 style={{ color: 'var(--vitrag-gold)', marginBottom: '1rem' }}>
                  <strong>LIQUID LIMIT (LL) = MOISTURE CONTENT AT 25 BLOWS = </strong>
                  <Form.Control 
                    type="number" 
                    step="0.01" 
                    name="liquid_limit" 
                    value={formData.liquid_limit} 
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

// Form 5: Plastic Limit Component
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

// Form 6: Water Content Component
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

const SoilTestingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPreview, setShowPreview] = useState(false);
  const [currentTest, setCurrentTest] = useState(1);
  const [selectedTests, setSelectedTests] = useState([]);
  const [showSelectionPopup, setShowSelectionPopup] = useState(false);

  // Show popup on first load
  useEffect(() => {
    // Show popup on first load if no tests are selected
    if (selectedTests.length === 0) {
      setShowSelectionPopup(true);
    }
  }, []);

  // Handle selected tests from popup
  useEffect(() => {
    if (location.state && location.state.selectedTests) {
      setSelectedTests(location.state.selectedTests);
      // Set current test to first available test
      if (location.state.selectedTests.includes('compactionTest')) {
        setCurrentTest(1);
      } else if (location.state.selectedTests.includes('freeSwellIndex')) {
        setCurrentTest(2);
      } else if (location.state.selectedTests.includes('grainSizeAnalysis')) {
        setCurrentTest(3);
      } else if (location.state.selectedTests.includes('liquidLimit')) {
        setCurrentTest(4);
      } else if (location.state.selectedTests.includes('plasticLimit')) {
        setCurrentTest(5);
      } else if (location.state.selectedTests.includes('waterContent')) {
        setCurrentTest(6);
      }
    }
  }, [location.state]);

  // Handle test method changes when switching between forms
  useEffect(() => {
    if (currentTest === 1 && selectedTests.includes('compactionTest')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS 2720 (PART 7-1980)\nIS 2720 (PART 8-1983)'
      }));
    } else if (currentTest === 2 && selectedTests.includes('freeSwellIndex')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS2720 (PART-40)-1977'
      }));
    } else if (currentTest === 3 && selectedTests.includes('grainSizeAnalysis')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS 2720 (PART 4)-1985'
      }));
    } else if (currentTest === 4 && selectedTests.includes('liquidLimit')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS 2720 (PART 5)-1985'
      }));
    } else if (currentTest === 5 && selectedTests.includes('plasticLimit')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS 2720 (PART-5)-1985'
      }));
    } else if (currentTest === 6 && selectedTests.includes('waterContent')) {
      setFormData(prev => ({
        ...prev,
        test_method: 'IS 2720 (PART 2)-1973'
      }));
    }
  }, [currentTest, selectedTests]);

  const [formData, setFormData] = useState({
    // General Information
    customer_id: '',
    sample_test_code: '',
    date_of_receipt: '',
    quantity: '',
    sample_condition: '',
    sample_description: '',
    date_of_testing: new Date().toISOString().split('T')[0],
    test_method: 'IS 2720 (PART-5)-1985',
    soil_type: '',
    soil_classification: '',
    environmental_conditions: 'Laboratory Conditions, Temperature: 27±2°C, RH: 65±5%',
    
    // Test Report Details
    customer_site_address: '',
    date_of_report: '',
    reference_number: '',
    date_of_material_receipt: '',
    type_grade_soil: '',
    url_number: '',
    job_code_number: '',
    period_of_testing: '',
    condition_of_sample: '',
    location_of_testing: '',
    
    // Form 1 - Compaction Test Data
    weight_mould_1: '', weight_mould_2: '', weight_mould_3: '', weight_mould_4: '', weight_mould_5: '',
    weight_mould_soil_1: '', weight_mould_soil_2: '', weight_mould_soil_3: '', weight_mould_soil_4: '', weight_mould_soil_5: '',
    container_no_1: '', container_no_2: '', container_no_3: '', container_no_4: '', container_no_5: '',
    weight_container_1: '', weight_container_2: '', weight_container_3: '', weight_container_4: '', weight_container_5: '',
    weight_wet_soil_1: '', weight_wet_soil_2: '', weight_wet_soil_3: '', weight_wet_soil_4: '', weight_wet_soil_5: '',
    weight_dry_soil_1: '', weight_dry_soil_2: '', weight_dry_soil_3: '', weight_dry_soil_4: '', weight_dry_soil_5: '',
    wet_density_1: '', wet_density_2: '', wet_density_3: '', wet_density_4: '', wet_density_5: '',
    moisture_content_1: '', moisture_content_2: '', moisture_content_3: '', moisture_content_4: '', moisture_content_5: '',
    dry_density_1: '', dry_density_2: '', dry_density_3: '', dry_density_4: '', dry_density_5: '',
    volume_mould: '', weight_rammer: '', sieve_size_passing: '', percentage_passing: '', sieve_size_retained: '', percentage_retained: '',
    max_dry_density: '', optimum_moisture: '', compaction_type: '',
    
    // Form 2 - Free Swell Index Data
    volume_water_1: '', volume_water_2: '', volume_water_3: '',
    volume_kerosene_1: '', volume_kerosene_2: '', volume_kerosene_3: '',
    free_swell_index_1: '', free_swell_index_2: '', free_swell_index_3: '',
    final_free_swell_index: '',
    
    // Form 3 - Grain Size Analysis Data
    total_oven_dried_weight: '', quantity_retained_80mm: '', quantity_passing_80mm: '', particle_shape: '', quantity_taken_for_test: '',
    weight_80: '', weight_20: '', weight_475: '', weight_2000: '', weight_0600: '', weight_0425: '', weight_0075: '',
    percent_retained_80: '', percent_retained_20: '', percent_retained_475: '', percent_retained_2000: '', percent_retained_0600: '', percent_retained_0425: '', percent_retained_0075: '',
    percent_passing_80: '', percent_passing_20: '', percent_passing_475: '', percent_passing_2000: '', percent_passing_0600: '', percent_passing_0425: '', percent_passing_0075: '',
    remarks_80: '', remarks_20: '', remarks_475: '', remarks_2000: '', remarks_0600: '', remarks_0425: '', remarks_0075: '',
    coarse_gravel_percent: '', fine_gravel_percent: '', coarse_sand_percent: '', medium_sand_percent: '', fine_sand_percent: '', silt_clay_percent: '',
    coarse_gravel_percent_2: '', fine_gravel_percent_2: '', coarse_sand_percent_2: '', medium_sand_percent_2: '', fine_sand_percent_2: '', silt_clay_percent_2: '',
    
    // Form 4 - Liquid Limit Data
    no_of_blows_1: '', no_of_blows_2: '', no_of_blows_3: '', no_of_blows_4: '', no_of_blows_5: '',
    container_no_1: '', container_no_2: '', container_no_3: '', container_no_4: '', container_no_5: '',
    wt_container_1: '', wt_container_2: '', wt_container_3: '', wt_container_4: '', wt_container_5: '',
    wt_container_wet_soil_1: '', wt_container_wet_soil_2: '', wt_container_wet_soil_3: '', wt_container_wet_soil_4: '', wt_container_wet_soil_5: '',
    wt_container_dry_soil_1: '', wt_container_dry_soil_2: '', wt_container_dry_soil_3: '', wt_container_dry_soil_4: '', wt_container_dry_soil_5: '',
    wt_water_1: '', wt_water_2: '', wt_water_3: '', wt_water_4: '', wt_water_5: '',
    wt_dry_soil_1: '', wt_dry_soil_2: '', wt_dry_soil_3: '', wt_dry_soil_4: '', wt_dry_soil_5: '',
    moisture_content_1: '', moisture_content_2: '', moisture_content_3: '', moisture_content_4: '', moisture_content_5: '',
    liquid_limit: '',
    
    // Form 5 - Plastic Limit Data
    plastic_container_no_1: '', plastic_container_no_2: '', plastic_container_no_3: '', plastic_container_no_4: '', plastic_container_no_5: '',
    plastic_wt_container_1: '', plastic_wt_container_2: '', plastic_wt_container_3: '', plastic_wt_container_4: '', plastic_wt_container_5: '',
    plastic_wt_container_wet_soil_1: '', plastic_wt_container_wet_soil_2: '', plastic_wt_container_wet_soil_3: '', plastic_wt_container_wet_soil_4: '', plastic_wt_container_wet_soil_5: '',
    plastic_wt_container_dry_soil_1: '', plastic_wt_container_dry_soil_2: '', plastic_wt_container_dry_soil_3: '', plastic_wt_container_dry_soil_4: '', plastic_wt_container_dry_soil_5: '',
    plastic_wt_water_1: '', plastic_wt_water_2: '', plastic_wt_water_3: '', plastic_wt_water_4: '', plastic_wt_water_5: '',
    plastic_wt_dry_soil_1: '', plastic_wt_dry_soil_2: '', plastic_wt_dry_soil_3: '', plastic_wt_dry_soil_4: '', plastic_wt_dry_soil_5: '',
    plastic_moisture_content_1: '', plastic_moisture_content_2: '', plastic_moisture_content_3: '', plastic_moisture_content_4: '', plastic_moisture_content_5: '',
    plastic_limit: '', plastic_index: '',
    
    // Form 6 - Water Content Data
    water_container_no: '',
    water_mass_container: '',
    water_mass_container_wet_soil: '',
    water_mass_container_dry_soil: '',
    water_mass_moisture: '',
    water_mass_dry_soil: '',
    water_content_percentage: '',
    
    // Verification
    tested_by_name: '',
    tested_by_date: new Date().toISOString().split('T')[0],
    checked_by_name: '',
    checked_by_date: new Date().toISOString().split('T')[0],
    verified_by_name: 'Prakarsh A Sangave',
    verified_by_date: new Date().toISOString().split('T')[0],
    reviewed_by: 'Lalita S. Dussa - Quality Manager',
    authorized_by: 'Prakarsh Sangave',
    remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle popup selection
  const handleSelectionProceed = (selectedTests) => {
    setSelectedTests(selectedTests);
    setShowSelectionPopup(false);
    
    // Create mapping from test keys to form numbers
    const testToFormNumber = {
      'compactionTest': 1,
      'freeSwellIndex': 2,
      'grainSizeAnalysis': 3,
      'liquidLimit': 4,
      'plasticLimit': 5,
      'waterContent': 6
    };
    
    // Set current test to first selected test
    const firstSelectedTest = selectedTests[0];
    const firstTestNumber = testToFormNumber[firstSelectedTest];
    setCurrentTest(firstTestNumber);
  };

  const handleSelectionHide = () => {
    // If no tests are selected, redirect back to other services
    if (selectedTests.length === 0) {
      navigate('/other-services');
    } else {
      setShowSelectionPopup(false);
    }
  };

  const testTitles = {
    1: 'Determination of Compaction Test (Light/Heavy)',
    2: 'Determination of Free Swell Index',
    3: 'Determination of Grain Size Analysis',
    4: 'Determination of Liquid Limit',
    5: 'Determination of Plastic Limit',
    6: 'Determination of Water Content (Oven-Drying Method)'
  };


  const renderVerification = () => (
    <Row className="mb-4">
      <Col>
        <Card className="card-vitrag">
          <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
            <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faUserCheck} className="me-2" />Verification</h4>
          </Card.Header>
          <Card.Body className="transparent-input-section">
              <Row>
              <Col md={4}>
                <h6>Tested By</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control type="text" name="tested_by_name" value={formData.tested_by_name} onChange={handleInputChange} className="form-control-vitrag" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control type="date" name="tested_by_date" value={formData.tested_by_date} onChange={handleInputChange} className="form-control-vitrag" required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <h6>Checked By</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control type="text" name="checked_by_name" value={formData.checked_by_name} onChange={handleInputChange} className="form-control-vitrag" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control type="date" name="checked_by_date" value={formData.checked_by_date} onChange={handleInputChange} className="form-control-vitrag" required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <h6>Verified By</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="verified_by_name" value={formData.verified_by_name} readOnly className="form-control-vitrag" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: '#495057', opacity: 0.9 }} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control type="date" name="verified_by_date" value={formData.verified_by_date} onChange={handleInputChange} className="form-control-vitrag" required />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderRemarks = () => (
    <Row className="mb-4">
      <Col>
        <Card className="card-vitrag">
          <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
            <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faComment} className="me-2" />Remarks</h4>
          </Card.Header>
          <Card.Body className="transparent-input-section">
            <Form.Control as="textarea" rows={4} name="remarks" value={formData.remarks} onChange={handleInputChange} className="form-control-vitrag" placeholder="" />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderReviewedBy = () => (
    <Row className="mb-4">
      <Col md={6}>
        <Card className="card-vitrag">
          <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
            <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faUserCheck} className="me-2" />Reviewed By</h4>
          </Card.Header>
          <Card.Body className="transparent-input-section">
            <Form.Group className="mb-3">
              <Form.Label>Select Reviewer:</Form.Label>
              <Form.Select name="reviewed_by" value={formData.reviewed_by} onChange={handleInputChange} className="form-control-vitrag" required>
                <option value="">-- Select a reviewer --</option>
                <option value="Lalita S. Dussa - Quality Manager" selected>Lalita S. Dussa - Quality Manager</option>
                <option value="Prakarsha A. Sangave - Quality Manager">Prakarsha A. Sangave - Quality Manager</option>
                <option value="Harsha Prakarsha Sangave - Quality Manager">Harsha Prakarsha Sangave - Quality Manager</option>
                <option value="Amol A Adam - Quality Manager">Amol A Adam - Quality Manager</option>
                <option value="Aaquib J. Shaikh - Quality Manager">Aaquib J. Shaikh - Quality Manager</option>
              </Form.Select>
            </Form.Group>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="card-vitrag">
          <Card.Header style={{ backgroundColor: 'var(--vitrag-secondary)' }}>
            <h4 style={{ color: 'var(--vitrag-gold)', margin: 0 }}><FontAwesomeIcon icon={faUserCheck} className="me-2" />Authorized By</h4>
          </Card.Header>
          <Card.Body className="transparent-input-section">
            <Form.Group className="mb-3">
              <Form.Label>Authorized By:</Form.Label>
              <Form.Control type="text" name="authorized_by" value={formData.authorized_by} readOnly className="form-control-vitrag" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: '#495057', opacity: 0.9 }} />
            </Form.Group>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const fillRandomData = () => {
    if (window.confirm('This will fill all fields with sample data. Continue?')) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const randomData = {
        // General Information
        customer_id: '1',
        sample_test_code: 'ST-2024-001',
        date_of_receipt: today.toISOString().split('T')[0],
        quantity: '5 kg',
        sample_condition: 'Good',
        sample_description: 'Soil sample for compaction test - Clayey soil with moderate plasticity',
        date_of_testing: today.toISOString().split('T')[0],
        test_method: currentTest === 2 ? 'IS2720 (PART-40)-1977' : currentTest === 3 ? 'IS 2720 (PART 4)-1985' : currentTest === 4 ? 'IS 2720 (PART 5)-1985' : currentTest === 5 ? 'IS 2720 (PART-5)-1985' : currentTest === 6 ? 'IS 2720 (PART 2)-1973' : 'IS 2720 (PART 7-1980)\nIS 2720 (PART 8-1983)',
        soil_type: 'Clayey Soil',
        soil_classification: 'CH (Clay of High plasticity)',
        
        // Test Report Details
        customer_site_address: 'Sample Construction Site, Mumbai',
        date_of_report: today.toISOString().split('T')[0],
        reference_number: 'REF-2024-001',
        date_of_material_receipt: today.toISOString().split('T')[0],
        type_grade_soil: 'Clayey Soil',
        url_number: 'URL-2024-001',
        job_code_number: 'JOB-2024-001',
        period_of_testing: '1 day',
        condition_of_sample: 'Acceptable',
        location_of_testing: 'Laboratory',
        
        // Form 1 - Compaction Test Data
        weight_mould_1: '4500.00', weight_mould_2: '4500.00', weight_mould_3: '4500.00', weight_mould_4: '4500.00', weight_mould_5: '4500.00',
        weight_mould_soil_1: '6200.00', weight_mould_soil_2: '6350.00', weight_mould_soil_3: '6480.00', weight_mould_soil_4: '6520.00', weight_mould_soil_5: '6400.00',
        container_no_1: 'C-001', container_no_2: 'C-002', container_no_3: 'C-003', container_no_4: 'C-004', container_no_5: 'C-005',
        weight_container_1: '25.50', weight_container_2: '26.20', weight_container_3: '24.80', weight_container_4: '25.90', weight_container_5: '26.10',
        weight_wet_soil_1: '180.50', weight_wet_soil_2: '175.20', weight_wet_soil_3: '182.80', weight_wet_soil_4: '178.90', weight_wet_soil_5: '179.10',
        weight_dry_soil_1: '165.20', weight_dry_soil_2: '158.40', weight_dry_soil_3: '162.60', weight_dry_soil_4: '159.80', weight_dry_soil_5: '160.20',
        wet_density_1: '1.700', wet_density_2: '1.850', wet_density_3: '1.980', wet_density_4: '2.020', wet_density_5: '1.900',
        moisture_content_1: '9.27', moisture_content_2: '10.61', moisture_content_3: '12.41', moisture_content_4: '11.95', moisture_content_5: '11.79',
        dry_density_1: '1.556', dry_density_2: '1.673', dry_density_3: '1.762', dry_density_4: '1.805', dry_density_5: '1.700',
        volume_mould: '1000.00',
        weight_rammer: '2.60',
        sieve_size_passing: '4.75',
        percentage_passing: '95.5',
        sieve_size_retained: '4.75',
        percentage_retained: '4.5',
        max_dry_density: '1.805',
        optimum_moisture: '11.95',
        compaction_type: 'Standard Proctor',
        
        // Verification
        tested_by_name: 'John Doe',
        tested_by_date: today.toISOString().split('T')[0],
        checked_by_name: 'Jane Smith',
        checked_by_date: today.toISOString().split('T')[0],
        remarks: 'Sample data filled for testing purposes. All measurements are approximate and should be replaced with actual test data.'
      };
      
      setFormData(prev => ({ ...prev, ...randomData }));
      
      alert('Random data filled successfully! Please review and modify as needed before submitting.');
    }
  };

  const handleSaveAndNext = () => {
    // Create mapping from test keys to form numbers
    const testToFormNumber = {
      'compactionTest': 1,
      'freeSwellIndex': 2,
      'grainSizeAnalysis': 3,
      'liquidLimit': 4,
      'plasticLimit': 5,
      'waterContent': 6
    };
    
    // Create mapping from form numbers to test keys
    const formNumberToTest = {
      1: 'compactionTest',
      2: 'freeSwellIndex',
      3: 'grainSizeAnalysis',
      4: 'liquidLimit',
      5: 'plasticLimit',
      6: 'waterContent'
    };
    
    // Find the current test key
    const currentTestKey = formNumberToTest[currentTest];
    
    // Find the index of current test in selected tests
    const currentIndex = selectedTests.indexOf(currentTestKey);
    
    // If this is the last selected test, generate the report
    if (currentIndex === selectedTests.length - 1) {
      handleFinalSave();
    } else {
      // Get the next selected test
      const nextTestKey = selectedTests[currentIndex + 1];
      const nextTestNumber = testToFormNumber[nextTestKey];
      setCurrentTest(nextTestNumber);
    }
  };

  const handleFinalSave = () => {
    // Create URL parameters from all form data
    const params = new URLSearchParams();
    
    // General Information
    params.append('sample_description', formData.sample_description || '');
    params.append('date_of_receipt', formData.date_of_receipt || '');
    params.append('sample_test_code', formData.sample_test_code || '');
    params.append('date_of_testing', formData.date_of_testing || '');
    params.append('environmental_conditions', formData.environmental_conditions || '');
    params.append('test_method', formData.test_method || '');
    params.append('soil_type', formData.soil_type || '');
    
    // Form 1: Compaction Test Data
    for (let i = 1; i <= 5; i++) {
      params.append(`weight_mould_${i}`, formData[`weight_mould_${i}`] || '');
      params.append(`weight_mould_soil_${i}`, formData[`weight_mould_soil_${i}`] || '');
      params.append(`container_no_${i}`, formData[`container_no_${i}`] || '');
      params.append(`weight_container_${i}`, formData[`weight_container_${i}`] || '');
      params.append(`weight_wet_soil_${i}`, formData[`weight_wet_soil_${i}`] || '');
      params.append(`weight_dry_soil_${i}`, formData[`weight_dry_soil_${i}`] || '');
      params.append(`wet_density_${i}`, formData[`wet_density_${i}`] || '');
      params.append(`moisture_content_${i}`, formData[`moisture_content_${i}`] || '');
      params.append(`dry_density_${i}`, formData[`dry_density_${i}`] || '');
    }
    params.append('volume_mould', formData.volume_mould || '');
    params.append('weight_rammer', formData.weight_rammer || '');
    params.append('sieve_size_passing', formData.sieve_size_passing || '');
    params.append('percentage_passing', formData.percentage_passing || '');
    params.append('sieve_size_retained', formData.sieve_size_retained || '');
    params.append('percentage_retained', formData.percentage_retained || '');
    params.append('max_dry_density', formData.max_dry_density || '');
    params.append('optimum_moisture', formData.optimum_moisture || '');
    params.append('compaction_type', formData.compaction_type || '');
    
    // Form 2: Free Swell Index Data
    for (let i = 1; i <= 3; i++) {
      params.append(`volume_water_${i}`, formData[`volume_water_${i}`] || '');
      params.append(`volume_kerosene_${i}`, formData[`volume_kerosene_${i}`] || '');
      params.append(`free_swell_index_${i}`, formData[`free_swell_index_${i}`] || '');
    }
    params.append('final_free_swell_index', formData.final_free_swell_index || '');
    
    // Form 3: Grain Size Analysis Data
    params.append('total_oven_dried_weight', formData.total_oven_dried_weight || '');
    params.append('quantity_retained_80mm', formData.quantity_retained_80mm || '');
    params.append('quantity_passing_80mm', formData.quantity_passing_80mm || '');
    params.append('particle_shape', formData.particle_shape || '');
    params.append('quantity_taken_for_test', formData.quantity_taken_for_test || '');
    
    const sieveSizes = ['80', '20', '475', '2000', '0600', '0425', '0075'];
    sieveSizes.forEach(size => {
      params.append(`weight_${size}`, formData[`weight_${size}`] || '');
      params.append(`percent_retained_${size}`, formData[`percent_retained_${size}`] || '');
      params.append(`percent_passing_${size}`, formData[`percent_passing_${size}`] || '');
      params.append(`remarks_${size}`, formData[`remarks_${size}`] || '');
    });
    
    params.append('coarse_gravel_percent', formData.coarse_gravel_percent || '');
    params.append('fine_gravel_percent', formData.fine_gravel_percent || '');
    params.append('coarse_sand_percent', formData.coarse_sand_percent || '');
    params.append('medium_sand_percent', formData.medium_sand_percent || '');
    params.append('fine_sand_percent', formData.fine_sand_percent || '');
    params.append('silt_clay_percent', formData.silt_clay_percent || '');
    params.append('coarse_gravel_percent_2', formData.coarse_gravel_percent_2 || '');
    params.append('fine_gravel_percent_2', formData.fine_gravel_percent_2 || '');
    params.append('coarse_sand_percent_2', formData.coarse_sand_percent_2 || '');
    params.append('medium_sand_percent_2', formData.medium_sand_percent_2 || '');
    params.append('fine_sand_percent_2', formData.fine_sand_percent_2 || '');
    params.append('silt_clay_percent_2', formData.silt_clay_percent_2 || '');
    
    // Form 4: Liquid Limit Data
    for (let i = 1; i <= 5; i++) {
      params.append(`no_of_blows_${i}`, formData[`no_of_blows_${i}`] || '');
      params.append(`wt_container_${i}`, formData[`wt_container_${i}`] || '');
      params.append(`wt_container_wet_soil_${i}`, formData[`wt_container_wet_soil_${i}`] || '');
      params.append(`wt_container_dry_soil_${i}`, formData[`wt_container_dry_soil_${i}`] || '');
      params.append(`wt_water_${i}`, formData[`wt_water_${i}`] || '');
      params.append(`wt_dry_soil_${i}`, formData[`wt_dry_soil_${i}`] || '');
      params.append(`moisture_content_${i}`, formData[`moisture_content_${i}`] || '');
    }
    params.append('liquid_limit', formData.liquid_limit || '');
    
    // Form 5: Plastic Limit Data
    for (let i = 1; i <= 5; i++) {
      params.append(`plastic_container_no_${i}`, formData[`plastic_container_no_${i}`] || '');
      params.append(`plastic_wt_container_${i}`, formData[`plastic_wt_container_${i}`] || '');
      params.append(`plastic_wt_container_wet_soil_${i}`, formData[`plastic_wt_container_wet_soil_${i}`] || '');
      params.append(`plastic_wt_container_dry_soil_${i}`, formData[`plastic_wt_container_dry_soil_${i}`] || '');
      params.append(`plastic_wt_water_${i}`, formData[`plastic_wt_water_${i}`] || '');
      params.append(`plastic_wt_dry_soil_${i}`, formData[`plastic_wt_dry_soil_${i}`] || '');
      params.append(`plastic_moisture_content_${i}`, formData[`plastic_moisture_content_${i}`] || '');
    }
    params.append('plastic_limit', formData.plastic_limit || '');
    params.append('plastic_index', formData.plastic_index || '');
    
    // Form 6: Water Content Data
    params.append('water_container_no', formData.water_container_no || '');
    params.append('water_mass_container', formData.water_mass_container || '');
    params.append('water_mass_container_wet_soil', formData.water_mass_container_wet_soil || '');
    params.append('water_mass_container_dry_soil', formData.water_mass_container_dry_soil || '');
    params.append('water_mass_moisture', formData.water_mass_moisture || '');
    params.append('water_mass_dry_soil', formData.water_mass_dry_soil || '');
    params.append('water_content_percentage', formData.water_content_percentage || '');
    
    // Verification
    params.append('tested_by_name', formData.tested_by_name || '');
    params.append('tested_by_date', formData.tested_by_date || '');
    params.append('checked_by_name', formData.checked_by_name || '');
    params.append('checked_by_date', formData.checked_by_date || '');
    params.append('verified_by_name', formData.verified_by_name || '');
    params.append('verified_by_date', formData.verified_by_date || '');
    
    // Remarks
    params.append('remarks', formData.remarks || '');
    
    // Customer Information
    const customerNames = {
      '1': 'Sample Customer 1',
      '2': 'Sample Customer 2'
    };
    params.append('customer_name', customerNames[formData.customer_id] || formData.customer_id || '');
    params.append('site_address', formData.customer_site_address || '');
    params.append('ulr_number', formData.url_number || '');
    params.append('job_code_number', formData.job_code_number || '');
    params.append('reference_number', formData.reference_number || '');
    params.append('date_of_report', new Date().toISOString().split('T')[0]);
    params.append('date_of_material_receipt', formData.date_of_receipt || '');
    params.append('material_description', formData.sample_description || '');
    params.append('condition_of_sample', formData.condition_of_sample || 'Acceptable');
    params.append('location_of_testing', formData.location_of_testing || 'Laboratory');
    
    // Test Results Summary (for Test Report)
    params.append('max_dry_density_result', formData.max_dry_density || '0.000');
    params.append('optimum_moisture_result', formData.optimum_moisture || '0.00');
    
    // Authorization (for Test Report)
    params.append('reviewed_by', formData.reviewed_by || 'Lalita S. Dussa - Quality Manager');
    params.append('authorized_by', formData.authorized_by || 'Prakarsh Sangave');
    
           // Add selected tests to parameters
           params.append('selectedTests', JSON.stringify(selectedTests));

           // Build the final report URL
           const reportUrl = `/SoilTesting/SoilTestingReport.html?${params.toString()}`;

           // Open the final combined report in a new tab
    window.open(reportUrl, '_blank');
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div>
      {/* Header Container Box */}
      <div style={{ backgroundColor: 'var(--vitrag-brown)', padding: '2rem 0', borderRadius: '15px' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faSeedling} className="me-3" style={{ fontSize: '2rem', color: 'white' }} />
                <div>
                  <h1 style={{ color: 'white', fontWeight: '700', margin: 0 }}>
                    Soil Testing - {currentTest}
                  </h1>
                  <p className="mb-0 mt-2" style={{ color: 'white' }}>
                    {testTitles[currentTest]}
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="light" className="btn-vitrag-primary" onClick={() => navigate('/other-services')}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to Other Services
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Form onSubmit={handleSubmit}>
          {/* Form Navigation */}
          <Row className="mb-2">
            <Col>
              <Card style={{ border: 'none' }}>
                <Card.Body className="py-2">
                  <div className="d-flex justify-content-center">
                    {selectedTests.includes('compactionTest') && (
                      <Button
                        variant={currentTest === 1 ? "primary" : "outline-primary"}
                        size="lg"
                        className="mx-2"
                        style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => setCurrentTest(1)}
                      >
                        1
                      </Button>
                    )}
                    {selectedTests.includes('freeSwellIndex') && (
                      <Button
                        variant={currentTest === 2 ? "primary" : "outline-primary"}
                        size="lg"
                        className="mx-2"
                        style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => setCurrentTest(2)}
                      >
                        2
                      </Button>
                    )}
                    {selectedTests.includes('grainSizeAnalysis') && (
                      <Button
                        variant={currentTest === 3 ? "primary" : "outline-primary"}
                        size="lg"
                        className="mx-2"
                        style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => setCurrentTest(3)}
                      >
                        3
                      </Button>
                    )}
                    {selectedTests.includes('liquidLimit') && (
                      <Button
                        variant={currentTest === 4 ? "primary" : "outline-primary"}
                        size="lg"
                        className="mx-2"
                        style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => setCurrentTest(4)}
                      >
                        4
                      </Button>
                    )}
                    {selectedTests.includes('plasticLimit') && (
                      <Button
                        variant={currentTest === 5 ? "primary" : "outline-primary"}
                        size="lg"
                        className="mx-2"
                        style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => setCurrentTest(5)}
                      >
                        5
                      </Button>
                    )}
                    {selectedTests.includes('waterContent') && (
                      <Button
                        variant={currentTest === 6 ? "primary" : "outline-primary"}
                        size="lg"
                        className="mx-2"
                        style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => setCurrentTest(6)}
                      >
                        6
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Render current form */}
          {selectedTests.length === 0 ? (
            <Row className="mb-4">
              <Col>
                <Alert variant="warning" className="text-center">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  No tests selected. Please go back and select at least one test to perform.
                </Alert>
              </Col>
            </Row>
          ) : (
            <>
              {currentTest === 1 && selectedTests.includes('compactionTest') && <Form1CompactionTest formData={formData} handleInputChange={handleInputChange} />}
              {currentTest === 2 && selectedTests.includes('freeSwellIndex') && <Form2FreeSwellIndex formData={formData} handleInputChange={handleInputChange} />}
              {currentTest === 3 && selectedTests.includes('grainSizeAnalysis') && <Form3GrainSizeAnalysis formData={formData} handleInputChange={handleInputChange} />}
              {currentTest === 4 && selectedTests.includes('liquidLimit') && <Form4LiquidLimit formData={formData} handleInputChange={handleInputChange} />}
              {currentTest === 5 && selectedTests.includes('plasticLimit') && <Form5PlasticLimit formData={formData} handleInputChange={handleInputChange} />}
              {currentTest === 6 && selectedTests.includes('waterContent') && <Form6WaterContent formData={formData} handleInputChange={handleInputChange} />}
            </>
          )}

          {/* Verification, Remarks, and Reviewed By */}
          {renderVerification()}
          {renderRemarks()}
          {renderReviewedBy()}

          {/* Submit Buttons */}
          <Row>
            <Col className="text-center">
              <div className="d-grid gap-2 d-md-block">
                <Button variant="secondary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={() => navigate('/other-services')}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="info" 
                  size="lg" 
                  className="me-3"
                  onClick={fillRandomData}
                >
                  <FontAwesomeIcon icon={faMagic} className="me-2" />
                  Fill Random Data
                </Button>
                <Button variant="primary" className="btn-lg me-md-2 btn-vitrag-primary" onClick={handleSaveAndNext}>
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                  {(() => {
                    // Create mapping from form numbers to test keys
                    const formNumberToTest = {
                      1: 'compactionTest',
                      2: 'freeSwellIndex',
                      3: 'grainSizeAnalysis',
                      4: 'liquidLimit',
                      5: 'plasticLimit',
                      6: 'waterContent'
                    };
                    
                    // Find the current test key
                    const currentTestKey = formNumberToTest[currentTest];
                    
                    // Find the index of current test in selected tests
                    const currentIndex = selectedTests.indexOf(currentTestKey);
                    
                    // If this is the last selected test, show "Save and Generate Report"
                    return currentIndex === selectedTests.length - 1 ? 'Save and Generate Report' : 'Save and Next';
                  })()}
                  </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>

      {/* Soil Testing Selection Popup */}
      <SoilTestingSelection
        show={showSelectionPopup}
        onHide={handleSelectionHide}
        onProceed={handleSelectionProceed}
      />
    </div>
  );
};

export default SoilTestingForm;
