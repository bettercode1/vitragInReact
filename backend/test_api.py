import requests
import json

# Test the API endpoint
url = "http://localhost:5000/api/test-requests"
data = {
    "customer_name": "Jasprit Bumrah",
    "test_type": "CC",
    "job_number": "T-TEST-001",
    "site_name": "Test Site",
    "ulr_number": "ULR-TEST",
    "reference_number": "REF-TEST",
    "receipt_date": "2024-01-15",
    "materials": [],
    "concrete_tests": [{
        "id_mark": "TEST-001",
        "location_nature": "Test Location",
        "grade": "M25",
        "casting_date": "2024-01-10",
        "testing_date": "2024-02-07",
        "quantity": 3,
        "test_method": "IS 516"
    }]
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
