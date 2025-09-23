import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts for better PDF rendering
Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf'
});

Font.register({
  family: 'Helvetica-Bold',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica-Bold.ttf'
});

Font.register({
  family: 'Times-Roman',
  src: 'https://fonts.gstatic.com/s/timesroman/v1/times-roman.ttf'
});

// PDF Styles - Matching Reference Image
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#333333',
  },
  headerLeft: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
  },
  logoSymbol: {
    width: 40,
    height: 40,
    backgroundColor: '#333333',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    border: '2px solid #333333',
  },
  logoText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 3,
    fontFamily: 'Times-Roman',
  },
  companySubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
    textTransform: 'uppercase',
  },
  mainTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    margin: '20 0',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 8,
  },
  generalInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoColumn: {
    width: '48%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333333',
    width: 60,
    marginRight: 5,
  },
  infoValue: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 2,
    fontSize: 9,
    color: '#333333',
  },
  testResultSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#333333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333333',
  },
  tableCell: {
    padding: 4,
    fontSize: 8,
    color: '#333333',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333333',
    minHeight: 15,
  },
  averageRow: {
    backgroundColor: '#f8f8f8',
  },
  averageLabel: {
    textAlign: 'right',
    fontWeight: 'bold',
    paddingRight: 5,
  },
  averageValue: {
    fontWeight: 'bold',
    backgroundColor: '#e8f4f8',
  },
  remarksSection: {
    marginBottom: 20,
  },
  remarksLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  remarksContent: {
    borderWidth: 1,
    borderColor: '#333333',
    padding: 8,
    minHeight: 40,
    fontSize: 9,
    color: '#333333',
  },
  verificationSection: {
    marginBottom: 20,
  },
  verificationTable: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#333333',
  },
  verificationHeader: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
  },
  verificationHeaderCell: {
    padding: 6,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333333',
    width: '33.33%',
  },
  verificationCell: {
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#333333',
    width: '33.33%',
    alignItems: 'center',
  },
  signatureItem: {
    alignItems: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    marginBottom: 5,
    paddingBottom: 2,
    fontSize: 8,
    color: '#333333',
    minHeight: 12,
    width: '100%',
  },
  signatureLabel: {
    fontSize: 7,
    color: '#666666',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  footerText: {
    fontSize: 7,
    color: '#666666',
  },
});

// PDF Document Component
const LiquidAdmixturePDFDocument = ({ formData }) => {
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
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoSymbol}>
              <Text>V</Text>
            </View>
            <Text style={styles.logoText}>VITRAG ASSOCIATES</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.companyName}>VITRAG ASSOCIATES LLP</Text>
            <Text style={styles.companySubtitle}>(CONSTRUCTION MATERIAL TESTING LABORATORY)</Text>
          </View>
        </View>

        {/* Main Title */}
        <Text style={styles.mainTitle}>RELATIVE DENSITY OF LIQUID ADMIXTURE</Text>

        {/* General Information */}
        <View style={styles.generalInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Sample Description:</Text>
                <Text style={styles.infoValue}>{formData.sample_description || '________________'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date of Receipt:</Text>
                <Text style={styles.infoValue}>{formatDate(formData.date_of_receipt) || '________________'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Test Method:</Text>
                <Text style={styles.infoValue}>IS 9103:1999</Text>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Sample Test Code Number:</Text>
                <Text style={styles.infoValue}>{formData.sample_test_code || '________________'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date of Testing:</Text>
                <Text style={styles.infoValue}>{formatDate(formData.date_of_testing) || '________________'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Environmental Conditions:</Text>
                <Text style={styles.infoValue}>{formData.environmental_conditions || 'Laboratory Conditions'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Test Results */}
        <View style={styles.testResultSection}>
          <Text style={styles.sectionTitle}>TEST RESULT</Text>
          
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '8%' }]}>Sr. No.</Text>
              <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Colour & Texture of Admixture</Text>
              <Text style={[styles.tableHeaderCell, { width: '18%' }]}>Volume of Admixture taken (ml)</Text>
              <Text style={[styles.tableHeaderCell, { width: '18%' }]}>Temperature of Liquid (°C)</Text>
              <Text style={[styles.tableHeaderCell, { width: '18%' }]}>Reading on Hydrometer</Text>
              <Text style={[styles.tableHeaderCell, { width: '13%' }]}>Relative Density of Admixture</Text>
            </View>
            
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <View key={row} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '8%' }]}>{row}</Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>{formData[`colour_texture_${row}`] || ''}</Text>
                <Text style={[styles.tableCell, { width: '18%' }]}>{formData[`volume_ml_${row}`] || (row <= 3 ? '400' : '')}</Text>
                <Text style={[styles.tableCell, { width: '18%' }]}>{formData[`temperature_c_${row}`] || ''}</Text>
                <Text style={[styles.tableCell, { width: '18%' }]}>{formData[`hydrometer_reading_${row}`] || ''}</Text>
                <Text style={[styles.tableCell, { width: '13%' }]}>{formData[`relative_density_${row}`] || ''}</Text>
              </View>
            ))}
            
            <View style={[styles.tableRow, styles.averageRow]}>
              <Text style={[styles.tableCell, { width: '8%' }]}></Text>
              <Text style={[styles.tableCell, { width: '25%' }]}></Text>
              <Text style={[styles.tableCell, { width: '18%' }]}></Text>
              <Text style={[styles.tableCell, { width: '18%' }]}></Text>
              <Text style={[styles.tableCell, styles.averageLabel, { width: '18%' }]}>Average</Text>
              <Text style={[styles.tableCell, styles.averageValue, { width: '13%' }]}>{calculateAverage()}</Text>
            </View>
          </View>
        </View>

        {/* Remarks */}
        <View style={styles.remarksSection}>
          <Text style={styles.remarksLabel}>Remarks:</Text>
          <Text style={styles.remarksContent}>{formData.remarks || ''}</Text>
        </View>

        {/* Verification */}
        <View style={styles.verificationSection}>
          <View style={styles.verificationTable}>
            <View style={styles.verificationHeader}>
              <Text style={styles.verificationHeaderCell}>Tested By</Text>
              <Text style={styles.verificationHeaderCell}>Checked By</Text>
              <Text style={styles.verificationHeaderCell}>Verified By</Text>
            </View>
            
            <View style={styles.tableRow}>
              <View style={styles.verificationCell}>
                <View style={styles.signatureItem}>
                  <Text style={styles.signatureLine}>{formData.tested_by_name || ''}</Text>
                  <Text style={styles.signatureLabel}>Date:</Text>
                  <Text style={styles.signatureLine}>{formatDate(formData.tested_by_date) || ''}</Text>
                  <Text style={styles.signatureLabel}>Sign:</Text>
                  <Text style={styles.signatureLine}></Text>
                </View>
              </View>
              <View style={styles.verificationCell}>
                <View style={styles.signatureItem}>
                  <Text style={styles.signatureLine}>{formData.checked_by_name || ''}</Text>
                  <Text style={styles.signatureLabel}>Date:</Text>
                  <Text style={styles.signatureLine}>{formatDate(formData.checked_by_date) || ''}</Text>
                  <Text style={styles.signatureLabel}>Sign:</Text>
                  <Text style={styles.signatureLine}></Text>
                </View>
              </View>
              <View style={styles.verificationCell}>
                <View style={styles.signatureItem}>
                  <Text style={styles.signatureLine}>{formData.verified_by_name || 'Prakarsh A Sangave'}</Text>
                  <Text style={styles.signatureLabel}>Date:</Text>
                  <Text style={styles.signatureLine}>{formatDate(formData.verified_by_date) || ''}</Text>
                  <Text style={styles.signatureLabel}>Sign:</Text>
                  <Text style={styles.signatureLine}></Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Document No- VA/QF/04/05/01, Rev/Issue No- 00/00, Date - {new Date().toLocaleDateString('en-GB')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Generation Function
export const generateLiquidAdmixturePDF = async (formData) => {
  try {
    const { pdf } = await import('@react-pdf/renderer');
    const blob = await pdf(LiquidAdmixturePDFDocument({ formData })).toBlob();
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relative_Density_Liquid_Admixture_${formData.url_number || 'LA-2024-001'}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export default LiquidAdmixturePDFDocument;