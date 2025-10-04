const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_eHZv0ncD8irC@ep-muddy-pond-a6nccqdf.us-west-2.aws.neon.tech/neondb?sslmode=require"
});

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Routes
app.get('/api/test-requests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM test_requests ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching test requests:', error);
    res.status(500).json({ error: 'Failed to fetch test requests' });
  }
});

app.get('/api/test-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM test_requests WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test request not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching test request:', error);
    res.status(500).json({ error: 'Failed to fetch test request' });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

app.get('/api/samples', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM samples ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching samples:', error);
    res.status(500).json({ error: 'Failed to fetch samples' });
  }
});

app.get('/api/samples/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM samples WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sample not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching sample:', error);
    res.status(500).json({ error: 'Failed to fetch sample' });
  }
});

app.get('/api/test-results/:testRequestId', async (req, res) => {
  try {
    const { testRequestId } = req.params;
    const result = await pool.query('SELECT * FROM samples WHERE test_request_id = $1', [testRequestId]);
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: 'Failed to fetch test results' });
  }
});

// Save test observations
app.post('/api/test-observations/:testRequestId', async (req, res) => {
  try {
    const { testRequestId } = req.params;
    const observationsData = req.body;
    
    console.log('📥 Saving test observations for testRequestId:', testRequestId);
    console.log('📥 Observations data:', JSON.stringify(observationsData, null, 2));
    
    // Extract data from request
    const {
      formData,
      testRows,
      capturedImages,
      grade,
      casting_date,
      testing_date,
      age_in_days,
      sample_code_number,
      location_nature,
      id_mark,
      obs_strength_duration,
      obs_test_results,
      obs_weight,
      obs_failure_pattern,
      obs_bonding,
      obs_strength_criteria
    } = observationsData;
    
    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Update or insert main test record
      const mainTestQuery = `
        INSERT INTO main_tests (
          test_request_id, grade, casting_date, testing_date, age_in_days,
          sample_code_number, location_nature, id_mark, sample_description,
          cube_condition, curing_condition, machine_used, test_method,
          tested_by, checked_by, verified_by, test_remarks,
          obs_strength_duration, obs_test_results, obs_weight, obs_failure_pattern,
          obs_bonding, obs_strength_criteria, observations_json, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, NOW(), NOW())
        ON CONFLICT (test_request_id) 
        DO UPDATE SET
          grade = EXCLUDED.grade,
          casting_date = EXCLUDED.casting_date,
          testing_date = EXCLUDED.testing_date,
          age_in_days = EXCLUDED.age_in_days,
          sample_code_number = EXCLUDED.sample_code_number,
          location_nature = EXCLUDED.location_nature,
          id_mark = EXCLUDED.id_mark,
          sample_description = EXCLUDED.sample_description,
          cube_condition = EXCLUDED.cube_condition,
          curing_condition = EXCLUDED.curing_condition,
          machine_used = EXCLUDED.machine_used,
          test_method = EXCLUDED.test_method,
          tested_by = EXCLUDED.tested_by,
          checked_by = EXCLUDED.checked_by,
          verified_by = EXCLUDED.verified_by,
          test_remarks = EXCLUDED.test_remarks,
          obs_strength_duration = EXCLUDED.obs_strength_duration,
          obs_test_results = EXCLUDED.obs_test_results,
          obs_weight = EXCLUDED.obs_weight,
          obs_failure_pattern = EXCLUDED.obs_failure_pattern,
          obs_bonding = EXCLUDED.obs_bonding,
          obs_strength_criteria = EXCLUDED.obs_strength_criteria,
          observations_json = EXCLUDED.observations_json,
          updated_at = NOW()
        RETURNING id
      `;
      
      const mainTestResult = await client.query(mainTestQuery, [
        testRequestId,
        grade,
        casting_date,
        testing_date,
        age_in_days,
        sample_code_number,
        location_nature,
        id_mark,
        formData?.sampleDescription || 'Concrete Cube Specimen',
        formData?.cubeCondition || 'Acceptable',
        formData?.curingCondition || '',
        formData?.machineUsed || 'CTM (2000KN)',
        formData?.testMethod || 'IS 516 (Part1/Sec1):2021',
        formData?.testedBy || '',
        formData?.checkedBy || '',
        formData?.verifiedBy || 'Mr. P A Sanghave',
        formData?.testRemarks || '',
        obs_strength_duration,
        obs_test_results,
        obs_weight,
        obs_failure_pattern,
        obs_bonding,
        obs_strength_criteria,
        JSON.stringify(observationsData)
      ]);
      
      const mainTestId = mainTestResult.rows[0].id;
      console.log('✅ Main test record saved with ID:', mainTestId);
      
      // 2. Save test results (cube data)
      if (testRows && testRows.length > 0) {
        // Delete existing test results for this test
        await client.query('DELETE FROM test_results WHERE main_test_id = $1', [mainTestId]);
        
        // Insert new test results
        for (const row of testRows) {
          const testResultQuery = `
            INSERT INTO test_results (
              main_test_id, cube_id, dimension_length, dimension_width, dimension_height,
              area, weight, crushing_load, density, compressive_strength, failure_type,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
          `;
          
          await client.query(testResultQuery, [
            mainTestId,
            row.cube_id || row.idMark || `C${testRows.indexOf(row) + 1}`,
            row.dimension_length || row.dimensionLength || null,
            row.dimension_width || row.dimensionWidth || null,
            row.dimension_height || row.dimensionHeight || null,
            row.area || null,
            row.weight || null,
            row.crushing_load || row.crushingLoad || null,
            row.density || null,
            row.compressive_strength || row.compressiveStrength || null,
            row.failure_type || row.failureType || null
          ]);
        }
        console.log('✅ Test results saved:', testRows.length, 'cubes');
      }
      
      // 3. Save captured images
      let imagesSaved = 0;
      if (capturedImages && Object.keys(capturedImages).length > 0) {
        // Delete existing photos for this test
        await client.query('DELETE FROM photos WHERE test_request_id = $1', [testRequestId]);
        
        // Insert new photos
        for (const [key, imageData] of Object.entries(capturedImages)) {
          if (imageData && typeof imageData === 'string') {
            // Parse key to get photo_type and cube_number
            const parts = key.split('_');
            if (parts.length >= 3) {
              const photo_type = parts[0] + '_' + parts[1]; // e.g., "front_failure"
              const cube_number = parts[2]; // e.g., "1"
              
              const photoQuery = `
                INSERT INTO photos (
                  test_request_id, photo_type, cube_number, photo_data, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, NOW(), NOW())
              `;
              
              await client.query(photoQuery, [
                testRequestId,
                photo_type,
                cube_number,
                imageData
              ]);
              imagesSaved++;
            }
          }
        }
        console.log('✅ Images saved:', imagesSaved);
      }
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: 'Test observations saved successfully',
        images_saved: imagesSaved,
        main_test_id: mainTestId
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error saving test observations:', error);
    res.status(500).json({ 
      error: 'Failed to save test observations',
      details: error.message 
    });
  }
});

// Get test observations
app.get('/api/test-observations/:testRequestId', async (req, res) => {
  try {
    const { testRequestId } = req.params;
    
    console.log('📤 Fetching test observations for testRequestId:', testRequestId);
    
    // Get main test data
    const mainTestResult = await pool.query(
      'SELECT * FROM main_tests WHERE test_request_id = $1',
      [testRequestId]
    );
    
    if (mainTestResult.rows.length === 0) {
      return res.json({ isEmpty: true });
    }
    
    const mainTest = mainTestResult.rows[0];
    
    // Get test results (cube data)
    const testResultsResult = await pool.query(
      'SELECT * FROM test_results WHERE main_test_id = $1 ORDER BY cube_id',
      [mainTest.id]
    );
    
    // Get photos
    const photosResult = await pool.query(
      'SELECT * FROM photos WHERE test_request_id = $1 ORDER BY cube_number, photo_type',
      [testRequestId]
    );
    
    // Convert photos to capturedImages format
    const capturedImages = {};
    photosResult.rows.forEach(photo => {
      const key = `${photo.photo_type}_${photo.cube_number}`;
      capturedImages[key] = photo.photo_data;
    });
    
    // Parse observations_json if it exists
    let observationsData = {};
    if (mainTest.observations_json) {
      try {
        observationsData = JSON.parse(mainTest.observations_json);
      } catch (e) {
        console.warn('Failed to parse observations_json:', e);
      }
    }
    
    const response = {
      isEmpty: false,
      formData: {
        sampleDescription: mainTest.sample_description,
        cubeCondition: mainTest.cube_condition,
        curingCondition: mainTest.curing_condition,
        machineUsed: mainTest.machine_used,
        testMethod: mainTest.test_method,
        testedBy: mainTest.tested_by,
        checkedBy: mainTest.checked_by,
        verifiedBy: mainTest.verified_by,
        testRemarks: mainTest.test_remarks,
        obsStrengthDuration: mainTest.obs_strength_duration,
        obsTestResults: mainTest.obs_test_results,
        obsWeight: mainTest.obs_weight,
        obsFailurePattern: mainTest.obs_failure_pattern,
        obsBonding: mainTest.obs_bonding,
        obsStrengthCriteria: mainTest.obs_strength_criteria
      },
      testRows: testResultsResult.rows.map(row => ({
        cube_id: row.cube_id,
        dimension_length: row.dimension_length,
        dimension_width: row.dimension_width,
        dimension_height: row.dimension_height,
        area: row.area,
        weight: row.weight,
        crushing_load: row.crushing_load,
        density: row.density,
        compressive_strength: row.compressive_strength,
        failure_type: row.failure_type
      })),
      capturedImages: capturedImages,
      observationsData: observationsData
    };
    
    console.log('✅ Test observations fetched successfully');
    res.json(response);
    
  } catch (error) {
    console.error('❌ Error fetching test observations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch test observations',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});