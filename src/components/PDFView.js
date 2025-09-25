import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPrint,
  faDownload
} from '@fortawesome/free-solid-svg-icons';

const PDFView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get test data from location state or use sample data
  const testData = location.state?.testData || {
    id: 1,
    jobNumber: 'T-2501690',
    customerName: 'Lords Developers Shivyogi Residency',
    siteName: 'shivyogi residency',
    receiptDate: '25-08-2025',
    status: 'completed',
    cubeTests: [{
      id: 1,
      idMark: 'C1',
      locationNature: 'Column - Ground Floor',
      grade: 'M25',
      castingDate: '11-08-2025',
      testingDate: '08-09-2025',
      ageInDays: 28,
      quantity: 3,
      testMethod: 'IS 516 (Part1/Sec1):2021',
      sampleCodeNumber: 'SC-2024-001',
      ulrNumber: 'ULR-2024-001',
      machineUsed: 'CTM (2000KN)',
      cubeCondition: 'Acceptable',
      curingCondition: 'Water Curing',
      testResults: [
        {
          srNo: 1,
          idMark: 'C1',
          dimensionLength: 150,
          dimensionWidth: 150,
          dimensionHeight: 150,
          area: 22500,
          weight: 8.5,
          crushingLoad: 562.5,
          density: 2400,
          compressiveStrength: 25.0
        },
        {
          srNo: 2,
          idMark: 'C2',
          dimensionLength: 150,
          dimensionWidth: 150,
          dimensionHeight: 150,
          area: 22500,
          weight: 8.4,
          crushingLoad: 555.0,
          density: 2373,
          compressiveStrength: 24.7
        },
        {
          srNo: 3,
          idMark: 'C3',
          dimensionLength: 150,
          dimensionWidth: 150,
          dimensionHeight: 150,
          area: 22500,
          weight: 8.6,
          crushingLoad: 570.0,
          density: 2427,
          compressiveStrength: 25.3
        }
      ],
      averageStrength: 25.0
    }]
  };

  const [reviewerInfo, setReviewerInfo] = useState({
    id: 1,
    name: 'Lalita S. Dussa',
    designation: 'Quality Manager',
    graduation: 'B.Tech.(Civil)'
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate and download PDF
    const element = document.getElementById('pdf-content');
    const html = element.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${testData.jobNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px 0' }}>
      <Container>
        {/* Action Buttons - Fixed at top */}
        <div className="d-flex justify-content-between align-items-center mb-3" style={{ position: 'sticky', top: '0', zIndex: 1000, backgroundColor: '#ffffff', padding: '10px 0' }}>
          <Button
            variant="secondary"
            onClick={() => navigate('/test-report-preview', { state: { testData } })}
            style={{
              backgroundColor: '#6c757d',
              borderColor: '#6c757d',
              color: '#ffffff'
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back to Preview
          </Button>
          
          <div>
            <Button
              variant="info"
              className="me-2"
              onClick={handlePrint}
              style={{
                backgroundColor: '#17a2b8',
                borderColor: '#17a2b8',
                color: '#ffffff'
              }}
            >
              <FontAwesomeIcon icon={faPrint} className="me-1" />
              Print
            </Button>
            
            <Button
              variant="success"
              onClick={handleDownload}
              style={{
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                color: '#ffffff'
              }}
            >
              <FontAwesomeIcon icon={faDownload} className="me-1" />
              Download
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div id="pdf-content" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
          {/* Header with Logos */}
          <div style={{ 
            backgroundColor: '#000000', 
            color: '#ffffff', 
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '5px'
          }}>
            <Row className="align-items-center">
              <Col md={2} className="text-center">
                <img 
                  src="/logo.png" 
                  alt="Vitrag Associates Logo" 
                  height="50"
                  style={{ borderRadius: '5px' }}
                />
              </Col>
              <Col md={8} className="text-center">
                <h2 style={{ 
                  color: '#ffffff', 
                  fontWeight: '700',
                  margin: '0'
                }}>
                  TEST REPORT
                </h2>
              </Col>
              <Col md={2} className="text-center">
                <img 
                  src="/nabl_logo_final.png" 
                  alt="NABL Logo" 
                  height="50"
                  style={{ borderRadius: '5px' }}
                />
              </Col>
            </Row>
          </div>

          {/* Customer Information Section */}
          <div className="mb-4">
            <Table style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              borderCollapse: 'collapse',
              border: '2px solid #000000'
            }}>
              <tbody>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000',
                    width: '25%'
                  }} rowSpan={2}>
                    Customer/Site Name & Address
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }} rowSpan={2}>
                    {testData.customerName}<br />
                    {testData.siteName}
                  </td>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000',
                    width: '18%'
                  }}>
                    Date of Report
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000',
                    width: '25%'
                  }}>
                    {new Date().toLocaleDateString('en-GB')}
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    ULR Number
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {testData.cubeTests[0]?.ulrNumber || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Job Code Number
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {testData.jobNumber}
                  </td>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Reference Number
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {testData.cubeTests[0]?.sampleCodeNumber || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Location/Structure Type
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }} colSpan={3}>
                    {testData.cubeTests[0]?.locationNature || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Date of Receipt
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {formatDate(testData.receiptDate)}
                  </td>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Age of Specimen
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {testData.cubeTests[0]?.ageInDays || 'N/A'} Days
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Date of Casting
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {formatDate(testData.cubeTests[0]?.castingDate)}
                  </td>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Date of Testing
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {formatDate(testData.cubeTests[0]?.testingDate)}
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Type of Specimen
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Concrete Cube Specimen
                  </td>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Grade of Specimen
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {testData.cubeTests[0]?.grade || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Condition of Specimen
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {testData.cubeTests[0]?.cubeCondition || 'N/A'}
                  </td>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Curing Condition
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {testData.cubeTests[0]?.curingCondition || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Machine used for Testing
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }} colSpan={3}>
                    {testData.cubeTests[0]?.machineUsed || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Location of Test
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }} colSpan={3}>
                    Permanent
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Capacity/Range
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    2000KN
                  </td>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Calibration Due Date
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
                  </td>
                </tr>
                <tr>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Test Method
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    {testData.cubeTests[0]?.testMethod || 'N/A'}
                  </td>
                  <th style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Environmental condition
                  </th>
                  <td style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '15px',
                    border: '2px solid #000000'
                  }}>
                    Not Applicable
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* Test Sample Description */}
          <div className="mb-4">
            <h5 style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '10px',
              textAlign: 'center',
              marginBottom: '20px',
              border: '2px solid #000000',
              borderRadius: '5px'
            }}>
              DESCRIPTION OF TEST SAMPLE
            </h5>
            <div className="table-responsive">
              <Table style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                borderCollapse: 'collapse',
                margin: '0 auto',
                width: 'auto',
                border: '2px solid #000000'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#000000',
                    borderBottom: '2px solid #000000'
                  }}>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '70px'
                    }}>
                      Sr. No.
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '100px'
                    }}>
                      ID Mark
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '70px'
                    }}>
                      L
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '70px'
                    }}>
                      B
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '70px'
                    }}>
                      H
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '100px'
                    }}>
                      Area (mm²)
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '100px'
                    }}>
                      Weight (kg)
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '120px'
                    }}>
                      Maximum Load (kN)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testData.cubeTests[0]?.testResults?.map((result, index) => (
                    <tr key={index}>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.srNo}
                      </td>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.idMark}
                      </td>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.dimensionLength}
                      </td>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.dimensionWidth}
                      </td>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.dimensionHeight}
                      </td>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.area}
                      </td>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.weight}
                      </td>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.crushingLoad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          {/* Test Results */}
          <div className="mb-4">
            <h5 style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '10px',
              textAlign: 'center',
              marginBottom: '20px',
              border: '2px solid #000000',
              borderRadius: '5px'
            }}>
              Test Result for Compressive Strength of Concrete Cube
            </h5>
            <div className="table-responsive">
              <Table style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                borderCollapse: 'collapse',
                margin: '0 auto',
                width: 'auto',
                border: '2px solid #000000'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#343a40',
                    borderBottom: '2px solid #000000'
                  }}>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '100px'
                    }}>
                      Sr. No.
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '120px'
                    }}>
                      ID Mark
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '150px'
                    }}>
                      Density (kg/m³)
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '200px'
                    }}>
                      Compressive Strength (N/mm²)
                    </th>
                    <th style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '10px',
                      border: '2px solid #000000',
                      width: '220px'
                    }}>
                      Average Compressive Strength (N/mm²)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testData.cubeTests[0]?.testResults?.map((result, index) => (
                    <tr key={index}>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.srNo}
                      </td>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.idMark}
                      </td>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.density}
                      </td>
                      <td style={{
                        color: '#000000',
                        textAlign: 'center',
                        padding: '10px',
                        border: '2px solid #000000'
                      }}>
                        {result.compressiveStrength}
                      </td>
                      {index === 0 && (
                        <td style={{
                          color: '#000000',
                          textAlign: 'center',
                          padding: '10px',
                          border: '2px solid #000000',
                          verticalAlign: 'middle'
                        }} rowSpan={testData.cubeTests[0]?.testResults?.length}>
                          {testData.cubeTests[0]?.averageStrength}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-4">
            <h5 style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '10px',
              marginBottom: '20px',
              border: '2px solid #000000',
              borderRadius: '5px'
            }}>
              Terms & Conditions –
            </h5>
            <ul style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              padding: '20px',
              border: '2px solid #000000',
              borderRadius: '5px'
            }}>
              <li style={{ marginBottom: '10px' }}>Samples were not drawn by VAs lab.</li>
              <li style={{ marginBottom: '10px' }}>The Test Reports & Results pertain to Sample/ Samples of material received by VAs.</li>
              <li style={{ marginBottom: '10px' }}>The Test Report cannot be reproduced without the written approval of CEO/QM of VAs.</li>
              <li style={{ marginBottom: '10px' }}>Any change/ correction/ alteration to the Test Report shall be invalid.</li>
              <li style={{ marginBottom: '10px' }}>The role VAs is restricted to testing of the material sample as received in the laboratory. VAs or any of its employees shall not be liable for any dispute/ litigation arising between the customer & Third Party on account of test results. VAs shall not interact with any Third Party in this regard.</li>
              <li>The CEO of VAs may make necessary changes to the terms & conditions without any prior notice.</li>
            </ul>
          </div>

          {/* Authorization Section */}
          <Row className="mb-4">
            <Col md={6}>
              <div className="text-center" style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                border: '2px solid #000000',
                borderRadius: '5px'
              }}>
                <p className="mb-2 fw-bold" style={{ color: '#000000' }}>Reviewed by –</p>
                <p className="mb-1 fw-bold" style={{ color: '#000000' }}>{reviewerInfo.name}</p>
                <p className="mb-1" style={{ color: '#000000' }}>({reviewerInfo.designation})</p>
                <p className="mb-0 fst-italic" style={{ color: '#000000' }}>{reviewerInfo.graduation}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="text-center" style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                border: '2px solid #000000',
                borderRadius: '5px'
              }}>
                <p className="mb-2 fw-bold" style={{ color: '#000000' }}>Authorized by –</p>
                <p className="mb-1 fw-bold" style={{ color: '#000000' }}>Mr. Prakarsh A Sangave</p>
                <p className="mb-1" style={{ color: '#000000' }}>(Chief Executive Officer)</p>
                <p className="mb-1 fst-italic" style={{ color: '#000000' }}>M.E(Civil-Structures)</p>
                <p className="mb-0 fst-italic" style={{ color: '#000000' }}>MTech (Civil-Geotechnical), M.I.E, F.I.E.</p>
              </div>
            </Col>
          </Row>

          {/* Report Footer */}
          <div className="text-center border-top pt-3" style={{
            borderTop: '2px solid #000000',
            paddingTop: '20px'
          }}>
            <p style={{ color: '#000000' }}>
              X-----------X-----------X-----------X----------END OF REPORT----------X-----------X-----------X-----------X
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PDFView;
