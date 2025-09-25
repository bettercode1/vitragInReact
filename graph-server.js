const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5001; // Different port from the main server

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (generated graphs)
app.use('/graphs', express.static(path.join(__dirname, 'temp')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Graph Generation Service' });
});

// Generate strength graph endpoint
app.post('/api/generate-strength-graph', async (req, res) => {
    try {
        const testData = req.body;
        
        // Validate required data
        if (!testData.test_results || !Array.isArray(testData.test_results)) {
            return res.status(400).json({ 
                error: 'Invalid data: test_results array is required' 
            });
        }
        
        // Call Python script to generate graph
        const pythonProcess = spawn('python', [
            path.join(__dirname, 'graph_generator.py'),
            'strength',
            JSON.stringify(testData)
        ]);
        
        let output = '';
        let errorOutput = '';
        
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                // Success - return base64 image data
                const imageData = output.trim();
                res.json({
                    success: true,
                    imageData: imageData,
                    graphType: 'strength',
                    jobNumber: testData.job_number || 'N/A'
                });
            } else {
                console.error('Python script error:', errorOutput);
                res.status(500).json({
                    error: 'Graph generation failed',
                    details: errorOutput
                });
            }
        });
        
    } catch (error) {
        console.error('Error in strength graph generation:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Generate trend graph endpoint
app.post('/api/generate-trend-graph', async (req, res) => {
    try {
        const historicalData = req.body;
        
        // Validate required data
        if (!historicalData.historical_data || !Array.isArray(historicalData.historical_data)) {
            return res.status(400).json({ 
                error: 'Invalid data: historical_data array is required' 
            });
        }
        
        // Call Python script to generate graph
        const pythonProcess = spawn('python', [
            path.join(__dirname, 'graph_generator.py'),
            'trend',
            JSON.stringify(historicalData)
        ]);
        
        let output = '';
        let errorOutput = '';
        
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                // Success - return base64 image data
                const imageData = output.trim();
                res.json({
                    success: true,
                    imageData: imageData,
                    graphType: 'trend'
                });
            } else {
                console.error('Python script error:', errorOutput);
                res.status(500).json({
                    error: 'Graph generation failed',
                    details: errorOutput
                });
            }
        });
        
    } catch (error) {
        console.error('Error in trend graph generation:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Get graph generation status
app.get('/api/graph-status', (req, res) => {
    res.json({
        status: 'active',
        supportedTypes: ['strength', 'trend'],
        pythonAvailable: true
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Graph Generation Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoints:`);
    console.log(`  POST /api/generate-strength-graph`);
    console.log(`  POST /api/generate-trend-graph`);
    console.log(`  GET /api/graph-status`);
});

module.exports = app;
