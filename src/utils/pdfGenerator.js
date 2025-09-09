import jsPDF from 'jspdf';

class VitragPDFGenerator {
  constructor() {
    this.doc = new jsPDF('P', 'mm', 'A4');
    this.pageWidth = 210;
    this.pageHeight = 297;
    this.margin = 10;
    this.currentY = 0;
  }

  // Add standard header matching Python code exactly
  addStandardHeader(pageTitle = null, pageNumber = 1) {
    // Logo on the left with gray border box - exact match to reference
    const logoX = 10;
    const logoY = 8;
    const logoW = 40;
    const logoH = 25;

    // Draw gray border around logo
    this.doc.setDrawColor(128, 128, 128);
    this.doc.setLineWidth(0.8);
    this.doc.rect(logoX, logoY, logoW, logoH);

    // Add logo placeholder (you can replace with actual logo)
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(logoX + 1, logoY + 1, logoW - 2, logoH - 2, 'F');
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('LOGO', logoX + logoW/2, logoY + logoH/2, { align: 'center' });

    // NABL logo on the right - ONLY on page 1
    if (pageNumber === 1) {
      const nablX = 170;
      const nablY = 8;
      const nablW = 25;
      const nablH = 25;

      // NABL logo placeholder
      this.doc.setFillColor(200, 200, 200);
      this.doc.rect(nablX, nablY, nablW, nablH, 'F');
      this.doc.setFontSize(6);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('NABL', nablX + nablW/2, nablY + nablH/2, { align: 'center' });

      // NABL certification number centered below NABL logo
      this.doc.setFont('times', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(0, 0, 0);
      const tcText = 'TC-15756';
      const tcWidth = this.doc.getTextWidth(tcText);
      const tcX = nablX + (nablW - tcWidth) / 2;
      this.doc.text(tcText, tcX, nablY + nablH + 5);
    }

    // Company name in red - PERFECTLY CENTERED
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(22);
    this.doc.setTextColor(180, 0, 0); // Dark red color
    const companyName = 'VITRAG ASSOCIATES LLP';
    const companyWidth = this.doc.getTextWidth(companyName);
    const companyX = (this.pageWidth - companyWidth) / 2;
    this.doc.text(companyName, companyX, 22);

    // Subtitle in blue - PERFECTLY CENTERED
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(0, 80, 160); // Blue color
    const subtitle = '(Construction Material Testing Laboratory)';
    const subtitleWidth = this.doc.getTextWidth(subtitle);
    const subtitleX = (this.pageWidth - subtitleWidth) / 2;
    this.doc.text(subtitle, subtitleX, 29);

    // Horizontal line below header
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(0.8);
    if (pageNumber === 1) {
      this.doc.line(55, 33, 162, 33); // Line stops before NABL logo on page 1
    } else {
      this.doc.line(55, 33, 200, 33); // Full width on other pages
    }

    // Page-specific title if provided
    if (pageTitle) {
      this.doc.setFont('times', 'bold');
      this.doc.setFontSize(14);
      this.doc.setTextColor(0, 0, 0);
      const titleWidth = this.doc.getTextWidth(pageTitle);
      const titleX = (this.pageWidth - titleWidth) / 2;
      this.doc.text(pageTitle, titleX, 40);

      // Underline for title
      this.doc.setLineWidth(0.8);
      this.doc.line(titleX, 42, titleX + titleWidth, 42);
    }

    this.currentY = 44; // Set starting Y position after header
  }

  // Add table row with responsive text
  addTableRow(label, value, isSplit = true, highlight = false) {
    const pageWidth = 190; // Usable page width
    const colWidth1 = pageWidth * 0.24; // 24% for header column
    const colWidth2 = pageWidth * 0.26; // 26% for value column
    const colWidth3 = pageWidth * 0.24; // 24% for header column (right)
    const colWidth4 = pageWidth * 0.26; // 26% for value column (right)
    const rowHeight = 4;
    const xStart1 = 10;
    const xStart2 = xStart1 + colWidth1 + colWidth2;

    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(11);

    if (isSplit) {
      // Left side
      this.doc.setFillColor(240, 240, 240);
      this.doc.rect(xStart1, this.currentY, colWidth1, rowHeight, 'F');
      this.doc.rect(xStart1, this.currentY, colWidth1, rowHeight);
      this.doc.text(label, xStart1 + 1, this.currentY + 2.5);

      // Right side value
      this.doc.rect(xStart1 + colWidth1, this.currentY, colWidth2, rowHeight);
      
      if (highlight) {
        // Add yellow highlight
        this.doc.setFillColor(255, 255, 0);
        const textWidth = this.doc.getTextWidth(value.toString());
        this.doc.rect(xStart1 + colWidth1 + 1, this.currentY + 0.5, textWidth + 2, 3, 'F');
      }
      
      this.doc.text(value.toString(), xStart1 + colWidth1 + 1, this.currentY + 2.5);
    } else {
      // Full width
      this.doc.setFillColor(240, 240, 240);
      this.doc.rect(xStart1, this.currentY, colWidth1, rowHeight, 'F');
      this.doc.rect(xStart1, this.currentY, colWidth1, rowHeight);
      this.doc.text(label, xStart1 + 1, this.currentY + 2.5);

      this.doc.rect(xStart1 + colWidth1, this.currentY, colWidth2 + colWidth3 + colWidth4, rowHeight);
      this.doc.text(value.toString(), xStart1 + colWidth1 + 1, this.currentY + 2.5);
    }

    this.currentY += rowHeight;
  }

  // Add table row pair (left and right columns)
  addTableRowPair(leftLabel, leftValue, rightLabel, rightValue, leftHighlight = false, rightHighlight = false) {
    const pageWidth = 190;
    const colWidth1 = pageWidth * 0.24;
    const colWidth2 = pageWidth * 0.26;
    const colWidth3 = pageWidth * 0.24;
    const colWidth4 = pageWidth * 0.26;
    const rowHeight = 4;
    const xStart1 = 10;
    const xStart2 = xStart1 + colWidth1 + colWidth2;

    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(11);

    // Left side
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(xStart1, this.currentY, colWidth1, rowHeight, 'F');
    this.doc.rect(xStart1, this.currentY, colWidth1, rowHeight);
    this.doc.text(leftLabel, xStart1 + 1, this.currentY + 2.5);

    this.doc.rect(xStart1 + colWidth1, this.currentY, colWidth2, rowHeight);
    
    if (leftHighlight) {
      this.doc.setFillColor(255, 255, 0);
      const textWidth = this.doc.getTextWidth(leftValue.toString());
      this.doc.rect(xStart1 + colWidth1 + 1, this.currentY + 0.5, textWidth + 2, 3, 'F');
    }
    
    this.doc.text(leftValue.toString(), xStart1 + colWidth1 + 1, this.currentY + 2.5);

    // Right side
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(xStart2, this.currentY, colWidth3, rowHeight, 'F');
    this.doc.rect(xStart2, this.currentY, colWidth3, rowHeight);
    this.doc.text(rightLabel, xStart2 + 1, this.currentY + 2.5);

    this.doc.rect(xStart2 + colWidth3, this.currentY, colWidth4, rowHeight);
    
    if (rightHighlight) {
      this.doc.setFillColor(255, 255, 0);
      const textWidth = this.doc.getTextWidth(rightValue.toString());
      this.doc.rect(xStart2 + colWidth3 + 1, this.currentY + 0.5, textWidth + 2, 3, 'F');
    }
    
    this.doc.text(rightValue.toString(), xStart2 + colWidth3 + 1, this.currentY + 2.5);

    this.currentY += rowHeight;
  }

  // Add test sample description table
  addTestSampleDescription(grade, testResults) {
    this.currentY += 4; // Add space

    const pageWidth = 190;
    const srWidth = 12;
    const idWidth = 36.2;
    const dimWidth = 54.3;
    const areaWidth = pageWidth * 0.12;
    const weightWidth = pageWidth * 0.12;
    const loadWidth = pageWidth * 0.22;

    // First row: Grade and Description
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(9);
    
    const gradeColWidth = srWidth + idWidth;
    const gradeText = `GRADE OF CONCRETE: ${grade}`;
    
    // Add yellow highlight for grade
    this.doc.setFillColor(255, 255, 0);
    const textWidth = this.doc.getTextWidth(gradeText);
    const cellCenterX = 10 + gradeColWidth / 2;
    const textStartX = cellCenterX - textWidth / 2;
    this.doc.rect(textStartX - 1, this.currentY + 3, textWidth + 2, 6, 'F');
    
    this.doc.rect(10, this.currentY, gradeColWidth, 12);
    this.doc.text(gradeText, 10 + gradeColWidth/2, this.currentY + 8, { align: 'center' });

    const descColWidth = pageWidth - gradeColWidth;
    this.doc.rect(10 + gradeColWidth, this.currentY, descColWidth, 12);
    this.doc.text('DESCRIPTION OF TEST SAMPLE', 10 + gradeColWidth + descColWidth/2, this.currentY + 8, { align: 'center' });

    this.currentY += 12;

    // Table headers
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(10);
    
    this.doc.rect(10, this.currentY, srWidth, 4);
    this.doc.text('Sr. No.', 10 + srWidth/2, this.currentY + 2.5, { align: 'center' });
    
    this.doc.rect(10 + srWidth, this.currentY, idWidth, 4);
    this.doc.text('ID Mark', 10 + srWidth + idWidth/2, this.currentY + 2.5, { align: 'center' });
    
    this.doc.rect(10 + srWidth + idWidth, this.currentY, dimWidth, 4);
    this.doc.text('Dimensions (mm) (L x B x H)', 10 + srWidth + idWidth + dimWidth/2, this.currentY + 2.5, { align: 'center' });
    
    this.doc.rect(10 + srWidth + idWidth + dimWidth, this.currentY, areaWidth, 4);
    this.doc.text('Area (mm²)', 10 + srWidth + idWidth + dimWidth + areaWidth/2, this.currentY + 2.5, { align: 'center' });
    
    this.doc.rect(10 + srWidth + idWidth + dimWidth + areaWidth, this.currentY, weightWidth, 4);
    this.doc.text('Weight (kg)', 10 + srWidth + idWidth + dimWidth + areaWidth + weightWidth/2, this.currentY + 2.5, { align: 'center' });
    
    this.doc.rect(10 + srWidth + idWidth + dimWidth + areaWidth + weightWidth, this.currentY, loadWidth, 4);
    this.doc.text('Max Load (kN)', 10 + srWidth + idWidth + dimWidth + areaWidth + weightWidth + loadWidth/2, this.currentY + 2.5, { align: 'center' });

    this.currentY += 4;

    // Data rows
    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(10);

    testResults.forEach((result, index) => {
      const dimColWidth = dimWidth / 3;
      
      this.doc.rect(10, this.currentY, srWidth, 4);
      this.doc.text((index + 1).toString(), 10 + srWidth/2, this.currentY + 2.5, { align: 'center' });
      
      this.doc.rect(10 + srWidth, this.currentY, idWidth, 4);
      this.doc.text(result.id_mark || 'N/A', 10 + srWidth + idWidth/2, this.currentY + 2.5, { align: 'center' });
      
      this.doc.rect(10 + srWidth + idWidth, this.currentY, dimColWidth, 4);
      this.doc.text(result.dimension_length?.toString() || 'N/A', 10 + srWidth + idWidth + dimColWidth/2, this.currentY + 2.5, { align: 'center' });
      
      this.doc.rect(10 + srWidth + idWidth + dimColWidth, this.currentY, dimColWidth, 4);
      this.doc.text(result.dimension_width?.toString() || 'N/A', 10 + srWidth + idWidth + dimColWidth + dimColWidth/2, this.currentY + 2.5, { align: 'center' });
      
      this.doc.rect(10 + srWidth + idWidth + dimColWidth * 2, this.currentY, dimColWidth, 4);
      this.doc.text(result.dimension_height?.toString() || 'N/A', 10 + srWidth + idWidth + dimColWidth * 2 + dimColWidth/2, this.currentY + 2.5, { align: 'center' });
      
      this.doc.rect(10 + srWidth + idWidth + dimWidth, this.currentY, areaWidth, 4);
      this.doc.text(result.area?.toString() || 'N/A', 10 + srWidth + idWidth + dimWidth + areaWidth/2, this.currentY + 2.5, { align: 'center' });
      
      this.doc.rect(10 + srWidth + idWidth + dimWidth + areaWidth, this.currentY, weightWidth, 4);
      this.doc.text(result.weight?.toString() || 'N/A', 10 + srWidth + idWidth + dimWidth + areaWidth + weightWidth/2, this.currentY + 2.5, { align: 'center' });
      
      this.doc.rect(10 + srWidth + idWidth + dimWidth + areaWidth + weightWidth, this.currentY, loadWidth, 4);
      this.doc.text(result.crushing_load?.toString() || 'N/A', 10 + srWidth + idWidth + dimWidth + areaWidth + weightWidth + loadWidth/2, this.currentY + 2.5, { align: 'center' });

      this.currentY += 4;
    });

    this.currentY += 4;
  }

  // Add test results table
  addTestResults(testResults, averageStrength) {
    this.currentY += 4;

    const tableWidth = 140;
    const tableXOffset = (this.pageWidth - tableWidth) / 2;

    // Title
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(10);
    const titleText = 'Test Result for Density and Compressive Strength of Concrete Cubes';
    this.doc.text(titleText, tableXOffset + tableWidth/2, this.currentY, { align: 'center' });

    // Underline
    const textWidth = this.doc.getTextWidth(titleText);
    const textStartX = tableXOffset + (tableWidth - textWidth) / 2;
    this.doc.line(textStartX, this.currentY + 1, textStartX + textWidth, this.currentY + 1);

    this.currentY += 8;

    // Table headers
    const srWidthRes = 18;
    const idWidthRes = 22;
    const densityWidthRes = 25;
    const strengthWidth = 40;
    const avgWidth = 35;

    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(10);

    this.doc.rect(tableXOffset, this.currentY, srWidthRes, 12);
    this.doc.text('Sr. No.', tableXOffset + srWidthRes/2, this.currentY + 6, { align: 'center' });

    this.doc.rect(tableXOffset + srWidthRes, this.currentY, idWidthRes, 12);
    this.doc.text('ID Mark', tableXOffset + srWidthRes + idWidthRes/2, this.currentY + 6, { align: 'center' });

    this.doc.rect(tableXOffset + srWidthRes + idWidthRes, this.currentY, densityWidthRes, 12);
    this.doc.text('Density (kg/m³)', tableXOffset + srWidthRes + idWidthRes + densityWidthRes/2, this.currentY + 6, { align: 'center' });

    this.doc.rect(tableXOffset + srWidthRes + idWidthRes + densityWidthRes, this.currentY, strengthWidth, 12);
    this.doc.text('Compressive', tableXOffset + srWidthRes + idWidthRes + densityWidthRes + strengthWidth/2, this.currentY + 2, { align: 'center' });
    this.doc.text('Strength (N/mm²)', tableXOffset + srWidthRes + idWidthRes + densityWidthRes + strengthWidth/2, this.currentY + 8, { align: 'center' });

    this.doc.rect(tableXOffset + srWidthRes + idWidthRes + densityWidthRes + strengthWidth, this.currentY, avgWidth, 12);
    this.doc.text('Average Compressive', tableXOffset + srWidthRes + idWidthRes + densityWidthRes + strengthWidth + avgWidth/2, this.currentY + 2, { align: 'center' });
    this.doc.text('Strength (N/mm²)', tableXOffset + srWidthRes + idWidthRes + densityWidthRes + strengthWidth + avgWidth/2, this.currentY + 8, { align: 'center' });

    this.currentY += 12;

    // Data rows
    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(11);

    testResults.forEach((result, index) => {
      // Calculate density
      const density = result.weight && result.dimension_length && result.dimension_width && result.dimension_height
        ? (result.weight / ((result.dimension_length * result.dimension_width * result.dimension_height) / 1000000000)).toFixed(1)
        : 'N/A';

      this.doc.rect(tableXOffset, this.currentY, srWidthRes, 4);
      this.doc.text((index + 1).toString(), tableXOffset + srWidthRes/2, this.currentY + 2.5, { align: 'center' });

      this.doc.rect(tableXOffset + srWidthRes, this.currentY, idWidthRes, 4);
      this.doc.text(result.id_mark || 'N/A', tableXOffset + srWidthRes + idWidthRes/2, this.currentY + 2.5, { align: 'center' });

      this.doc.rect(tableXOffset + srWidthRes + idWidthRes, this.currentY, densityWidthRes, 4);
      this.doc.text(density, tableXOffset + srWidthRes + idWidthRes + densityWidthRes/2, this.currentY + 2.5, { align: 'center' });

      this.doc.rect(tableXOffset + srWidthRes + idWidthRes + densityWidthRes, this.currentY, strengthWidth, 4);
      this.doc.text(result.compressive_strength?.toString() || 'N/A', tableXOffset + srWidthRes + idWidthRes + densityWidthRes + strengthWidth/2, this.currentY + 2.5, { align: 'center' });

      // Only show average strength in first row with highlight
      if (index === 0) {
        this.doc.rect(tableXOffset + srWidthRes + idWidthRes + densityWidthRes + strengthWidth, this.currentY, avgWidth, 4 * testResults.length);
        
        // Add yellow highlight for average strength
        this.doc.setFillColor(255, 255, 0);
        const avgText = averageStrength?.toString() || 'N/A';
        const avgTextWidth = this.doc.getTextWidth(avgText);
        const avgCellX = tableXOffset + srWidthRes + idWidthRes + densityWidthRes + strengthWidth;
        const avgCellCenterX = avgCellX + avgWidth / 2;
        const avgTextStartX = avgCellCenterX - avgTextWidth / 2;
        this.doc.rect(avgTextStartX - 3, this.currentY + (4 * testResults.length - 6) / 2, avgTextWidth + 6, 6, 'F');
        
        this.doc.setFont('times', 'bold');
        this.doc.setFontSize(12);
        this.doc.text(avgText, avgCellCenterX, this.currentY + (4 * testResults.length) / 2, { align: 'center' });
        this.doc.setFont('times', 'normal');
        this.doc.setFontSize(11);
      }

      this.currentY += 4;
    });

    this.currentY += 4;
  }

  // Add terms and conditions
  addTermsAndConditions() {
    this.currentY += 8;

    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(11);
    this.doc.text('Terms & Conditions :-', 10, this.currentY);

    this.currentY += 6;

    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(10);

    const terms = [
      "1) Samples were not drawn by Vitrag Associates LLP lab.",
      "2) The Test Reports & Results pertain to Sample/ Samples of material received by Vitrag Associates LLP lab.",
      "3) The Test Report cannot be reproduced without the written approval of CEO/QM of Vitrag Associates LLP lab.",
      "4) Any change/ correction/ alteration to the Test Report shall be invalid.",
      "5) The role VAs is restricted to testing of the material sample as received in the laboratory. Vitrag Associates LLP lab or any of its employees shall not be liable for any dispute/ litigation arising between the customer & Third Party on account of test results. Vitrag Associates LLP lab shall not interact with any Third Party in this regard.",
      "6) The CEO of Vitrag Associates LLP lab may make necessary changes to the terms & conditions without any prior notice."
    ];

    terms.forEach(term => {
      if (term.length > 80) {
        const lines = this.doc.splitTextToSize(term, 190);
        lines.forEach(line => {
          this.doc.text(line, 10, this.currentY);
          this.currentY += 4;
        });
        this.currentY += 0.5;
      } else {
        this.doc.text(term, 10, this.currentY);
        this.currentY += 4.5;
      }
    });
  }

  // Add signature section
  addSignatureSection(reviewerInfo) {
    this.currentY += 12;

    // Left side - Reviewed by
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 80, 160);
    this.doc.text('Reviewed by -', 28, this.currentY);

    // Stamp placeholder
    this.doc.setFillColor(200, 200, 200);
    this.doc.rect(90, this.currentY, 30, 30, 'F');
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('STAMP', 105, this.currentY + 15, { align: 'center' });

    // Right side - Authorized by
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 80, 160);
    this.doc.text('Authorized by -', 122, this.currentY);

    this.currentY += 8;

    // Reviewer details
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 80, 160);
    this.doc.text(reviewerInfo.name || 'Lalita S. Dussa', 45, this.currentY);

    this.currentY += 8;
    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(9);
    this.doc.text(`(${reviewerInfo.designation || 'Quality Manager'})`, 45, this.currentY);

    this.currentY += 8;
    this.doc.text(reviewerInfo.graduation || 'B.Tech.(Civil)', 45, this.currentY);

    // Authorized details
    const authY = this.currentY - 16;
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 80, 160);
    this.doc.text('Mr. Prakarsh A Sangave', 135, authY);

    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(9);
    this.doc.text('(Chief Executive Officer)', 135, authY + 8);
    this.doc.text('M.E(Civil-Structures)', 135, authY + 16);
    this.doc.text('MTech (Civil-Geotechnical), M.I.E, F.I.E.', 135, authY + 24);
  }

  // Add footer
  addFooter(pageNumber, totalPages) {
    const footerY = 265;

    // Line 1: Address centered, Page number right
    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(255, 0, 0);
    this.doc.text('34A/26 West, New Pachha Peth, Ashok Chowk, Solapur', this.pageWidth/2, footerY, { align: 'center' });

    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`Page ${pageNumber} of ${totalPages}`, 150, footerY, { align: 'right' });

    // Line 2: VA/TR left, Contact center, Issue right
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('VA/TR/I-3/24', 10, footerY + 4);

    this.doc.setTextColor(255, 0, 0);
    this.doc.text('Mob. No.-9552529235, 8830263787, E-mail: vitragassociates3@gmail.com', this.pageWidth/2, footerY + 4, { align: 'center' });

    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Issue No. 03', 150, footerY + 4, { align: 'right' });
  }

  // Add end of report
  addEndOfReport() {
    const endReportY = 265;

    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);

    const endText = 'X----------X----------X----------X----------X----------END OF REPORT----------X----------X----------X----------X----------X';
    this.doc.text(endText, this.pageWidth/2, endReportY, { align: 'center' });
  }

  // Generate the complete PDF
  generatePDF(testData) {
    const { test_request, customer, main_test, reviewer_info } = testData;

    // Format dates
    const receiptDate = test_request.receipt_date || '04/09/2025';
    const castingDate = main_test.casting_date || '04/08/2025';
    const testingDate = main_test.testing_date || '04/09/2025';
    const reportDate = new Date().toLocaleDateString('en-GB');
    const ageInDays = main_test.age_in_days || 28;

    // Parse test results
    let testResults = [];
    if (main_test.test_results_json) {
      try {
        testResults = JSON.parse(main_test.test_results_json);
      } catch (e) {
        console.error('Error parsing test results:', e);
      }
    }

    // If no test results, create default ones
    if (testResults.length === 0) {
      testResults = [
        {
          cube_id: 1,
          id_mark: 'C1',
          dimension_length: 150,
          dimension_width: 150,
          dimension_height: 150,
          weight: 8.5,
          crushing_load: 562.5,
          compressive_strength: 25.0,
          area: 22500
        },
        {
          cube_id: 2,
          id_mark: 'C2',
          dimension_length: 150,
          dimension_width: 150,
          dimension_height: 150,
          weight: 8.4,
          crushing_load: 555.0,
          compressive_strength: 24.7,
          area: 22500
        },
        {
          cube_id: 3,
          id_mark: 'C3',
          dimension_length: 150,
          dimension_width: 150,
          dimension_height: 150,
          weight: 8.6,
          crushing_load: 570.0,
          compressive_strength: 25.3,
          area: 22500
        }
      ];
    }

    // Add header
    this.addStandardHeader('TEST REPORT', 1);

    // Customer/Site Name & Address (merged cell)
    const customerName = customer.name || test_request.customer_name || 'N/A';
    const addressText = customer.address || test_request.site_name || 'N/A';
    const combinedText = `${customerName}, ${addressText}`;

    // Left side - merged cell for Customer/Site Name & Address
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(10, this.currentY, 45.6, 15, 'F');
    this.doc.rect(10, this.currentY, 45.6, 15);
    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(9);
    this.doc.text('Customer/Site Name &', 11, this.currentY + 3);
    this.doc.text('Address', 11, this.currentY + 7);

    // Right side - Date of Report
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(55.6, this.currentY, 49.4, 4, 'F');
    this.doc.rect(55.6, this.currentY, 49.4, 4);
    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(11);
    this.doc.text('Date of Report', 56.6, this.currentY + 2.5);

    this.doc.rect(105, this.currentY, 49.4, 4);
    this.doc.text(reportDate, 106, this.currentY + 2.5);

    // Right side - ULR Number
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(55.6, this.currentY + 4, 49.4, 11, 'F');
    this.doc.rect(55.6, this.currentY + 4, 49.4, 11);
    this.doc.text('ULR Number', 56.6, this.currentY + 9.5);

    this.doc.rect(105, this.currentY + 4, 49.4, 11);
    this.doc.text(test_request.ulr_number || 'N/A', 106, this.currentY + 9.5);

    // Customer name and address
    this.doc.rect(55.6, this.currentY, 49.4, 15);
    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(9);
    const lines = this.doc.splitTextToSize(combinedText, 48);
    lines.forEach((line, index) => {
      this.doc.text(line, 56.6, this.currentY + 3 + (index * 4));
    });

    this.currentY += 15;

    // Add table rows
    this.addTableRowPair('Reference Number', main_test.sample_code_number || 'N/A', 'Job Code Number', test_request.job_number || 'N/A');
    this.addTableRow('Location/Structure Type', main_test.location_nature || 'N/A', false);
    this.addTableRowPair('Date of Receipt', receiptDate, 'Age of Specimen', `${ageInDays} Days`, false, true);
    this.addTableRowPair('Date of Casting', castingDate, 'Date of Testing', testingDate, true, false);
    
    const specimenType = test_request.test_type === 'CC' ? 'Concrete Cube' : test_request.test_type === 'MT' ? 'Material Test' : 'NDT';
    this.addTableRowPair('Type of Specimen', specimenType, 'Grade of Specimen', main_test.grade || 'N/A', false, true);
    
    this.addTableRowPair('Condition of Specimen', main_test.cube_condition || 'Acceptable', 'Curing Condition', main_test.curing_condition || '');
    this.addTableRow('Machine used for Testing', main_test.machine_used || 'CTM (2000KN)', false);
    this.addTableRowPair('Capacity Range', '2000KN', 'Calibration Due Date', '01/07/2026');
    this.addTableRowPair('Test Method', main_test.test_method || 'IS 516 (Part 1/Sec 1):2021', 'Environmental condition', 'Not Applicable');

    // Add test sample description
    this.addTestSampleDescription(main_test.grade || 'M25', testResults);

    // Add test results
    this.addTestResults(testResults, main_test.average_strength || 25.0);

    // Add terms and conditions
    this.addTermsAndConditions();

    // Add signature section
    this.addSignatureSection(reviewer_info);

    // Add end of report
    this.addEndOfReport();

    // Add footer
    this.addFooter(1, 1);

    return this.doc;
  }
}

export default VitragPDFGenerator;
