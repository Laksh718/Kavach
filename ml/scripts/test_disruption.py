import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.services.disruption_service import evaluate_disruption

event = {
    "rainfall": 80,
    "aqi": 180,
    "temperature": 32
}

result = evaluate_disruption(event)

print("\n🔥 Backend Disruption Result:")
print(result)
