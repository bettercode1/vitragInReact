import requests

def test_all_tests():
    try:
        response = requests.get('http://localhost:5000/api/dashboard/recent-tests')
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: API returned {len(data)} tests")
            print("\nFirst 5 tests:")
            for i, test in enumerate(data[:5]):
                print(f"{i+1}. Job: {test['job_number']} | Customer: {test['customer_name']} | Status: {test['status']}")
        else:
            print(f"❌ ERROR: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    test_all_tests()
