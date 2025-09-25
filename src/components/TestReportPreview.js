import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faFilePdf,
  faSave,
  faUser,
  faBuilding,
  faCalendar,
  faCog,
  faFlask
} from '@fortawesome/free-solid-svg-icons';

const TestReportPreview = () => {
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

  const [selectedReviewer, setSelectedReviewer] = useState('1');

  const reviewers = [
    { id: 1, name: 'Lalita S. Dussa', designation: 'Quality Manager', graduation: 'B.Tech.(Civil)' },
    { id: 2, name: 'Harsha Prakarsha Sangave', designation: 'Quality Manager', graduation: 'M.E(Civil-Structures)' },
    { id: 3, name: 'Amol A Adam', designation: 'Quality Manager', graduation: 'B.E(Civil)' },
    { id: 4, name: 'Aaquib J. Shaikh', designation: 'Quality Manager', graduation: 'B.E(Civil)' },
    { id: 5, name: 'Prakarsha A. Sangave', designation: 'Chief Executive Officer', graduation: 'M.E(Civil-Structures)' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString;
  };

  const handleReviewerChange = (e) => {
    const reviewerId = e.target.value;
    setSelectedReviewer(reviewerId);
    const reviewer = reviewers.find(r => r.id === parseInt(reviewerId));
    if (reviewer) {
      setReviewerInfo(reviewer);
    }
  };


  const handleViewPDF = () => {
    // Navigate to the existing HTML PDF file
    window.open('/cubeTestingReport.html', '_blank');
  };

  return (
    <div style={{ backgroundColor: '#1C2333', minHeight: '100vh', padding: '20px 0' }}>
      <Container>
        {/* Header with Logos */}
        <Card style={{
          backgroundColor: '#1C2333',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          marginBottom: '20px'
        }}>
          <Card.Header style={{
            backgroundColor: '#1C2333',
            borderBottom: '2px solid #FFA500',
            padding: '20px'
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
          </Card.Header>

          <Card.Body style={{ backgroundColor: '#1C2333', padding: '30px' }}>
            {/* Customer Information Section */}
            <div className="mb-4">
              <Table style={{
                backgroundColor: '#1C2333',
                color: '#ffffff',
                borderCollapse: 'collapse'
              }}>
                <tbody>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: '25%'
                    }} rowSpan={2}>
                      Customer/Site Name & Address
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }} rowSpan={2}>
                      {testData.customerName}<br />
                      {testData.siteName}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: '18%'
                    }}>
                      Date of Report
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: '25%'
                    }}>
                      {new Date().toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      ULR Number
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.ulrNumber || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Job Code Number
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.jobNumber}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Reference Number
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.sampleCodeNumber || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Location/Structure Type
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }} colSpan={3}>
                      {testData.cubeTests[0]?.locationNature || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Date of Receipt
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {formatDate(testData.receiptDate)}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Age of Specimen
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.ageInDays || 'N/A'} Days
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Date of Casting
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {formatDate(testData.cubeTests[0]?.castingDate)}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Date of Testing
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {formatDate(testData.cubeTests[0]?.testingDate)}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Type of Specimen
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Concrete Cube Specimen
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Grade of Specimen
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.grade || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Condition of Specimen
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.cubeCondition || 'N/A'}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Curing Condition
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.curingCondition || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Machine used for Testing
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }} colSpan={3}>
                      {testData.cubeTests[0]?.machineUsed || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Location of Test
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }} colSpan={3}>
                      Permanent
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Capacity/Range
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      2000KN
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Calibration Due Date
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                  <tr>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Test Method
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {testData.cubeTests[0]?.testMethod || 'N/A'}
                    </td>
                    <th style={{
                      backgroundColor: '#1C2333',
                      color: '#FFD700',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Environmental condition
                    </th>
                    <td style={{
                      backgroundColor: '#1C2333',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
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
                backgroundColor: '#1C2333',
                color: '#FFD700',
                padding: '10px',
                textAlign: 'center',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px'
              }}>
                DESCRIPTION OF TEST SAMPLE
              </h5>
              <div className="table-responsive">
                <Table style={{
                  backgroundColor: '#1C2333',
                  color: '#ffffff',
                  borderCollapse: 'collapse',
                  margin: '0 auto',
                  width: 'auto'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: '#1C2333',
                      borderBottom: '2px solid #FFA500'
                    }}>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '70px'
                      }}>
                        Sr. No.
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100px'
                      }}>
                        ID Mark
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '70px'
                      }}>
                        L
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '70px'
                      }}>
                        B
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '70px'
                      }}>
                        H
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100px'
                      }}>
                        Area (mm²)
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100px'
                      }}>
                        Weight (kg)
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
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
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.srNo}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.idMark}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.dimensionLength}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.dimensionWidth}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.dimensionHeight}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.area}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.weight}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
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
                backgroundColor: '#1C2333',
                color: '#FFD700',
                padding: '10px',
                textAlign: 'center',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px'
              }}>
                Test Result for Compressive Strength of Concrete Cube
              </h5>
              <div className="table-responsive">
                <Table style={{
                  backgroundColor: '#1C2333',
                  color: '#ffffff',
                  borderCollapse: 'collapse',
                  margin: '0 auto',
                  width: 'auto'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: '#343a40',
                      borderBottom: '2px solid #FFA500'
                    }}>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100px'
                      }}>
                        Sr. No.
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '120px'
                      }}>
                        ID Mark
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '150px'
                      }}>
                        Density (kg/m³)
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '200px'
                      }}>
                        Compressive Strength (N/mm²)
                      </th>
                      <th style={{
                        color: '#FFD700',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
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
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.srNo}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.idMark}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.density}
                        </td>
                        <td style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {result.compressiveStrength}
                        </td>
                        {index === 0 && (
                          <td style={{
                            color: '#ffffff',
                            textAlign: 'center',
                            padding: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
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
                backgroundColor: '#1C2333',
                color: '#FFD700',
                padding: '10px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px'
              }}>
                Terms & Conditions –
              </h5>
              <ul style={{
                backgroundColor: '#1C2333',
                color: '#ffffff',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
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

            {/* Reviewer Selection */}
            <div className="mb-4">
              <Card style={{
                backgroundColor: '#1C2333',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Card.Header style={{
                  backgroundColor: '#FFA500',
                  color: '#000000',
                  padding: '10px'
                }}>
                  <h6 className="mb-0">Select Report Reviewer</h6>
                </Card.Header>
                <Card.Body style={{ padding: '15px' }}>
                  <Row>
                    <Col md={6}>
                      <Form.Label style={{ color: '#ffffff' }}>Select Reviewer:</Form.Label>
                      <Form.Select
                        value={selectedReviewer}
                        onChange={handleReviewerChange}
                        style={{
                          backgroundColor: '#495057',
                          borderColor: '#6c757d',
                          color: '#ffffff'
                        }}
                      >
                        {reviewers.map(reviewer => (
                          <option key={reviewer.id} value={reviewer.id}>
                            {reviewer.name} - {reviewer.designation}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={6} className="d-flex align-items-end">
                      <Button
                        variant="success"
                        size="sm"
                        style={{
                          backgroundColor: '#28a745',
                          borderColor: '#28a745',
                          color: '#ffffff'
                        }}
                      >
                        <FontAwesomeIcon icon={faSave} className="me-1" />
                        Update Reviewer
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>

            {/* Authorization Section */}
            <Row className="mb-4">
              <Col md={6}>
                <div className="text-center" style={{
                  backgroundColor: '#1C2333',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '5px'
                }}>
                  <p className="mb-2 fw-bold" style={{ color: '#FFD700' }}>Reviewed by –</p>
                  <p className="mb-1 fw-bold" style={{ color: '#ffffff' }}>{reviewerInfo.name}</p>
                  <p className="mb-1" style={{ color: '#ffffff' }}>({reviewerInfo.designation})</p>
                  <p className="mb-0 fst-italic" style={{ color: '#ffffff' }}>{reviewerInfo.graduation}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-center" style={{
                  backgroundColor: '#1C2333',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '5px'
                }}>
                  <p className="mb-2 fw-bold" style={{ color: '#FFD700' }}>Authorized by –</p>
                  <p className="mb-1 fw-bold" style={{ color: '#ffffff' }}>Mr. Prakarsh A Sangave</p>
                  <p className="mb-1" style={{ color: '#ffffff' }}>(Chief Executive Officer)</p>
                  <p className="mb-1 fst-italic" style={{ color: '#ffffff' }}>M.E(Civil-Structures)</p>
                  <p className="mb-0 fst-italic" style={{ color: '#ffffff' }}>MTech (Civil-Geotechnical), M.I.E, F.I.E.</p>
                </div>
              </Col>
            </Row>

            {/* Report Footer */}
            <div className="text-center border-top pt-3" style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              paddingTop: '20px'
            }}>
              <p style={{ color: '#ffffff' }}>
                X-----------X-----------X-----------X----------END OF REPORT----------X-----------X-----------X-----------X
              </p>
            </div>

            {/* Action Buttons */}
            <div className="text-center mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate('/view-sample', { state: { testData } })}
                style={{
                  backgroundColor: '#6c757d',
                  borderColor: '#6c757d',
                  color: '#ffffff'
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                Back to Test Details
              </Button>
              
              <Button
                variant="primary"
                className="me-2"
                onClick={handleViewPDF}
                style={{
                  backgroundColor: '#FFA500',
                  borderColor: '#FFA500',
                  color: '#000000'
                }}
              >
                <FontAwesomeIcon icon={faFilePdf} className="me-1" />
                View as PDF
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TestReportPreview;
