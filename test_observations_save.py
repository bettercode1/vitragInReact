#!/usr/bin/env python3
"""
Test script to verify that test observations are being saved correctly
"""

import requests
import json
from datetime import datetime

# Configuration
API_BASE_URL = "http://localhost:5000"  # Change if your backend runs on different port

def test_observations_save():
    """Test saving test observations with sample data"""
    
    # Sample test data (Python-style structure like your previous system)
    test_data = {
        "rows": [  # Main data array like Python system
            {
                "cube_id": "C1",
                "dimension_length": 150.5,
                "dimension_width": 150.2,
                "dimension_height": 150.8,
                "weight": 8.25,
                "crushing_load": 580.5,
                "compressive_strength": 25.8,
                "failure_type": 1
            },
            {
                "cube_id": "C2", 
                "dimension_length": 150.3,
                "dimension_width": 150.1,
                "dimension_height": 150.7,
                "weight": 8.20,
                "crushing_load": 570.2,
                "compressive_strength": 25.3,
                "failure_type": 1
            },
            {
                "cube_id": "C3",
                "dimension_length": 150.4,
                "dimension_width": 150.0,
                "dimension_height": 150.9,
                "weight": 8.30,
                "crushing_load": 560.8,
                "compressive_strength": 24.9,
                "failure_type": 1
            }
        ],
        # Individual form fields (like Python system)
        "sample_description": "Concrete Cube Specimen",
        "cube_condition": "Good",
        "curing_condition": "Water Curing",
        "machine_used": "CTM (2000KN)",
        "test_method": "IS 516 (Part1/Sec1):2021",
        "average_strength": 25.5,
        "tested_by": "John Doe",
        "checked_by": "Jane Smith", 
        "verified_by": "Mr. P A Sanghave",
        "test_remarks": "Test completed successfully",
        "capturedImages": {
            # Sample base64 image data (truncated for brevity)
            "front_failure_1": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
            "digital_reading_1": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
            "back_failure_1": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
        },
        "testRequestId": 1,  # Change this to an existing test request ID
        "timestamp": datetime.now().isoformat()
    }
    
    print("🧪 Testing Test Observations Save API")
    print("=" * 50)
    
    # Test the API endpoint
    test_request_id = 1  # Change this to an existing test request ID
    url = f"{API_BASE_URL}/api/test-observations/{test_request_id}"
    
    print(f"📡 Sending POST request to: {url}")
    print(f"📊 Test data summary (Python-style):")
    print(f"   - Rows data: {len(test_data['rows'])} cubes")
    print(f"   - Form fields: sample_description, tested_by, etc.")
    print(f"   - Images: {len(test_data['capturedImages'])}")
    
    try:
        response = requests.post(
            url,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        print(f"\n📈 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS! Data saved successfully")
            print(f"   - Message: {result.get('message', 'N/A')}")
            print(f"   - Test Request ID: {result.get('test_request_id', 'N/A')}")
            print(f"   - Concrete Test ID: {result.get('concrete_test_id', 'N/A')}")
            print(f"   - Images Saved: {result.get('images_saved', 0)}")
            print(f"   - Test Rows Saved: {result.get('test_rows_saved', 0)}")
        else:
            print("❌ ERROR! Failed to save data")
            print(f"   - Status: {response.status_code}")
            print(f"   - Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ CONNECTION ERROR!")
        print("   Make sure your backend server is running on http://localhost:5000")
        print("   Run: cd vitrag/backend && python app.py")
        
    except requests.exceptions.Timeout:
        print("❌ TIMEOUT ERROR!")
        print("   Request took too long to complete")
        
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {e}")
    
    print("\n" + "=" * 50)
    print("Test completed!")

if __name__ == "__main__":
    test_observations_save()
