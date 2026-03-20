import urllib.request
import json
import time

def test_endpoint(url, data):
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as f:
            response = f.read().decode('utf-8')
            return json.loads(response)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    time.sleep(1)  # Minimal wait for server to start in separate process
    print("Testing Disruption Endpoint...")
    disruption_data = {
        "rainfall": 75,
        "aqi": 200,
        "temperature": 30
    }
    res_disruption = test_endpoint("http://127.0.0.1:8000/predict/disruption", disruption_data)
    print("Disruption Response:", res_disruption)

    print("\nTesting Earnings Endpoint...")
    earnings_data = {
        "day_of_week": 5,
        "hour_bucket": 2,
        "city": 1,
        "platform": 0,
        "rainfall": 70,
        "aqi": 200,
        "worker_avg": 250
    }
    res_earnings = test_endpoint("http://127.0.0.1:8000/predict/earnings", earnings_data)
    print("Earnings Response:", res_earnings)
