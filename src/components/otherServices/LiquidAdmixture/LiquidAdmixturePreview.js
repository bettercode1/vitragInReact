import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faPrint } from '@fortawesome/free-solid-svg-icons';
import './LiquidAdmixturePreview.css';

const LiquidAdmixturePreview = ({ formData, onEdit, onDownloadPDF, onConfirmSave }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateAverage = () => {
    let sum = 0;
    let count = 0;
    
    for (let row = 1; row <= 3; row++) {
      const value = parseFloat(formData[`relative_density_${row}`]) || 0;
      if (value > 0) {
        sum += value;
        count++;
      }
    }
    
    return count > 0 ? (sum / count).toFixed(4) : '0.0000';
  };

  return (
    <div className="liquid-admixture-preview">
      <div className="preview-actions mb-4">
        <Button 
          variant="success" 
          onClick={onConfirmSave}
          className="me-3"
          size="lg"
        >
          <FontAwesomeIcon icon={faDownload} className="me-2" />
          Confirm & Save
        </Button>
        <Button 
          variant="primary" 
          onClick={onEdit}
          className="me-3"
        >
          <FontAwesomeIcon icon={faEdit} className="me-2" />
          Edit Form
        </Button>
        <Button 
          variant="outline-secondary" 
          onClick={() => window.print()}
        >
          <FontAwesomeIcon icon={faPrint} className="me-2" />
          Print
        </Button>
      </div>

      {/* A4 Page Container */}
      <div className="a4-page" id="liquid-admixture-report">
        {/* Header Section */}
        <div className="report-header">
          <div className="header-left">
            <div className="company-logo">
              <div className="logo-symbol">V</div>
              <div className="logo-text">VITRAG ASSOCIATES</div>
            </div>
          </div>
          <div className="header-right">
            <div className="company-name">VITRAG ASSOCIATES LLP</div>
            <div className="company-subtitle">(CONSTRUCTION MATERIAL TESTING LABORATORY)</div>
          </div>
        </div>

        {/* Main Title */}
        <div className="main-title">
          RELATIVE DENSITY OF LIQUID ADMIXTURE
        </div>

        {/* General Information Section */}
        <div className="general-info-section">
          <div className="info-row">
            <div className="info-left">
              <div className="info-item">
                <label>Sample Description:</label>
                <div className="info-value">{formData.sample_description || '________________'}</div>
              </div>
              <div className="info-item">
                <label>Date of Receipt:</label>
                <div className="info-value">{formatDate(formData.date_of_receipt) || '________________'}</div>
              </div>
              <div className="info-item">
                <label>Test Method:</label>
                <div className="info-value">IS 9103:1999</div>
              </div>
            </div>
            <div className="info-right">
              <div className="info-item">
                <label>Sample Test Code Number:</label>
                <div className="info-value">{formData.sample_test_code || '________________'}</div>
              </div>
              <div className="info-item">
                <label>Date of Testing:</label>
                <div className="info-value">{formatDate(formData.date_of_testing) || '________________'}</div>
              </div>
              <div className="info-item">
                <label>Environmental Conditions:</label>
                <div className="info-value">{formData.environmental_conditions || 'Laboratory Conditions'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Result Section */}
        <div className="test-result-section">
          <div className="section-title">TEST RESULT</div>
          <div className="test-table-container">
            <table className="test-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Colour & Texture of Admixture</th>
                  <th>Volume of Admixture taken (ml)</th>
                  <th>Temperature of Liquid (°C)</th>
                  <th>Reading on Hydrometer</th>
                  <th>Relative Density of Admixture</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((row) => (
                  <tr key={row}>
                    <td>{row}</td>
                    <td>{formData[`colour_texture_${row}`] || ''}</td>
                    <td>{formData[`volume_ml_${row}`] || (row <= 3 ? '400' : '')}</td>
                    <td>{formData[`temperature_c_${row}`] || ''}</td>
                    <td>{formData[`hydrometer_reading_${row}`] || ''}</td>
                    <td>{formData[`relative_density_${row}`] || ''}</td>
                  </tr>
                ))}
                <tr className="average-row">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="average-label">Average</td>
                  <td className="average-value">{calculateAverage()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="remarks-section">
          <div className="remarks-label">Remarks:</div>
          <div className="remarks-content">
            {formData.remarks || ''}
          </div>
        </div>

        {/* Verification Section */}
        <div className="verification-section">
          <table className="verification-table">
            <thead>
              <tr>
                <th>Tested By</th>
                <th>Checked By</th>
                <th>Verified By</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="signature-item">
                    <div className="signature-line">{formData.tested_by_name || ''}</div>
                    <div className="signature-label">Date:</div>
                    <div className="signature-line">{formatDate(formData.tested_by_date) || ''}</div>
                    <div className="signature-label">Sign:</div>
                    <div className="signature-line"></div>
                  </div>
                </td>
                <td>
                  <div className="signature-item">
                    <div className="signature-line">{formData.checked_by_name || ''}</div>
                    <div className="signature-label">Date:</div>
                    <div className="signature-line">{formatDate(formData.checked_by_date) || ''}</div>
                    <div className="signature-label">Sign:</div>
                    <div className="signature-line"></div>
                  </div>
                </td>
                <td>
                  <div className="signature-item">
                    <div className="signature-line">{formData.verified_by_name || 'Prakarsh A Sangave'}</div>
                    <div className="signature-label">Date:</div>
                    <div className="signature-line">{formatDate(formData.verified_by_date) || ''}</div>
                    <div className="signature-label">Sign:</div>
                    <div className="signature-line"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="report-footer">
          <div className="footer-content">
            Document No- VA/QF/04/05/01, Rev/Issue No- 00/00, Date - {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidAdmixturePreview;