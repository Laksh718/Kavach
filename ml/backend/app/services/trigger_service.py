from sqlalchemy.orm import Session
from backend.app.models.policy import Policy
from backend.app.models.disruption_event import DisruptionEvent
from backend.app.services.payout_service import create_auto_payout
from backend.app.services.fraud_service import is_fraudulent
from backend.app.services.activity_service import did_worker_lose_income

RAIN_THRESHOLD = 50.0
AQI_THRESHOLD = 350.0

def evaluate_disruption(db: Session, event: DisruptionEvent):
    """
    Evaluates disruption event leveraging worker impact timers and fraud baselines.
    Logic: event -> worker impact -> fraud check -> auto-payout
    """
    print(f"[Trigger Engine] Evaluating event: {event.event_type} = {event.severity_value}")

    triggered = False
    
    if event.event_type.lower() == "rain" and event.severity_value > RAIN_THRESHOLD:
        triggered = True
    elif event.event_type.lower() == "aqi" and event.severity_value > AQI_THRESHOLD:
        triggered = True

    if not triggered:
        print("[Trigger Engine] No disruption threshold met.")
        return 0

    print("[Trigger Engine] Disruption detected!")

    # Find active policies for affected location
    policies = db.query(Policy).join(Policy.worker).filter(
        Policy.worker.has(location=event.location),
        Policy.status == "ACTIVE"
    ).all()

    triggered_count = 0
    
    for policy in policies:
        worker_id = policy.worker_id

        # Step 1: Check income loss (Active Before + Inactive During)
        if not did_worker_lose_income(worker_id):
            print(f"[Trigger] Worker {worker_id} not affected (no impact logs found).")
            continue

        # Step 2: Fraud check
        if is_fraudulent(worker_id):
            print(f"[Fraud] Worker {worker_id} flagged.")
            create_auto_payout(db, worker_id=worker_id, event_id=event.id, amount=policy.daily_coverage, status="FRAUD_HOLD")
            continue

        # Step 3: Approve payout
        print(f"[Payout] APPROVED for worker {worker_id} - ₹{policy.daily_coverage}")
        create_auto_payout(db, worker_id=worker_id, event_id=event.id, amount=policy.daily_coverage, status="APPROVED")
        triggered_count += 1

    db.commit()
    return triggered_count
