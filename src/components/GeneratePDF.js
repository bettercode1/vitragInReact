import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button, Card, Spinner, Row, Col } from 'react-bootstrap';
import { pdf } from '@react-pdf/renderer';
import ConcreteCubeFinalTest from './ConcreteCubeFinalTest';

const GeneratePDF = () => {
  const { testRequestId } = useParams();
  const navigate = useNavigate();
  const { getTestRequestForPDF } = useData();
  const [loading, setLoading] = useState(false);

  const handleGeneratePDF = async () => {
    setLoading(true);

    try {
      // Use mock data for faster generation (no API call)
      const testData = {
        test_request: {
          id: testRequestId || '1',
          job_number: 'T-2501690',
          customer_name: 'Lords Developers',
          site_name: 'Shivyogi Residency, shelgi solapur',
          receipt_date: '25/08/2025',
          ulr_number: 'TC-1575625000001840F',
          test_type: 'CC'
        },
        customer: {
          name: 'Lords Developers',
          address: 'Shivyogi Residency, shelgi solapur'
        },
        main_test: {
          id: 1,
          sample_code_number: 'SC-2024-001',
          location_nature: 'column',
          age_in_days: 28,
          casting_date: '11/08/2025',
          testing_date: '08/09/2025',
          grade: 'M-25',
          cube_condition: 'Acceptable',
          curing_condition: '28.0',
          machine_used: 'Fully automatic Digital Compression Testing Machine',
          test_method: 'IS 516 (Part1/Sec1):2021'
        }
      };
      
      // Generate PDF using react-pdf
      const blob = await pdf(<ConcreteCubeFinalTest testData={testData} />).toBlob();
      
      // Create URL for the PDF blob
      const url = URL.createObjectURL(blob);
      
      // Open PDF in new tab
      const newWindow = window.open(url, '_blank');
      
      if (newWindow) {
        newWindow.focus();
      } else {
        alert('Popup blocked. Please allow popups for this site.');
      }
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">
                <i className="fas fa-file-pdf me-2"></i>
                Generate PDF Report
              </h4>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="mb-4">
                <p className="text-muted">
                  Test Request ID: <strong>{testRequestId || 'N/A'}</strong>
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleGeneratePDF}
                disabled={loading}
                className="mb-3"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-pdf me-2"></i>
                    Generate PDF Report
                  </>
                )}
              </Button>

              <div>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/samples')}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Samples
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeneratePDF;
