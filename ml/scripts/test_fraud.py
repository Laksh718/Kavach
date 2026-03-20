import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.services.fraud_service import is_fraudulent

test_worker = {
    "active_hours": 1,
    "gps_variance": 12,
    "earnings_drop": 0.9,
    "claim_frequency": 8
}

result = is_fraudulent(test_worker)

print("\n🚨 Fraud Result:", result)
