import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.services.pipeline_service import run_full_pipeline

event = {
    "rainfall": 80,
    "aqi": 200,
    "temperature": 30,
    "day_of_week": 5,
    "hour_bucket": 2,
    "city": 1,
    "platform": 0
}

worker = {
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

result = run_full_pipeline(event, worker)

print("\n🔥 FINAL RESULT:")
print(result)
