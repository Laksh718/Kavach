import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from backend.app.services.disruption_service import evaluate_disruption
from backend.app.services.earnings_service import get_expected_earnings
from backend.app.services.fraud_service import is_fraudulent
from backend.app.services.payout_service import create_payout

def run_full_pipeline(event: dict, worker: dict):
    """
    event:
    {
        "rainfall": 80,
        "aqi": 200,
        "temperature": 30,
        "day_of_week": 5,
        "hour_bucket": 2,
        "city": 1,
        "platform": 0
    }

    worker:
    {
        "worker_id": 101,
        "avg_earnings": 300,
        "actual_earnings": 120,
        "fraud_features": {...}
    }
    """

    print("\n🚀 Starting Full Pipeline")

    # STEP 1: Disruption detection
    disruption_result = evaluate_disruption(event)

    if disruption_result["disruption"] == 0:
        print("❌ No disruption → No payout")
        return {"status": "NO_DISRUPTION"}

    print("⚠️ Disruption detected")

    # STEP 2: Expected earnings
    expected = get_expected_earnings(event, worker["avg_earnings"])
    expected_earnings = expected["expected_earnings"]

    actual = worker["actual_earnings"]

    loss = max(0, expected_earnings - actual)

    print(f"💰 Expected: {expected_earnings}, Actual: {actual}, Loss: {loss}")

    if loss < 50:
        print("❌ Loss too small → No payout")
        return {"status": "NO_SIGNIFICANT_LOSS"}

    # STEP 3: Fraud detection
    fraud_flag = is_fraudulent(worker["fraud_features"])

    if fraud_flag:
        print("🚨 Fraud detected → Hold payout")
        payout = create_payout(worker["worker_id"], amount=0, status="FRAUD_HOLD")
        return {"status": "FRAUD", "payout": payout}

    # STEP 4: Payout decision
    payout_amount = min(loss, 120)  # cap payout

    payout = create_payout(worker["worker_id"], amount=payout_amount, status="APPROVED")

    print("✅ Payout Approved")

    return {
        "status": "APPROVED",
        "payout": payout,
        "loss": loss
    }
