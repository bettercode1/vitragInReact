#!/usr/bin/env python3
"""
Test script to verify the Flask API endpoint works correctly
"""

import requests
import json

def test_customers_api():
    """Test the /api/customers endpoint"""
    try:
        # Test the API endpoint
        response = requests.get('https://testinglab.vitragassollp.com/api/customers')
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API endpoint working! Found {len(data)} customers")
            print("Sample data:")
            for i, customer in enumerate(data[:3]):  # Show first 3 customers
                print(f"  Customer {i+1}: {customer}")
        else:
            print(f"❌ API endpoint failed with status {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to Flask server. Make sure it's running on https://testinglab.vitragassollp.com")
    except Exception as e:
        print(f"❌ Error testing API: {str(e)}")

if __name__ == "__main__":
    print("Testing Flask API integration...")
    test_customers_api()
