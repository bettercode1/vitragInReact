const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// PDF Generation endpoint
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { test_request, customer, main_test, reviewer_info } = req.body;
    
    console.log('Generating PDF for job:', test_request.job_number);
    
    // Call Python PDF generator
    const pdfPath = await generatePDFWithPython(req.body);
    
    if (pdfPath && fs.existsSync(pdfPath)) {
      // Read the generated PDF file
      const pdfBuffer = fs.readFileSync(pdfPath);
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Test_Report_${test_request.job_number}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Send the PDF content
      res.send(pdfBuffer);
      
      // Clean up temporary file
      try {
        fs.unlinkSync(pdfPath);
      } catch (cleanupError) {
        console.warn('Could not delete temporary PDF file:', cleanupError);
      }
    } else {
      throw new Error('PDF generation failed - no file created');
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF: ' + error.message });
  }
});

// Function to call Python PDF generator
function generatePDFWithPython(data) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['pdf_generator.py', JSON.stringify(data)], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        const pdfPath = stdout.trim();
        resolve(pdfPath);
      } else {
        console.error('Python process error:', stderr);
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
      }
    });
    
    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
}

// Mock PDF generation function
function generateMockPDF(test_request, customer, main_test, reviewer_info) {
  // This is a placeholder - in real implementation, you would:
  // 1. Call your Python PDF generation function
  // 2. Use a library like pdfkit or puppeteer
  // 3. Or integrate with your existing Python backend
  
  // For now, return a simple text response
  const pdfContent = `
    TEST REPORT
    ===========
    
    Job Number: ${test_request.job_number}
    Customer: ${customer.name}
    Site: ${customer.address}
    Date: ${test_request.receipt_date}
    
    Test Details:
    - Grade: ${main_test.grade}
    - Age: ${main_test.age_in_days} days
    - Compressive Strength: ${main_test.compressive_strength} N/mm²
    - Average Strength: ${main_test.average_strength} N/mm²
    
    Reviewed by: ${reviewer_info.name}
    Designation: ${reviewer_info.designation}
  `;
  
  // In a real implementation, this would be actual PDF binary data
  return Buffer.from(pdfContent, 'utf8');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PDF Generation Server is running' });
});

app.listen(PORT, () => {
  console.log(`PDF Generation Server running on port ${PORT}`);
});
