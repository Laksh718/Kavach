import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.services.earnings_service import get_expected_earnings

event = {
    "day_of_week": 5,
    "hour_bucket": 2,
    "city": 1,
    "platform": 0,
    "rainfall": 70,
    "aqi": 200
}

result = get_expected_earnings(event)

print("\n🔥 Backend Earnings Result:")
print(result)
