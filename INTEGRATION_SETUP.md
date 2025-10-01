# React + Flask + PostgreSQL Integration Setup

This document explains how to set up and test the React frontend with Flask backend integration.

## Backend Setup (Flask + PostgreSQL)

1. **Install dependencies:**
   ```bash
   cd vitrag/backend
   pip install -r requirements.txt
   ```

2. **Start the Flask server:**
   ```bash
   cd vitrag/backend
   python app.py
   ```
   The server will run on `http://localhost:5000`

3. **Test the API endpoint:**
   ```bash
   curl http://localhost:5000/api/customers
   ```
   Or use the test script:
   ```bash
   python test_integration.py
   ```

## Frontend Setup (React)

1. **Install dependencies:**
   ```bash
   cd vitrag
   npm install
   ```

2. **Start the React development server:**
   ```bash
   npm start
   ```
   The React app will run on `http://localhost:3000`

3. **Test the integration:**
   - Navigate to `http://localhost:3000/customers-list`
   - You should see a list of customers fetched from the Flask API

## API Endpoint Details

- **URL:** `http://localhost:5000/api/customers`
- **Method:** GET
- **Response Format:**
  ```json
  [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "phone": "1234567890",
      "email": "john@example.com"
    }
  ]
  ```

## CORS Configuration

The Flask app is configured with CORS to allow requests from `http://localhost:3000` (React development server).

## Troubleshooting

1. **Flask server not starting:**
   - Check if PostgreSQL is running
   - Verify database connection in `app.py`
   - Install missing dependencies: `pip install flask-cors`

2. **React can't fetch data:**
   - Ensure Flask server is running on port 5000
   - Check browser console for CORS errors
   - Verify the API endpoint is accessible: `http://localhost:5000/api/customers`

3. **Database connection issues:**
   - Check PostgreSQL is running
   - Verify database credentials in `app.py`
   - Ensure the `customer` table exists with the required columns
