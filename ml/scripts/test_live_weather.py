import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.services.pipeline_service import run_pipeline_with_live_weather

worker = {
    "worker_id": 301,
    "avg_earnings": 300,
    "actual_earnings": 100,
    "fraud_features": {
        "active_hours": 5,
        "gps_variance": 1.2,
        "earnings_drop": 0.7,
        "claim_frequency": 1
    }
}

print("🌤️ Running Live Weather Pipeline Test...")
result = run_pipeline_with_live_weather("Chennai", worker)

print("\n🔥 LIVE PIPELINE RESULT:")
print(result)
