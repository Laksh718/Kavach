import os
import sys

# Add project root to path so we can import backend
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_parametric_flow():
    print("\n--- 🔬 Starting Parametric Flow verification ---")

    # 1. Create Worker
    worker_payload = {
        "name": "Ravi Kumar",
        "email": f"ravi_{os.getpid()}@example.com", # avoid duplicate email constraints
        "phone": "9876543210",
        "location": "Chennai",
        "base_income_daily": 1000.0,
        "upi_id": "ravi@upi"
    }
    print("Creating Worker...")
    res = client.post("/api/v1/workers/", json=worker_payload)
    assert res.status_code == 200, res.text
    worker = res.json()
    print(f"✅ Created Worker ID: {worker['id']}")

    # 2. Buy Policy
    policy_payload = {
        "worker_id": worker['id'],
        "daily_coverage": 1200.0,
        "rain_threshold_mm": 50.0 
    }
    print("\nCreating Policy (Buying protection)...")
    res = client.post("/api/v1/policies/", json=policy_payload)
    assert res.status_code == 200, res.text
    policy = res.json()
    print(f"✅ Created Policy ID: {policy['id']}")
    print(f"💡 AI Risk Engine calculated Weekly Premium: ₹{policy['weekly_premium']}")

    # 3. Simulate Disruption Event (Rainfall)
    # 65mm Rainfall in Chennai
    event_payload = {
        "event_type": "Rain",
        "severity_value": 65.0,
        "location": "Chennai"
    }
    print(f"\n🚀 Simulating disruption event: 65mm Rain in Chennai...")
    res = client.post("/api/v1/simulate/trigger_event", json=event_payload)
    assert res.status_code == 200, res.text
    event = res.json()
    print(f"✅ Event Logged ID: {event['id']} in {event['location']}")

    # 4. Verify Auto-Payouts
    print("\nFetching Automated Payout records...")
    res = client.get("/api/v1/simulate/payouts")
    assert res.status_code == 200, res.text
    payouts = res.json()
    
    # Filter for our worker
    worker_payouts = [p for p in payouts if p['worker_id'] == worker['id']]
    
    if worker_payouts:
        print(f"✅ Parametric Trigger matched! Direct Payouts Found:")
        for payout in worker_payouts:
            status_emoji = "💸" if payout['status'] == "APPROVED" else "⚠️"
            print(f"   - Amount: ₹{payout['amount']} | Status: {payout['status']} {status_emoji}")
    else:
        print("❌ No payout found for this worker immediately. Checks failed or mismatch.")

if __name__ == "__main__":
    try:
        test_parametric_flow()
    except Exception as e:
        print(f"\n❌ Verification Error: {e}")
