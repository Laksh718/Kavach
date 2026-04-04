import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from backend.app.services.disruption_service import evaluate_disruption
from backend.app.services.earnings_service import get_expected_earnings
from backend.app.services.fraud_service import is_fraudulent
from backend.app.services.payout_service import create_payout
from backend.app.utils.weather_api import get_weather_data

# [NEW Rules Imports]
from backend.app.services.eligibility_rules import is_event_eligible
from backend.app.services.severity_rules import get_severity_multiplier
from backend.app.services.payout_rules import apply_payout_constraints

def run_full_pipeline(event: dict, worker: dict):
    """
    Hybrid Insurance Pipeline:
    ML Predicts → Rules Decide
    """

    print("\n🚀 Starting Insurance-Grade Pipeline")

    # STEP 1 [ML]: Disruption detection
    disruption_result = evaluate_disruption(event)
    if disruption_result.get("disruption", 0) == 0:
        print("❌ No disruption predicted by ML")
        return {"status": "NO_DISRUPTION"}

    # STEP 2 [RULE]: Coverage Eligibility
    eligible, reason = is_event_eligible(
        event.get("event_description", ""), 
        event.get("city_status", "open")
    )
    if not eligible:
        print(f"🛑 {reason}")
        return {"status": "EXCLUDED", "message": reason}

    # STEP 3 [ML]: Earnings Baseline
    expected = get_expected_earnings(event, worker["avg_earnings"])
    expected_earnings = expected["expected_earnings"]

    # STEP 4 [RULE]: Adjusted Loss Calculation
    actual = worker["actual_earnings"]
    exposure = worker.get("exposure_factor", 1.0)
    raw_loss = max(0, expected_earnings - actual)
    adjusted_loss = raw_loss * exposure
    print(f"💰 Baseline Loss: ₹{raw_loss}, Adjusted (Exposure {exposure}x): ₹{adjusted_loss}")

    # STEP 5 [RULE]: Severity Scaling
    multiplier = get_severity_multiplier(event["rainfall"], event["aqi"])
    if multiplier == 0:
        print("❌ Severity below payout threshold")
        return {"status": "BELOW_THRESHOLD"}

    # STEP 6 [ML]: Fraud detection
    fraud_flag = is_fraudulent(worker["fraud_features"])
    if fraud_flag:
        print("🚨 Fraud detected by ML → Hold payout")
        payout = create_payout(worker["worker_id"], amount=0, status="FRAUD_HOLD")
        return {"status": "FRAUD", "payout": payout}

    # STEP 7 [RULE]: Final Payout Constraints (Cap/Min Loss)
    final_payout_amount = apply_payout_constraints(adjusted_loss, multiplier)
    
    if final_payout_amount == 0:
        print("❌ Final payout reduced to 0 by rules (min threshold/scaling)")
        return {"status": "NO_SIGNIFICANT_PAYOUT"}

    payout = create_payout(worker["worker_id"], amount=final_payout_amount, status="APPROVED")
    print(f"✅ APPROVED: ₹{final_payout_amount} (Multiplier: {multiplier}x)")

    return {
        "status": "APPROVED",
        "payout": payout,
        "adjusted_loss": adjusted_loss,
        "severity_multiplier": multiplier
    }

def run_pipeline_with_live_weather(city: str, worker: dict):
    print(f"\n🌍 Fetching live weather for {city}")
    weather = get_weather_data(city)
    if not weather:
        return {"status": "WEATHER_API_FAILED"}
    print("🌦️ Weather Data:", weather)
    
    # merge weather into event
    event = {
        **weather,
        "day_of_week": 5,
        "hour_bucket": 2,
        "city": 1,
        "platform": 0
    }
    return run_full_pipeline(event, worker)
