const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();
const PORT = 3001;

// Serve static files from public directory
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// PDF generation endpoint
app.get('/generate-pdf', async (req, res) => {
  try {
    console.log('PDF generation request received');
    
    // Get the report URL from query parameters
    const reportUrl = req.query.url || 'http://localhost:3000/LiquidAdmixtureReport.html';
    
    console.log('Generating PDF from URL:', reportUrl);
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to A4 size
    await page.setViewport({
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      deviceScaleFactor: 2 // Higher resolution for better quality
    });
    
    // Navigate to the report page
    await page.goto(reportUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for any dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate PDF with exact A4 formatting
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false
    });
    
    await browser.close();
    
    console.log('PDF generated successfully');
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Liquid_Admixture_Report.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send the PDF
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'PDF Generator' });
});

app.listen(PORT, () => {
  console.log(`PDF Server running on http://localhost:${PORT}`);
  console.log('PDF generation endpoint: http://localhost:3001/generate-pdf');
});
