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
    time.sleep(2)  # Wait for reload
    print("Testing Pipeline Endpoint...")
    data = {
      "event": {
        "rainfall": 80,
        "aqi": 200,
        "temperature": 30,
        "day_of_week": 5,
        "hour_bucket": 2,
        "city": 1,
        "platform": 0
      },
      "worker": {
        "worker_id": 101,
        "avg_earnings": 300,
        "actual_earnings": 120,
        "fraud_features": {
          "active_hours": 5,
          "gps_variance": 1.5,
          "earnings_drop": 0.6,
          "claim_frequency": 1
        }
      }
    }
    
    res = test_endpoint("http://127.0.0.1:8000/run-pipeline", data)
    print("Pipeline Response:", res)
