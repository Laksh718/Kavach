from datetime import datetime, timedelta

# Simulated in-memory activity store 
worker_activity_log = {}

def log_worker_activity(worker_id: int, status: str):
    """
    status: "active" or "inactive"
    """
    now = datetime.utcnow()

    if worker_id not in worker_activity_log:
        worker_activity_log[worker_id] = []

    worker_activity_log[worker_id].append({
        "timestamp": now,
        "status": status
    })

def was_worker_active_before(worker_id: int, minutes: int = 60) -> bool:
    """
    Check if worker was active in last X minutes before disruption
    """
    if worker_id not in worker_activity_log:
        return False

    cutoff = datetime.utcnow() - timedelta(minutes=minutes)

    for entry in reversed(worker_activity_log[worker_id]):
        if entry["timestamp"] < cutoff:
            break
        if entry["status"] == "active":
            return True

    return False

def is_worker_inactive_during(worker_id: int, minutes: int = 30) -> bool:
    """
    Check if worker became inactive during disruption window
    """
    if worker_id not in worker_activity_log:
        return False

    cutoff = datetime.utcnow() - timedelta(minutes=minutes)

    for entry in reversed(worker_activity_log[worker_id]):
        if entry["timestamp"] < cutoff:
            break
        if entry["status"] == "inactive":
            return True

    return False

def did_worker_lose_income(worker_id: int) -> bool:
    """
    Core logic:
    active before + inactive during = income loss
    """
    return (
        was_worker_active_before(worker_id)
        and is_worker_inactive_during(worker_id)
    )
