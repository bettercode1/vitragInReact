import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Use built-in fonts - no registration needed

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 10,
    fontFamily: 'Times-Roman',
    fontSize: 10,
  },
  
  // Content area for each page
  contentArea: {
    width: 190,
    minHeight: 250,
  },
  
  // Logo with exact specifications
  logoContainer: {
    position: 'absolute',
    left: 29,    // X=10mm from left edge
    top: 22,      // Y=8mm from top edge
    width: 115,   // Width: 40mm
    height: 74,  // Height: 25mm
    borderWidth: 2.5,  // Border: 0.8mm
    borderColor: '#808080',  // Border Color: RGB(128, 128, 128)
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  logo: {
    width: 113.5,
    height: 73.5,
  },
  
  // Company Name - centered, exact match to Python
  companyName: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 42,
    fontSize: 21.5,
    fontFamily: 'Times-Bold',
    letterSpacing:0.5,
    color: '#B40000',
    textAlign: 'center',
  },
  
  // Subtitle - centered, exact match to Python
  companySubtitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 70,
    fontSize: 13.5,
    letterSpacing:0.2,
    fontFamily: 'Times-Bold',
    color: '#0050A0',
    textAlign: 'center',
  },
  
    // Divider Line - starts from bottom-right of logo rectangle (Page 1 - with NABL logo)
    headerSeparator: {
      position: 'absolute',
      left: 155, // 29 + 114 = 143mm (start from right edge of logo)
      top: 94,   // 22 + 74 = 96mm (start from bottom edge of logo)
      width: 310, // Extend to right edge of page
      height: 2.0,
      backgroundColor: '#000000',
    },
    // Divider Line - extends full width (Pages 2 & 3 - no NABL logo)
    headerSeparatorFull: {
      position: 'absolute',
      left: 155, // 29 + 114 = 143mm (start from right edge of logo)
      top: 94,   // 22 + 74 = 96mm (start from bottom edge of logo)
      width:  410, // Extend all the way to right edge of page
      height: 2.0,
      backgroundColor: '#000000',
    },
  
  // NABL Logo - right top of first page only
  nablLogo: {
    position: 'absolute',
    right: 39,
    top: 26,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //TC-157656
    nablText: {
      position: 'absolute',
      right: 65,
      top: 105,
      fontSize: 8,
      fontFamily: 'Times-Bold',
      color: '#000000',
      textAlign: 'center',
      width: 25,
    },
    
    // TEST REPORT Title
    testReportTitle: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 100,
      fontSize: 14,
      fontFamily: 'Times-Bold',
      color: '#000000',
      textAlign: 'center',
    },
    
    // Title Underline
    titleUnderline: {
      position: 'absolute',
    //   alignContent:'center',
    //   justifyContent:'center',
      left: 250,
      right: 0,
      top: 116.5,
      height: 2,
      width:97,
      backgroundColor: '#000000',
    },
    
    // ===========================================
    // TEST DETAILS TABLE STYLES
    // ===========================================
    testDetailsTable: {
      position: 'absolute',
      left: 30,        // Left margin: 30px from left edge
      top: 130,        // 130px from top
      width: 550,      // Increased table width: 550px
    },
    
    // Table row container
    tableRow: {
      flexDirection: 'row',
      height: 15,      // Reduced row height: 15px
      margin: 0,       // Zero margins
      padding: 0,      // Zero padding
      display: 'flex',
      gap: 0,          // ZERO GAP between cells
      alignItems: 'stretch', // Stretch cells to fill row height
    },
    
    // ===========================================
    // STANDARD CELL STYLES (2-column layout)
    // ===========================================
    labelCell: {
      width: 130,      // Label column: 130px
      height: 15,      // Cell height: 15px
      borderWidth: 0.5,
      borderColor: '#000000',
      borderStyle: 'solid',
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 2,
      paddingRight: 0,
      margin: 0,
      marginRight: -0.5, // Overlap to eliminate gaps
    },
    
    valueCell: {
      width: 140,      // Value column: 140px
      height: 15,      // Cell height: 15px
      borderWidth: 0.5,
      borderColor: '#000000',
      borderStyle: 'solid',
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 2,
      paddingRight: 0,
      margin: 0,
    },
    
    // ===========================================
    // CUSTOMER/SITE NAME & ADDRESS (MERGED CELL)
    // ===========================================
    customerLabelCell: {
      width: 130,      // Label column: 130px
      height: 50,      // Height: 50px
      borderWidth: 0.5,
      borderColor: '#000000',
      borderStyle: 'solid',
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingLeft: 2,
      paddingRight: 0,
      margin: 0,
      marginRight: -0.5, // Overlap to eliminate gaps
    },
    
    customerValueCell: {
      width: 140,      // Value column: 140px
      height: 50,      // Height: 50px
      borderWidth: 0.5,
      borderColor: '#000000',
      borderStyle: 'solid',
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingLeft: 2,
      paddingRight: 0,
      margin: 0,
    },
    
    // ===========================================
    // RIGHT SIDE CELLS (DATE, ULR, JOB CODE, ETC.)
    // ===========================================
    rightSideLabelCell: {
      width: 129,      // Label column: 129px
      height: 25,      // Height: 25px
      borderWidth: 0.5,
      borderColor: '#000000',
      borderStyle: 'solid',
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 2,
      paddingRight: 0,
      margin: 0,
      marginRight: -0.5, // Overlap to eliminate gaps
    },
    
    rightSideValueCell: {
      width: 140,      // Value column: 140px
      height: 25,      // Height: 25px
      borderWidth: 0.5,
      borderColor: '#000000',
      borderStyle: 'solid',
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 2,
      paddingRight: 0,
      margin: 0,
    },
    
    // ===========================================
    // STANDARD HEIGHT RIGHT SIDE CELLS (15px)
    // ===========================================
    rightSideLabelCellStandard: {
      width: 129,      // Label column: 129px
      height: 15,      // Height: 15px
      borderWidth: 0.5,
      borderColor: '#000000',
      borderStyle: 'solid',
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 2,
      paddingRight: 0,
      margin: 0,
      marginRight: -0.5, // Overlap to eliminate gaps
    },
    
    rightSideValueCellStandard: {
      width: 140,      // Value column: 140px
      height: 15,      // Height: 15px
      borderWidth: 0.5,
      borderColor: '#000000',
      borderStyle: 'solid',
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 2,
      paddingRight: 0,
      margin: 0,
    },
    
    // ===========================================
    // FULL WIDTH CELLS (SPANS ENTIRE ROW)
    // ===========================================
    fullWidthLabelCell: {
      width: 130,      // Label column: 130px
      height: 15,      // Cell height: 15px
      borderWidth: 0.5,
      borderColor: '#000000',
      borderStyle: 'solid',
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 2,
      paddingRight: 0,
      margin: 0,
      marginRight: -0.5, // Overlap to eliminate gaps
    },
    
    fullWidthValueCell: {
      width: 408,      // Spans remaining width: 420px (550px - 130px)
      height: 15,      // Cell height: 15px
      borderWidth: 0.5,
      borderColor: '#000000',
      borderStyle: 'solid',
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 2,
      paddingRight: 0,
      margin: 0,
    },
    
    // Empty cell for spacing - COMPLETELY INVISIBLE
    emptyCell: {
      width: 130,      // Same width as label cell (130px)
      height: 15,      // Reduced height: 15px
      borderWidth: 0.01,  // Very small but valid border width
      borderColor: 'transparent',
      borderStyle: 'solid',  // Valid border style
      backgroundColor: 'transparent',  // Transparent background
      padding: 0,
      margin: 0,
    },
    
    // Empty cell for ULR positioning - pushes ULR to right column
    emptyCellForULR: {
      width: 269,      // Width of customer cells (130 + 140 = 270px)
      height: 15,      // Reduced height: 15px
      borderWidth: 0.01,  // Very small but valid border width
      borderColor: 'transparent',
      borderStyle: 'solid',  // Valid border style
      backgroundColor: 'transparent',  // Transparent background
      padding: 0,
      margin: 0,
    },
    
    // ===========================================
    // TABLE TEXT STYLES
    // ===========================================
    tableLabelText: {
      fontSize: 10,              // Table Headers: Times Bold 10pt
      fontFamily: 'Times-Bold', // Times Bold for headers
      color: '#000000',          // Black text color
      textAlign: 'left',         // Force left alignment
    },

    tableValueText: {
      fontSize: 11,              // Table Data: Times Regular 11pt
      fontFamily: 'Times-Roman', // Times Regular for data
      color: '#000000',          // Black text color
      textAlign: 'left',         // Force left alignment
    },

    // Customer/Address text style
    customerText: {
      fontSize: 10,              // Customer/Address: Times Regular 9-11pt (using 10pt)
      fontFamily: 'Times-Roman', // Times Regular
      color: '#000000',          // Black text color
      textAlign: 'left',         // Force left alignment
    },

    // Grade header text style
    gradeHeaderText: {
      fontSize: 9,               // Grade Header: Times Bold 9pt
      fontFamily: 'Times-Bold', // Times Bold
      color: '#000000',          // Black text color
      textAlign: 'left',         // Force left alignment
    },
  
  // Placeholder text
//   placeholderText: {
//     fontSize: 12,
//     color: '#666666',
//     textAlign: 'center',
//     marginTop: 50,
//   },
});

const ConcreteCubeFinalTest = ({ testData }) => {
  return (
    <Document>
      {/* PAGE 1 - BLANK */}
      <Page size="A4" style={styles.page}>
        {/* Logo with exact specifications */}
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/logo.png" />
        </View>
        
        {/* NABL Logo - first page only */}
        <Image style={styles.nablLogo} src={require('../assets/nabl_logo_final.png')} />
        <Text style={styles.nablText}>TC-15756</Text>
        
        {/* Company Name */}
        <Text style={styles.companyName}>VITRAG ASSOCIATES LLP</Text>
        
        {/* Subtitle */}
        <Text style={styles.companySubtitle}>(Construction Material Testing Laboratory)</Text>
        
        {/* Divider Line - starts from bottom-right of logo rectangle */}
        <View style={styles.headerSeparator} />
        
        {/* TEST REPORT Title */}
        <Text style={styles.testReportTitle}>TEST REPORT</Text>
        <View style={styles.titleUnderline} />
        
        {/* Test Details Table */}
        <View style={styles.testDetailsTable}>
          {/* Row 1: Customer/Site Name & Address + Date of Report */}
          <View style={styles.tableRow}>
            <View style={styles.customerLabelCell}>
              <Text style={styles.customerText}>Customer/Site Name &{'\n'}Address</Text>
            </View>
            <View style={styles.customerValueCell}>
              <Text style={styles.customerText}>Lords Developers Shivyogi Residency, shelgi solapur</Text>
            </View>
            <View style={styles.rightSideLabelCell}>
              <Text style={styles.tableLabelText}>Date of Report</Text>
            </View>
            <View style={styles.rightSideValueCell}>
              <Text style={styles.tableValueText}>09/09/2025</Text>
            </View>
          </View>
          
          {/* Row 2: ULR Number (right side only) */}
          <View style={styles.tableRow}>
            <View style={styles.emptyCellForULR} />
            <View style={styles.rightSideLabelCell}>
              <Text style={styles.tableLabelText}>ULR Number</Text>
            </View>
            <View style={styles.rightSideValueCell}>
              <Text style={styles.tableValueText}>TC-1575625000001840F</Text>
            </View>
          </View>
          
          {/* Row 3: Reference Number + Job Code Number */}
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.tableLabelText}>Reference Number</Text>
            </View>
            <View style={styles.valueCell}>
              <Text style={styles.tableValueText}>VA/CC/2025/AUG-74</Text>
            </View>
            <View style={styles.rightSideLabelCellStandard}>
              <Text style={styles.tableLabelText}>Job Code Number</Text>
            </View>
            <View style={styles.rightSideValueCellStandard}>
              <Text style={styles.tableValueText}>T-2501690</Text>
            </View>
          </View>
          
          {/* Row 4: Location/Structure Type (full width) */}
          <View style={styles.tableRow}>
            <View style={styles.fullWidthLabelCell}>
              <Text style={styles.tableLabelText}>Location/Structure Type</Text>
            </View>
            <View style={styles.fullWidthValueCell}>
              <Text style={styles.tableValueText}>column</Text>
            </View>
          </View>
          
          {/* Row 5: Date of Receipt + Age of Specimen */}
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.tableLabelText}>Date of Receipt</Text>
            </View>
            <View style={styles.valueCell}>
              <Text style={styles.tableValueText}>25/08/2025</Text>
            </View>
            <View style={styles.rightSideLabelCellStandard}>
              <Text style={styles.tableLabelText}>Age of Specimen</Text>
            </View>
            <View style={styles.rightSideValueCellStandard}>
              <Text style={styles.tableValueText}>28 Days</Text>
            </View>
          </View>
          
          {/* Row 6: Date of Casting + Date of Testing */}
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.tableLabelText}>Date of Casting</Text>
            </View>
            <View style={styles.valueCell}>
              <Text style={styles.tableValueText}>11/08/2025</Text>
            </View>
            <View style={styles.rightSideLabelCellStandard}>
              <Text style={styles.tableLabelText}>Date of Testing</Text>
            </View>
            <View style={styles.rightSideValueCellStandard}>
              <Text style={styles.tableValueText}>08/09/2025</Text>
            </View>
          </View>
          
          {/* Row 7: Type of Specimen + Grade of Specimen */}
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.tableLabelText}>Type of Specimen</Text>
            </View>
            <View style={styles.valueCell}>
              <Text style={styles.tableValueText}>Concrete Cube</Text>
            </View>
            <View style={styles.rightSideLabelCellStandard}>
              <Text style={styles.tableLabelText}>Grade of Specimen</Text>
            </View>
            <View style={styles.rightSideValueCellStandard}>
              <Text style={styles.tableValueText}>M-25</Text>
            </View>
          </View>
          
          {/* Row 8: Condition of Specimen + Curing Condition */}
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.tableLabelText}>Condition of Specimen</Text>
            </View>
            <View style={styles.valueCell}>
              <Text style={styles.tableValueText}>Acceptable</Text>
            </View>
            <View style={styles.rightSideLabelCellStandard}>
              <Text style={styles.tableLabelText}>Curing Condition</Text>
            </View>
            <View style={styles.rightSideValueCellStandard}>
              <Text style={styles.tableValueText}>28.0</Text>
            </View>
          </View>
          
          {/* Row 9: Machine used for Testing (full width) */}
          <View style={styles.tableRow}>
            <View style={styles.fullWidthLabelCell}>
              <Text style={styles.tableLabelText}>Machine used for Testing</Text>
            </View>
            <View style={styles.fullWidthValueCell}>
              <Text style={styles.tableValueText}>Fully automatic Digital Compression Testing Machine</Text>
            </View>
          </View>
          
          {/* Row 10: Capacity Range + Calibration Due Date */}
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.tableLabelText}>Capacity Range</Text>
            </View>
            <View style={styles.valueCell}>
              <Text style={styles.tableValueText}>2000KN</Text>
            </View>
            <View style={styles.rightSideLabelCellStandard}>
              <Text style={styles.tableLabelText}>Calibration Due Date</Text>
            </View>
            <View style={styles.rightSideValueCellStandard}>
              <Text style={styles.tableValueText}>01/07/2026</Text>
            </View>
          </View>
          
          {/* Row 11: Test Method + Environmental condition */}
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.tableLabelText}>Test Method</Text>
            </View>
            <View style={styles.valueCell}>
              <Text style={styles.tableValueText}>IS 516 (Part1/Sec1):2021</Text>
            </View>
            <View style={styles.rightSideLabelCellStandard}>
              <Text style={styles.tableLabelText}>Environmental condition</Text>
            </View>
            <View style={styles.rightSideValueCellStandard}>
              <Text style={styles.tableValueText}>Not Applicable</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.contentArea}>
        
        </View>
      </Page>

      {/* PAGE 2 - WITH HEADER */}
      <Page size="A4" style={styles.page}>
        {/* Logo with exact specifications */}
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/logo.png" />
        </View>
        
        {/* Company Name */}
        <Text style={styles.companyName}>VITRAG ASSOCIATES LLP</Text>
        
        {/* Subtitle */}
        <Text style={styles.companySubtitle}>(Construction Material Testing Laboratory)</Text>
        
        {/* Divider Line - extends full width (no NABL logo) */}
        <View style={styles.headerSeparatorFull} />
        
        <View style={styles.contentArea}>
          {/* Page 2 content will go here */}
        </View>
      </Page>

      {/* PAGE 3 - WITH HEADER */}
      <Page size="A4" style={styles.page}>
        {/* Logo with exact specifications */}
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/logo.png" />
        </View>
        
        {/* Company Name */}
        <Text style={styles.companyName}>VITRAG ASSOCIATES LLP</Text>
        
        {/* Subtitle */}
        <Text style={styles.companySubtitle}>(Construction Material Testing Laboratory)</Text>
        
        {/* Divider Line - extends full width (no NABL logo) */}
        <View style={styles.headerSeparatorFull} />
        
        <View style={styles.contentArea}>
          {/* Page 3 content will go here */}
        </View>
      </Page>
    </Document>
  );
};

export default ConcreteCubeFinalTest;