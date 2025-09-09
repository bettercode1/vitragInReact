# PDF Generation Setup Guide

This guide explains how to set up and use the PDF generation feature that integrates your existing Python PDF generation code with the React frontend.

## Prerequisites

1. **Python 3.x** installed on your system
2. **Node.js** and **npm** installed
3. Your existing Python PDF generation code (`new_pdf_format.py`)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (if not already installed)
pip install fpdf flask
```

### 2. File Structure

Make sure your files are organized as follows:

```
vitrag/
├── src/
│   └── components/
│       └── Dashboard.js          # Updated with PDF generation button
├── refrence/
│   └── new_pdf_format.py        # Your existing PDF generation code
├── pdf_generator.py             # Python integration wrapper
├── server.js                    # Express.js backend server
├── package.json                 # Updated with new dependencies
└── PDF_SETUP.md                # This file
```

### 3. Running the Application

#### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev
```
This will start both the React frontend (port 3000) and the Express backend (port 5000).

#### Option 2: Run Separately
```bash
# Terminal 1: Start React frontend
npm start

# Terminal 2: Start Express backend
npm run server
```

### 4. Using the PDF Generation Feature

1. Navigate to the Dashboard page in your React app
2. Click the **"Generate PDF"** button in the Test Management section
3. The system will:
   - Send test data to the backend
   - Call your Python PDF generation code
   - Generate a PDF with the exact same layout as your original code
   - Download the PDF automatically

## How It Works

### Frontend (React)
- The Dashboard component has a "Generate PDF" button
- When clicked, it sends test data to the backend API
- The data structure matches your Python code's expected format

### Backend (Express.js)
- Receives the test data from the frontend
- Calls the Python PDF generator using `child_process.spawn`
- Returns the generated PDF file to the frontend

### Python Integration
- `pdf_generator.py` acts as a wrapper around your existing `new_pdf_format.py`
- Creates mock objects that match your original data structure
- Calls your existing `generate_exact_format_pdf` function
- Returns the path to the generated PDF

## Data Structure

The React frontend sends data in this format:

```javascript
{
  test_request: {
    id: 1,
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
    location_nature: 'Construction Site',
    age_in_days: 28,
    casting_date: '04-08-2025',
    testing_date: '04-09-2025',
    grade: 'M25',
    // ... other test properties
  },
  reviewer_info: {
    name: 'Lalita S. Dussa',
    designation: 'Quality Manager',
    graduation: 'B.Tech.(Civil)'
  }
}
```

## Customization

### Modifying Test Data
To use real data instead of mock data, update the `generatePDF` function in `Dashboard.js`:

```javascript
const generatePDF = async () => {
  // Replace mock data with real data from your state/props
  const testData = {
    test_request: {
      // Use actual test request data
    },
    // ... other data
  };
  
  // Rest of the function remains the same
};
```

### Adding More PDF Templates
To add more PDF generation options:

1. Create additional Python wrapper functions in `pdf_generator.py`
2. Add new API endpoints in `server.js`
3. Add new buttons in your React components

## Troubleshooting

### Common Issues

1. **Python not found**: Make sure Python is in your system PATH
2. **Module import errors**: Check that `new_pdf_format.py` is in the `refrence/` directory
3. **PDF generation fails**: Check the console logs for detailed error messages
4. **CORS errors**: Make sure the backend server is running on port 5000

### Debug Mode

To see detailed logs, check the browser console and the terminal where the backend server is running.

## Production Deployment

For production deployment:

1. Build the React app: `npm run build`
2. Serve the built files with your Express server
3. Ensure Python and all dependencies are installed on the production server
4. Set up proper error handling and logging

## Support

If you encounter any issues:

1. Check the console logs in both browser and terminal
2. Verify all dependencies are installed
3. Ensure file paths are correct
4. Test the Python PDF generation independently first
