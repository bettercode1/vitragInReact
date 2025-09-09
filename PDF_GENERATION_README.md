# JavaScript PDF Generation

This React application now includes a JavaScript-based PDF generation system that replicates the exact same layout as your Python PDF generation code.

## Features

✅ **Exact Layout Match** - Replicates your Python PDF layout precisely  
✅ **Pure JavaScript** - No backend server required  
✅ **Client-Side Generation** - PDFs generated directly in the browser  
✅ **Same Data Structure** - Uses the same data format as your Python code  
✅ **Professional Styling** - Matches your company branding and colors  

## How It Works

### 1. PDF Generator Class (`src/utils/pdfGenerator.js`)
- **VitragPDFGenerator** class that handles all PDF generation
- Replicates the exact same layout as your Python `new_pdf_format.py`
- Uses jsPDF library for PDF creation
- Includes all the same sections:
  - Company header with logo and NABL certification
  - Test information tables
  - Test sample description
  - Test results with density and compressive strength
  - Terms & conditions
  - Signature section
  - Footer with contact information

### 2. Dashboard Integration
- **"Generate PDF"** button in the Test Management section
- Uses the same mock data structure as your Python code
- Generates PDF instantly in the browser
- Downloads automatically with proper filename

## Usage

1. **Navigate to Dashboard** - Go to the Dashboard page
2. **Click Generate PDF** - Click the green "Generate PDF" button
3. **PDF Downloads** - The PDF will be generated and downloaded automatically

## Data Structure

The PDF generator expects data in the same format as your Python code:

```javascript
{
  test_request: {
    job_number: '1414141414',
    customer_name: 'Shashwat Paratwar',
    site_name: 'Pune',
    receipt_date: '04-09-2025',
    ulr_number: 'ULR-2024-001',
    test_type: 'CC'
  },
  customer: {
    name: 'Shashwat Paratwar',
    address: 'Pune, Maharashtra'
  },
  main_test: {
    sample_code_number: 'SC-2024-001',
    grade: 'M25',
    age_in_days: 28,
    // ... other test properties
  },
  reviewer_info: {
    name: 'Lalita S. Dussa',
    designation: 'Quality Manager',
    graduation: 'B.Tech.(Civil)'
  }
}
```

## Layout Features

### Header Section
- **Company Logo** with gray border (placeholder)
- **NABL Logo** with certification number (placeholder)
- **Company Name** in red: "VITRAG ASSOCIATES LLP"
- **Subtitle** in blue: "(Construction Material Testing Laboratory)"
- **Horizontal line** separator

### Test Information Tables
- **Customer/Site Name & Address** (merged cell)
- **Date of Report** and **ULR Number**
- **Reference Number** and **Job Code Number**
- **Location/Structure Type**
- **Date of Receipt** and **Age of Specimen** (highlighted)
- **Date of Casting** (highlighted) and **Date of Testing**
- **Type of Specimen** and **Grade of Specimen** (highlighted)
- **Condition of Specimen** and **Curing Condition**
- **Machine used for Testing**
- **Capacity Range** and **Calibration Due Date**
- **Test Method** and **Environmental condition**

### Test Sample Description
- **Grade of Concrete** with yellow highlight
- **Description of Test Sample** header
- **Table with columns:**
  - Sr. No.
  - ID Mark
  - Dimensions (L x B x H)
  - Area (mm²)
  - Weight (kg)
  - Max Load (kN)

### Test Results
- **Title:** "Test Result for Density and Compressive Strength of Concrete Cubes"
- **Table with columns:**
  - Sr. No.
  - ID Mark
  - Density (kg/m³)
  - Compressive Strength (N/mm²)
  - Average Compressive Strength (N/mm²) - highlighted

### Terms & Conditions
- All 6 terms exactly as in your Python code
- Proper formatting and spacing

### Signature Section
- **Reviewed by** section with reviewer details
- **Authorized by** section with CEO details
- **Stamp placeholder** in the center

### Footer
- **Address** in red
- **Contact information** in red
- **Page numbers** and **Issue number**
- **VA/TR reference**

## Customization

### Using Real Data
To use real data instead of mock data, update the `generatePDF` function in `Dashboard.js`:

```javascript
const generatePDF = async () => {
  // Replace mock data with real data from your state/props
  const testData = {
    test_request: {
      // Use actual test request data
    },
    // ... other real data
  };
  
  const pdfGenerator = new VitragPDFGenerator();
  const pdfDoc = pdfGenerator.generatePDF(testData);
  pdfDoc.save('Test_Report.pdf');
};
```

### Adding Images
To add actual logos and images:

1. Place image files in the `public` folder
2. Update the `addStandardHeader` method in `pdfGenerator.js`
3. Use `this.doc.addImage()` instead of placeholder rectangles

### Modifying Layout
All layout dimensions and styling are defined in the `VitragPDFGenerator` class. You can modify:
- Font sizes and styles
- Colors and highlights
- Table dimensions
- Spacing and positioning

## Dependencies

- **jsPDF** - For PDF generation
- **React** - For the UI components
- **Bootstrap** - For styling

## Installation

```bash
npm install jspdf
```

The PDF generation is now fully integrated and ready to use! 🎉
