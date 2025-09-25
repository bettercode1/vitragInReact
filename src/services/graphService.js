/**
 * Graph Generation Service
 * Handles communication with the Python Matplotlib graph generation backend
 */

const GRAPH_API_BASE_URL = 'http://localhost:5001/api';

class GraphService {
    /**
     * Generate a compressive strength graph for cube testing results
     * @param {Object} testData - Test data containing results
     * @returns {Promise<Object>} Graph generation result
     */
    static async generateStrengthGraph(testData) {
        try {
            const response = await fetch(`${GRAPH_API_BASE_URL}/generate-strength-graph`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Graph generation failed');
            }

            const result = await response.json();
            return {
                success: true,
                imageData: result.imageData,
                graphType: result.graphType,
                jobNumber: result.jobNumber
            };
        } catch (error) {
            console.error('Error generating strength graph:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate a trend graph for historical test data
     * @param {Object} historicalData - Historical test data
     * @returns {Promise<Object>} Graph generation result
     */
    static async generateTrendGraph(historicalData) {
        try {
            const response = await fetch(`${GRAPH_API_BASE_URL}/generate-trend-graph`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(historicalData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Graph generation failed');
            }

            const result = await response.json();
            return {
                success: true,
                imageData: result.imageData,
                graphType: result.graphType
            };
        } catch (error) {
            console.error('Error generating trend graph:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Check if the graph generation service is available
     * @returns {Promise<Object>} Service status
     */
    static async checkServiceStatus() {
        try {
            const response = await fetch(`${GRAPH_API_BASE_URL}/graph-status`);
            
            if (!response.ok) {
                throw new Error('Service not available');
            }

            const status = await response.json();
            return {
                available: true,
                status: status.status,
                supportedTypes: status.supportedTypes
            };
        } catch (error) {
            console.error('Graph service not available:', error);
            return {
                available: false,
                error: error.message
            };
        }
    }

    /**
     * Prepare test data for graph generation
     * @param {Object} testRequest - Test request data
     * @param {Array} testResults - Array of test results
     * @returns {Object} Formatted data for graph generation
     */
    static prepareTestData(testRequest, testResults) {
        return {
            job_number: testRequest.job_number || testRequest.jobNumber || 'N/A',
            customer_name: testRequest.customer_name || testRequest.customerName || 'N/A',
            site_name: testRequest.site_name || testRequest.siteName || 'N/A',
            grade: testRequest.grade || 'M25',
            casting_date: testRequest.casting_date || testRequest.castingDate || 'N/A',
            test_results: testResults.map((result, index) => ({
                cube_number: index + 1,
                compressive_strength: result.compressive_strength || result.compressiveStrength || 0,
                age_in_days: result.age_in_days || result.ageInDays || 28,
                casting_date: result.casting_date || result.castingDate || 'N/A',
                testing_date: result.testing_date || result.testingDate || 'N/A'
            }))
        };
    }

    /**
     * Convert base64 image data to data URL
     * @param {string} base64Data - Base64 encoded image data
     * @returns {string} Data URL for image display
     */
    static getImageDataUrl(base64Data) {
        return `data:image/png;base64,${base64Data}`;
    }

    /**
     * Download graph as PNG file
     * @param {string} base64Data - Base64 encoded image data
     * @param {string} filename - Filename for download
     */
    static downloadGraph(base64Data, filename = 'graph.png') {
        try {
            const link = document.createElement('a');
            link.href = this.getImageDataUrl(base64Data);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading graph:', error);
        }
    }
}

export default GraphService;
