#!/usr/bin/env python3
import requests
import json

# Test the API endpoint directly
try:
    print("🔍 Testing API endpoint...")
    response = requests.get('https://testinglab.vitragassollp.com/api/test-requests')
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"📊 Number of test requests: {len(data)}")
        if len(data) > 0:
            print("📋 First test request:")
            print(json.dumps(data[0], indent=2))
        else:
            print("❌ No test requests found in API response")
    else:
        print(f"❌ API Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend server. Make sure it's running on https://testinglab.vitragassollp.com")
except Exception as e:
    print(f"❌ Error: {e}")
